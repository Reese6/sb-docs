#!/usr/bin/env node
// Валидатор документации. Node >= 18, без зависимостей.
//
// Проверки:
//   1. LINK-*  — битые относительные ссылки, абсолютные пути, регистр, якоря;
//   2. ID-DUP  — дубликаты requirement ID в пределах scope;
//   3. ID-MALFORMED — некорректный формат ID (FR-01, FR-001a, FR-XXX, fr-001);
//   4. FM-*    — отсутствующий/незакрытый frontmatter, обязательные поля;
//   5. FM-TYPE / FM-ENUM / FM-PATTERN / FM-UNKNOWN-KEY — валидация по схеме;
//   6. ID-UNRESOLVED — ссылки на несуществующие FR/BR/NFR/UI/API/ADR;
//   7. MD-*    — базовая структура Markdown (rules/markdown.md).
// Бонус: FEATURE-FILES — состав feature-директорий (schemas/feature.schema.yaml);
//        CHANGE-FILES — состав change-директорий (schemas/change.schema.yaml).
//
// docs/changes/ (change proposals) обрабатывается особо:
//   - активные proposals — reference-only для ID: строки-определения не
//     регистрируются (нет ID-DUP и загрязнения глобальной области), упоминания
//     резолвятся по объединению всех областей; placeholder <TYPE>-NEW-<n>
//     легален только здесь (вне docs/changes/ — ID-MALFORMED);
//   - docs/changes/archive/ — замороженная история: исключён из FM-/ID-/LINK-
//     проверок (как templates/), остаются только MD-* проверки структуры.
//
// Источник правил frontmatter и ID — schemas/*.yaml (не хардкод).
//
// Сознательно не покрыто:
//   - reference-style ссылки [x]: path (в репозитории не используются);
//   - смысловое совпадение H1 с title (семантика);
//   - соответствие секций шаблонам templates/ (skill documentation-review);
//   - два разных требования с одним ID в одном файле: первое definition-shaped
//     вхождение считается определением, остальные — легальными повторными
//     упоминаниями (rules/linking.md разрешает повтор голым ID).
//
// Exit codes: 0 — чисто; 1 — найдены ошибки; 2 — внутренняя ошибка.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// ---------------------------------------------------------------------------
// Мини-парсер YAML-подмножества: key: value, вложенность по отступу,
// списки "- item", кавычки, комментарии, flow-списки [a, b].
// Достаточен для schemas/*.yaml и frontmatter репозитория; на неподдерживаемом
// синтаксисе вернёт строку "как есть" — извлечение схемы это обнаружит.
// ---------------------------------------------------------------------------

function stripComment(line) {
  let inQuote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '\\' && inQuote === '"') i++;
      else if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i);
    }
  }
  return line;
}

function unquote(value) {
  const v = value.trim();
  if (v.length >= 2 && v[0] === '"' && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\(.)/g, '$1');
  }
  if (v.length >= 2 && v[0] === "'" && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  return v;
}

function parseScalar(value) {
  const v = value.trim();
  const flow = v.match(/^\[(.*)\]$/);
  if (flow) {
    return flow[1].split(',').map((s) => unquote(s)).filter((s) => s !== '');
  }
  return unquote(v);
}

// Возвращает { data, keyLines, dupKeys }; все скаляры — строки (без коэрции:
// version: 0.1 обязан остаться строкой "0.1" для проверки pattern).
export function parseYamlSubset(text) {
  const rawLines = text.split('\n');
  const tokens = [];
  for (let i = 0; i < rawLines.length; i++) {
    const noComment = stripComment(rawLines[i]);
    if (noComment.trim() === '') continue;
    const indent = noComment.match(/^ */)[0].length;
    tokens.push({ indent, text: noComment.trim(), line: i });
  }
  const dupKeys = [];
  const keyLines = {};

  function parseBlock(start, end, indent, depth) {
    if (start >= end) return {};
    const isList = tokens[start].text.startsWith('- ') || tokens[start].text === '-';
    if (isList) {
      const items = [];
      for (let i = start; i < end; i++) {
        const t = tokens[i];
        if (t.indent !== indent) continue; // вложенные структуры в списках не нужны
        items.push(parseScalar(t.text.replace(/^-\s*/, '')));
      }
      return items;
    }
    const map = {};
    let i = start;
    while (i < end) {
      const t = tokens[i];
      if (t.indent !== indent) { i++; continue; }
      const m = t.text.match(/^("(?:[^"\\]|\\.)*"|'[^']*'|[^:\s][^:]*):(.*)$/);
      if (!m) { i++; continue; }
      const key = unquote(m[1]);
      const value = m[2].trim();
      if (Object.hasOwn(map, key)) dupKeys.push({ key, line: t.line });
      if (depth === 0 && !Object.hasOwn(keyLines, key)) keyLines[key] = t.line;
      let next = i + 1;
      while (next < end && tokens[next].indent > indent) next++;
      if (value !== '') {
        map[key] = parseScalar(value);
      } else if (next > i + 1) {
        map[key] = parseBlock(i + 1, next, tokens[i + 1].indent, depth + 1);
      } else {
        map[key] = null;
      }
      i = next;
    }
    return map;
  }

  const data = tokens.length
    ? parseBlock(0, tokens.length, tokens[0].indent, 0)
    : {};
  return { data, keyLines, dupKeys };
}

// ---------------------------------------------------------------------------
// Загрузка схем — source of truth для frontmatter и формата ID.
// ---------------------------------------------------------------------------

function die(message) {
  console.error(`validate-docs: internal error: ${message}`);
  process.exit(2);
}

export function loadSchemas() {
  const read = (p) => {
    const abs = path.join(ROOT, 'schemas', p);
    if (!existsSync(abs)) die(`schema not found: schemas/${p}`);
    return parseYamlSubset(readFileSync(abs, 'utf8')).data;
  };
  const meta = read('metadata.schema.yaml');
  const req = read('requirement.schema.yaml');
  const feat = read('feature.schema.yaml');
  const change = read('change.schema.yaml');

  const props = meta.properties;
  const schema = {
    fmRequired: meta.required,
    fmProperties: props,
    typeEnum: props?.type?.enum,
    statusEnum: props?.status?.enum,
    ownersEnum: props?.owners?.items?.enum,
    ownersMinItems: Number(props?.owners?.minItems ?? 1),
    titleMinLength: Number(props?.title?.minLength ?? 0),
    featurePattern: props?.feature?.pattern,
    versionPattern: props?.version?.pattern,
    idPattern: req.properties?.id?.pattern,
    featureNamePattern: feat.properties?.name?.pattern,
    featureRequiredFiles: (feat.properties?.files?.required ?? []).map(
      (key) => feat.properties?.files?.properties?.[key]?.const
    ),
    changeNamePattern: change.properties?.name?.pattern,
    changeArchivePattern: change.properties?.archiveName?.pattern,
    changeRequiredFiles: (change.properties?.files?.required ?? []).map(
      (key) => change.properties?.files?.properties?.[key]?.const
    ),
  };

  for (const [k, v] of Object.entries(schema)) {
    const bad =
      v === undefined || v === null ||
      (Array.isArray(v) ? v.length === 0 || v.some((x) => x == null) : false) ||
      (typeof v === 'number' && Number.isNaN(v));
    if (bad) die(`cannot extract "${k}" from schemas/*.yaml (unsupported syntax?)`);
  }

  const prefixMatch = schema.idPattern.match(/\(([A-Z|]+)\)/);
  if (!prefixMatch) die(`cannot extract ID prefixes from pattern "${schema.idPattern}"`);
  schema.idPrefixes = prefixMatch[1].split('|');
  return schema;
}

// ---------------------------------------------------------------------------
// Сбор файлов.
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set(['.git', 'node_modules']);
// Директории вне Git: содержимое не проверяется, только README.md.
const LOCAL_DIRS = new Set(['services', 'reports']);

export function collectFiles() {
  const files = [];
  (function walk(dir) {
    for (const name of readdirSync(dir).sort()) {
      const abs = path.join(dir, name);
      const rel = path.relative(ROOT, abs);
      const st = statSync(abs);
      if (st.isDirectory()) {
        if (SKIP_DIRS.has(name)) continue;
        // services/ — локальные клоны чужих репозиториев, reports/ —
        // артефакты прогонов верификации; оба в .gitignore, проверяется
        // только README.md каждой директории.
        if (LOCAL_DIRS.has(rel)) {
          const readme = path.join(abs, 'README.md');
          if (existsSync(readme)) files.push(`${rel}/README.md`);
          continue;
        }
        walk(abs);
      } else if (name.endsWith('.md')) {
        files.push(rel);
      }
    }
  })(ROOT);
  return files;
}

// ---------------------------------------------------------------------------
// Разбор файла: frontmatter, fences, маскирование, заголовки.
// ---------------------------------------------------------------------------

function blank(str) {
  return str.replace(/[^\t]/g, ' ');
}

export function parseFile(rel) {
  const raw = readFileSync(path.join(ROOT, rel), 'utf8');
  const lines = raw.split('\n');

  // Frontmatter: первый блок файла между "---".
  let fmText = null;
  let fmStart = -1;
  let fmEnd = -1; // индекс закрывающего "---"
  let fmUnclosed = false;
  if (lines[0] === '---') {
    fmStart = 0;
    const close = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
    if (close === -1) {
      fmUnclosed = true;
      fmEnd = lines.length - 1;
      fmText = lines.slice(1).join('\n');
    } else {
      fmEnd = close;
      fmText = lines.slice(1, close).join('\n');
    }
  }

  // Fences: state machine по всему файлу (после frontmatter).
  const fences = []; // { openLine, info, closed }
  const inFence = new Array(lines.length).fill(false);
  let open = null;
  for (let i = fmEnd + 1; i < lines.length; i++) {
    const m = lines[i].match(/^\s*(`{3,})(.*)$/);
    if (!open) {
      if (m) {
        open = { openLine: i, info: m[2].trim(), len: m[1].length, closed: false };
        fences.push(open);
        inFence[i] = true;
      }
    } else {
      inFence[i] = true;
      if (m && m[1].length >= open.len && m[2].trim() === '') {
        open.closed = true;
        open = null;
      }
    }
  }

  // Маскирование (замена посимвольно пробелами — номера строк и колонки
  // сохраняются): frontmatter, fences, HTML-комментарии, потом inline-код.
  const masked = lines.slice();
  for (let i = 0; i <= fmEnd; i++) masked[i] = blank(masked[i]);
  for (let i = fmEnd + 1; i < lines.length; i++) {
    if (inFence[i]) masked[i] = blank(masked[i]);
  }
  let inComment = false;
  for (let i = fmEnd + 1; i < lines.length; i++) {
    if (inFence[i]) continue;
    let line = masked[i];
    let out = '';
    let pos = 0;
    while (pos < line.length) {
      if (!inComment) {
        const start = line.indexOf('<!--', pos);
        if (start === -1) { out += line.slice(pos); break; }
        out += line.slice(pos, start);
        inComment = true;
        pos = start;
      } else {
        const end = line.indexOf('-->', pos);
        if (end === -1) { out += blank(line.slice(pos)); break; }
        out += blank(line.slice(pos, end + 3));
        inComment = false;
        pos = end + 3;
      }
    }
    masked[i] = out;
  }
  // Заголовки и списки — до маскирования inline-кода (текст нужен для слагов).
  const headings = []; // { level, text, line }
  for (let i = fmEnd + 1; i < lines.length; i++) {
    if (inFence[i]) continue;
    const m = masked[i].match(/^(#{1,6})\s+(.*)$/);
    if (m) headings.push({ level: m[1].length, text: m[2].trim(), line: i });
  }
  const preInline = masked.slice();
  for (let i = fmEnd + 1; i < lines.length; i++) {
    // Спаны кода: закрывающая последовательность той же длины, что открывающая
    masked[i] = masked[i].replace(/(`+)(.+?)\1(?!`)/g, (m2) => blank(m2));
  }

  return { rel, raw, lines, fmText, fmStart, fmEnd, fmUnclosed, fences, inFence, masked, preInline, headings };
}

// ---------------------------------------------------------------------------
// Проверки.
// ---------------------------------------------------------------------------

const errors = [];
function report(file, line, code, message) {
  errors.push({ file, line: line + 1, code, message });
}

// --- Проверка 7: базовая структура Markdown --------------------------------

function checkStructure(f) {
  for (const fence of f.fences) {
    if (fence.info === '') report(f.rel, fence.openLine, 'MD-FENCE-LANG', 'code fence without language');
    if (!fence.closed) report(f.rel, fence.openLine, 'MD-FENCE-UNCLOSED', 'code fence is not closed');
  }
  const h1 = f.headings.filter((h) => h.level === 1);
  if (h1.length !== 1) {
    report(f.rel, f.headings[0]?.line ?? 0, 'MD-H1', `expected exactly one H1, found ${h1.length}`);
  }
  let prev = 0;
  for (const h of f.headings) {
    if (h.level > prev + 1) {
      report(f.rel, h.line, 'MD-HEADING-SKIP', `heading level jumps from H${prev} to H${h.level}`);
    }
    prev = h.level;
  }
  for (let i = f.fmEnd + 1; i < f.lines.length; i++) {
    if (f.inFence[i]) continue;
    if (/^\s*\*\s+/.test(f.preInline[i])) {
      report(f.rel, i, 'MD-BULLET', 'bullet marker "*" instead of "-"');
    }
  }
  if (!f.raw.endsWith('\n')) {
    report(f.rel, f.lines.length - 1, 'MD-EOF-NEWLINE', 'file does not end with a newline');
  }
}

// --- Проверки 4, 5: frontmatter --------------------------------------------

function isFeatureRootReadme(rel) {
  return /^docs\/features\/[^/]+\/README\.md$/.test(rel);
}

export function featureNameOf(rel) {
  const m = rel.match(/^docs\/features\/([^/]+)\//);
  return m ? m[1] : null;
}

function checkFrontmatter(f, schema) {
  const required = path.basename(f.rel) !== 'README.md' || isFeatureRootReadme(f.rel);
  if (f.fmText === null) {
    if (required) report(f.rel, 0, 'FM-MISSING', 'required YAML frontmatter is missing');
    return null;
  }
  if (f.fmUnclosed) {
    report(f.rel, 0, 'FM-UNCLOSED', 'frontmatter block is not closed with "---"');
    return null;
  }
  const { data: fm, keyLines, dupKeys } = parseYamlSubset(f.fmText);
  const lineOf = (key) => (Object.hasOwn(keyLines, key) ? keyLines[key] + 1 : 0);
  for (const d of dupKeys) {
    report(f.rel, d.line + 1, 'FM-DUPLICATE-KEY', `duplicate frontmatter key "${d.key}"`);
  }
  for (const key of schema.fmRequired) {
    if (!Object.hasOwn(fm, key)) report(f.rel, 0, 'FM-REQUIRED', `missing required frontmatter key "${key}"`);
  }
  for (const key of Object.keys(fm)) {
    if (!Object.hasOwn(schema.fmProperties, key)) {
      report(f.rel, lineOf(key), 'FM-UNKNOWN-KEY', `unknown frontmatter key "${key}"`);
    }
  }
  if (Object.hasOwn(fm, 'type') && !schema.typeEnum.includes(fm.type)) {
    report(f.rel, lineOf('type'), 'FM-TYPE',
      `unknown document type "${fm.type}" (allowed: ${schema.typeEnum.join(', ')})`);
  }
  if (Object.hasOwn(fm, 'status') && !schema.statusEnum.includes(fm.status)) {
    report(f.rel, lineOf('status'), 'FM-ENUM',
      `invalid status "${fm.status}" (allowed: ${schema.statusEnum.join(', ')})`);
  }
  if (Object.hasOwn(fm, 'title')) {
    if (typeof fm.title !== 'string' || fm.title.length < schema.titleMinLength) {
      report(f.rel, lineOf('title'), 'FM-PATTERN', `title is shorter than ${schema.titleMinLength} characters`);
    }
  }
  if (Object.hasOwn(fm, 'version')) {
    const v = typeof fm.version === 'string' ? fm.version : '';
    if (!new RegExp(schema.versionPattern).test(v)) {
      report(f.rel, lineOf('version'), 'FM-PATTERN', `version "${v}" does not match ${schema.versionPattern}`);
    }
  }
  if (Object.hasOwn(fm, 'feature')) {
    const v = typeof fm.feature === 'string' ? fm.feature : '';
    if (!new RegExp(schema.featurePattern).test(v)) {
      report(f.rel, lineOf('feature'), 'FM-PATTERN', `feature "${v}" does not match ${schema.featurePattern}`);
    }
  }
  if (Object.hasOwn(fm, 'owners')) {
    if (!Array.isArray(fm.owners) || fm.owners.length < schema.ownersMinItems) {
      report(f.rel, lineOf('owners'), 'FM-ENUM', `owners must be a list with at least ${schema.ownersMinItems} item(s)`);
    } else {
      for (const o of fm.owners) {
        if (!schema.ownersEnum.includes(o)) {
          report(f.rel, lineOf('owners'), 'FM-ENUM',
            `invalid owner "${o}" (allowed: ${schema.ownersEnum.join(', ')})`);
        }
      }
    }
  }
  if (Object.hasOwn(fm, 'related')) {
    if (!Array.isArray(fm.related)) {
      report(f.rel, lineOf('related'), 'FM-PATTERN', 'related must be a list of relative paths');
    } else {
      for (const p of fm.related) {
        if (!existsSync(path.resolve(ROOT, path.dirname(f.rel), p))) {
          report(f.rel, lineOf('related'), 'FM-RELATED', `related path "${p}" does not exist`);
        }
      }
    }
  }
  // Правило репозитория: документ внутри docs/features/<name>/ обязан иметь
  // feature, совпадающий с именем директории (schemas/metadata.schema.yaml).
  const feature = featureNameOf(f.rel);
  if (feature) {
    if (!Object.hasOwn(fm, 'feature')) {
      report(f.rel, 0, 'FM-FEATURE-MISMATCH', `missing "feature: ${feature}" for a document inside docs/features/${feature}/`);
    } else if (fm.feature !== feature) {
      report(f.rel, lineOf('feature'), 'FM-FEATURE-MISMATCH',
        `feature "${fm.feature}" does not match directory name "${feature}"`);
    }
  }
  return fm;
}

// --- Проверки 2, 3, 6: requirement ID --------------------------------------

// Scope уникальности ID (schemas/README.md): feature-директория или global.
export function scopeOf(rel) {
  const feature = featureNameOf(rel);
  return feature ? `feature:${feature}` : 'global';
}

// docs/changes/ — change proposals: reference-only для ID (см. шапку файла).
export function isChangeDoc(rel) {
  return rel.startsWith('docs/changes/');
}

export function isArchivedChange(rel) {
  return rel.startsWith('docs/changes/archive/');
}

// Копия masked-строк с заблэнкленными URL ссылок — чтобы имена файлов вида
// adr-001-*.md не попадали в ID-сканирование.
function maskLinkTargets(maskedLines) {
  return maskedLines.map((line) =>
    line.replace(/(\]\()([^)]*)(\))/g, (m, a, b, c) => a + blank(b) + c)
  );
}

// scopeOverride — для scripts/spec-inventory.mjs: инвентарь считает
// templates/examples/<name>/ отдельной областью, валидатор их не сканирует.
export function collectDefinitions(f, schema, defs, scopeOverride) {
  const scope = scopeOverride ?? scopeOf(f.rel);
  const referenceOnly = isChangeDoc(f.rel);
  const scan = maskLinkTargets(f.masked);
  const positions = new Set(); // "line:col" определений — исключаются из ссылок
  if (referenceOnly) {
    // Дельты в change proposal не определяют ID — только ссылаются на них.
    return { scan, positions, scope, referenceOnly };
  }
  const nonAdr = schema.idPrefixes.filter((p) => p !== 'ADR').join('|');
  const defRe = new RegExp(`^\\s*(?:-\\s+)?((?:${nonAdr})-\\d{3,})\\s*(?:\\(→[^)]*\\))?\\s*:`);
  const adrRe = new RegExp(`^#\\s+(ADR-\\d{3,})\\b`);
  const seenInFile = new Set();
  for (let i = 0; i < scan.length; i++) {
    const m = scan[i].match(defRe) ?? scan[i].match(adrRe);
    if (!m) continue;
    const id = m[1];
    if (seenInFile.has(id)) continue; // повторное упоминание, не определение
    seenInFile.add(id);
    positions.add(`${i}:${scan[i].indexOf(id)}`);
    (defs[scope] ??= {});
    (defs[scope][id] ??= []).push({ file: f.rel, line: i, text: f.lines[i] });
  }
  return { scan, positions, scope, referenceOnly };
}

function checkIds(f, schema, ctx, defs) {
  const { scan, positions, scope, referenceOnly } = ctx;
  const prefixes = schema.idPrefixes.join('|');

  // Проверка 6: все упоминания ID должны резолвиться в своей области видимости.
  // Change proposal ссылается на ID любых областей — видимость: объединение.
  const visible = referenceOnly
    ? new Set(Object.values(defs).flatMap((byId) => Object.keys(byId)))
    : new Set([
        ...Object.keys(defs[scope] ?? {}),
        ...(scope !== 'global' ? Object.keys(defs.global ?? {}) : []),
      ]);
  const refRe = new RegExp(`\\b(?:${prefixes})-\\d{3,}\\b`, 'g');
  for (let i = 0; i < scan.length; i++) {
    for (const m of scan[i].matchAll(refRe)) {
      if (positions.has(`${i}:${m.index}`)) continue;
      if (!visible.has(m[0])) {
        report(f.rel, i, 'ID-UNRESOLVED', `reference to undefined requirement ${m[0]}`);
      }
    }
  }

  // Проверка 3: malformed ID
  const malformed = [
    [new RegExp(`\\b(?:${prefixes})-\\d{1,2}\\b`, 'g'), 'less than 3 digits'],
    [new RegExp(`\\b(?:${prefixes})-\\d{3,}(?=[A-Za-zА-Яа-я])`, 'g'), 'trailing letters'],
    [new RegExp(`\\b(?:${prefixes})-X{2,}\\b`, 'g'), 'unfilled template placeholder'],
  ];
  if (!referenceOnly) {
    // Placeholder <TYPE>-NEW-<n> легален только внутри docs/changes/
    malformed.push([
      new RegExp(`\\b(?:${prefixes})-NEW-\\d+\\b`, 'g'),
      'placeholder ID outside docs/changes/',
    ]);
  }
  for (let i = 0; i < scan.length; i++) {
    for (const [re, why] of malformed) {
      for (const m of scan[i].matchAll(re)) {
        report(f.rel, i, 'ID-MALFORMED', `malformed requirement ID "${m[0]}" (${why})`);
      }
    }
    // lookaround исключает имена файлов вида decisions/adr-001-*.md
    const caseRe = new RegExp(`(?<![\\w/.-])(?:${prefixes})-\\d{3,}(?![\\w-])`, 'gi');
    for (const m of scan[i].matchAll(caseRe)) {
      const prefix = m[0].split('-')[0];
      if (prefix !== prefix.toUpperCase()) {
        report(f.rel, i, 'ID-MALFORMED', `malformed requirement ID "${m[0]}" (must be uppercase)`);
      }
    }
  }
}

function checkDuplicates(defs) {
  for (const scope of Object.keys(defs)) {
    for (const [id, places] of Object.entries(defs[scope])) {
      const files = [...new Set(places.map((p) => p.file))];
      if (files.length > 1) {
        for (const p of places.slice(1)) {
          const first = places[0];
          report(p.file, p.line, 'ID-DUP',
            `${id} is already defined at ${first.file}:${first.line + 1} (scope: ${scope})`);
        }
      }
    }
  }
}

// --- Проверка 1: относительные ссылки --------------------------------------

const slugCache = new Map();

function githubSlug(text, used) {
  let s = text.trim().toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s+/g, '-');
  const n = used.get(s) ?? 0;
  used.set(s, n + 1);
  return n === 0 ? s : `${s}-${n}`;
}

function headingSlugsOf(absPath, fileCache) {
  if (slugCache.has(absPath)) return slugCache.get(absPath);
  const rel = path.relative(ROOT, absPath);
  const parsed = fileCache.get(rel) ?? parseFile(rel);
  const used = new Map();
  const slugs = new Set(parsed.headings.map((h) => githubSlug(h.text, used)));
  slugCache.set(absPath, slugs);
  return slugs;
}

// Сверка регистра каждого сегмента: existsSync на APFS нечувствителен
// к регистру, а в CI на Linux такая ссылка сломается.
function checkCase(f, line, absTarget) {
  const relSegments = path.relative(ROOT, absTarget).split(path.sep);
  let dir = ROOT;
  for (const seg of relSegments) {
    if (seg === '..') return;
    if (!readdirSync(dir).includes(seg)) {
      report(f.rel, line, 'LINK-CASE', `path segment "${seg}" differs in case from the real file name`);
      return;
    }
    dir = path.join(dir, seg);
  }
}

function checkLinks(f, fileCache) {
  const linkRe = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (let i = 0; i < f.masked.length; i++) {
    for (const m of f.masked[i].matchAll(linkRe)) {
      let target = m[1].replace(/^<|>$/g, '');
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // https:, mailto:, ...
      if (target.startsWith('/')) {
        report(f.rel, i, 'LINK-ABSOLUTE', `absolute path "${target}" (rules/linking.md: only relative paths)`);
        continue;
      }
      const [rawPath, ...anchorParts] = target.split('#');
      const anchor = anchorParts.join('#');
      const p = decodeURIComponent(rawPath);
      if (p === '') {
        // #якорь внутри этого же файла
        if (anchor && !headingSlugsOf(path.join(ROOT, f.rel), fileCache).has(anchor.toLowerCase())) {
          report(f.rel, i, 'LINK-ANCHOR', `anchor "#${anchor}" not found in this file`);
        }
        continue;
      }
      const abs = path.resolve(ROOT, path.dirname(f.rel), p);
      if (!existsSync(abs)) {
        report(f.rel, i, 'LINK-BROKEN', `target "${target}" does not exist`);
        continue;
      }
      checkCase(f, i, abs);
      const isDir = statSync(abs).isDirectory();
      if (p.endsWith('/') && !isDir) {
        report(f.rel, i, 'LINK-BROKEN', `target "${target}" is not a directory`);
        continue;
      }
      if (anchor) {
        if (isDir || !abs.endsWith('.md')) {
          report(f.rel, i, 'LINK-ANCHOR', `anchor "#${anchor}" on a non-Markdown target "${target}"`);
        } else if (!headingSlugsOf(abs, fileCache).has(anchor.toLowerCase())) {
          report(f.rel, i, 'LINK-ANCHOR', `anchor "#${anchor}" not found in "${p}"`);
        }
      }
    }
  }
}

// --- Бонус: состав feature-директорий (schemas/feature.schema.yaml) --------

function checkFeatureDirs(schema) {
  const featuresDir = path.join(ROOT, 'docs', 'features');
  if (!existsSync(featuresDir)) return;
  for (const name of readdirSync(featuresDir).sort()) {
    const abs = path.join(featuresDir, name);
    if (!statSync(abs).isDirectory()) continue;
    if (!new RegExp(schema.featureNamePattern).test(name)) {
      report(`docs/features/${name}`, -1, 'FEATURE-FILES',
        `feature directory name "${name}" does not match ${schema.featureNamePattern}`);
    }
    for (const file of schema.featureRequiredFiles) {
      if (!existsSync(path.join(abs, file))) {
        report(`docs/features/${name}`, -1, 'FEATURE-FILES', `required file "${file}" is missing`);
      }
    }
  }
}

// --- Бонус: состав change-директорий (schemas/change.schema.yaml) ----------

function checkChangeDirs(schema) {
  const changesDir = path.join(ROOT, 'docs', 'changes');
  if (!existsSync(changesDir)) return;
  const checkDir = (relDir, absDir, namePattern, name) => {
    if (!new RegExp(namePattern).test(name)) {
      report(relDir, -1, 'CHANGE-FILES',
        `change directory name "${name}" does not match ${namePattern}`);
    }
    for (const file of schema.changeRequiredFiles) {
      if (!existsSync(path.join(absDir, file))) {
        report(relDir, -1, 'CHANGE-FILES', `required file "${file}" is missing`);
      }
    }
  };
  for (const name of readdirSync(changesDir).sort()) {
    const abs = path.join(changesDir, name);
    if (!statSync(abs).isDirectory()) continue;
    if (name === 'archive') {
      for (const arch of readdirSync(abs).sort()) {
        const archAbs = path.join(abs, arch);
        if (!statSync(archAbs).isDirectory()) continue;
        checkDir(`docs/changes/archive/${arch}`, archAbs, schema.changeArchivePattern, arch);
      }
      continue;
    }
    checkDir(`docs/changes/${name}`, abs, schema.changeNamePattern, name);
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  const schema = loadSchemas();
  const allMd = collectFiles();

  const fileCache = new Map();
  for (const rel of allMd) {
    try {
      fileCache.set(rel, parseFile(rel));
    } catch (e) {
      die(`cannot read ${rel}: ${e.message}`);
    }
  }

  const fmSet = allMd.filter((rel) => rel.startsWith('docs/') && !isArchivedChange(rel));
  const linkSet = allMd.filter((rel) => !rel.startsWith('templates/') && !isArchivedChange(rel));

  // pass 1: структура, frontmatter, сбор определений ID
  const defs = {}; // scope -> id -> [{file, line}]
  const idContexts = new Map();
  for (const rel of allMd) checkStructure(fileCache.get(rel));
  for (const rel of fmSet) {
    const f = fileCache.get(rel);
    const fm = checkFrontmatter(f, schema);
    if (f.fmText !== null && !f.fmUnclosed && fm !== null) {
      idContexts.set(rel, collectDefinitions(f, schema, defs));
    }
  }

  // pass 2: ссылки на ID (нужна полная карта определений), дубликаты, links
  for (const [rel, ctx] of idContexts) checkIds(fileCache.get(rel), schema, ctx, defs);
  checkDuplicates(defs);
  for (const rel of linkSet) checkLinks(fileCache.get(rel), fileCache);
  checkFeatureDirs(schema);
  checkChangeDirs(schema);

  errors.sort((a, b) =>
    a.file.localeCompare(b.file) || a.line - b.line || a.code.localeCompare(b.code));
  for (const e of errors) {
    const loc = e.line > 0 ? `:${e.line}` : '';
    console.log(`${e.file}${loc} [${e.code}] ${e.message}`);
  }
  if (errors.length > 0) {
    const files = new Set(errors.map((e) => e.file)).size;
    console.log(`\nFAIL: ${errors.length} error(s) in ${files} file(s), ${allMd.length} file(s) checked`);
    process.exit(1);
  }
  console.log(`OK: ${allMd.length} file(s) checked, 0 errors`);
}

// Модуль переиспользуется scripts/spec-inventory.mjs: запуск только напрямую.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
