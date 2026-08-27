#!/usr/bin/env node
// Инвентарь требований. Node >= 18, без зависимостей.
//
// Детерминированный список всех requirement ID с формулировкой, acceptance
// criteria, связями и флагами TBD/ASSUMPTION. Это левая колонка матрицы
// трассируемости для skills/implementation-verification: сверка кода со
// спекой начинается с машинного инвентаря, а не с того, что агент нашёл глазами.
//
// Разбор ID переиспользуется из scripts/validate-docs.mjs (общий источник
// правды по формату и областям уникальности) — здесь добавлено только то,
// что валидатору не нужно: Acceptance Criteria, Traceability-таблица,
// cross-reference, TBD/ASSUMPTION, статус документа.
//
// Использование:
//   node scripts/spec-inventory.mjs [--feature <name> | --scope <scope> | --all]
//                                   [--include-templates] [--json | --md]
//
// По умолчанию: --all --json.
// --include-templates добавляет templates/examples/<name>/ отдельной областью
// example:<name> (templates/ исключены из ID-проверок валидатора, но сегодня
// это единственный заполненный пример требований в репозитории).
//
// Exit codes: 0 — успех; 2 — некорректный вызов или внутренняя ошибка.

import { execFileSync } from 'node:child_process';
import { readdirSync, lstatSync, existsSync } from 'node:fs';
import path from 'node:path';

import {
  ROOT,
  loadSchemas,
  collectFiles,
  parseFile,
  parseYamlSubset,
  featureNameOf,
  isChangeDoc,
  isArchivedChange,
  collectDefinitions,
} from './validate-docs.mjs';

// ---------------------------------------------------------------------------
// Аргументы.
// ---------------------------------------------------------------------------

function fail(message) {
  console.error(`spec-inventory: ${message}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { scope: null, feature: null, includeTemplates: false, format: 'json' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') continue;
    else if (a === '--include-templates') opts.includeTemplates = true;
    else if (a === '--json') opts.format = 'json';
    else if (a === '--md') opts.format = 'md';
    else if (a === '--feature') opts.feature = argv[++i] ?? fail('--feature requires a name');
    else if (a === '--scope') opts.scope = argv[++i] ?? fail('--scope requires a value');
    else fail(`unknown argument "${a}"`);
  }
  if (opts.feature && opts.scope) fail('--feature and --scope are mutually exclusive');
  if (opts.feature) opts.scope = `feature:${opts.feature}`;
  // Явно запрошенная область example:<name> подразумевает --include-templates.
  if (opts.scope?.startsWith('example:')) opts.includeTemplates = true;
  return opts;
}

// ---------------------------------------------------------------------------
// Области уникальности инвентаря.
//
// Совпадают с валидатором (feature:<name> | global) и добавляют example:<name>
// для templates/examples/, которые валидатор не сканирует.
// ---------------------------------------------------------------------------

function exampleNameOf(rel) {
  const m = rel.match(/^templates\/examples\/([^/]+)\//);
  return m ? m[1] : null;
}

function inventoryScopeOf(rel) {
  const example = exampleNameOf(rel);
  if (example) return `example:${example}`;
  const feature = featureNameOf(rel);
  return feature ? `feature:${feature}` : 'global';
}

// ---------------------------------------------------------------------------
// Разбор документа.
// ---------------------------------------------------------------------------

// Заголовок ## уровня, внутри которого лежит строка (для AC и Traceability).
function sectionIndex(headings, lines) {
  const section = new Array(lines.length).fill('');
  let current = '';
  let h = 0;
  for (let i = 0; i < lines.length; i++) {
    while (h < headings.length && headings[h].line === i) {
      if (headings[h].level === 2) current = headings[h].text;
      h++;
    }
    section[i] = current;
  }
  return section;
}

// Тело требования: строка определения плюс её продолжения с большим отступом
// (формат "- NFR-001: ...\n  Requires confirmation." из templates/).
// ADR определяется заголовком H1, а его связи и пометки живут в секциях
// Decision / Related requirements — для ADR телом считается весь документ.
function requirementBlock(lines, defLine, isAdr) {
  if (isAdr) return lines.slice(defLine);
  const block = [lines[defLine]];
  const baseIndent = lines[defLine].match(/^\s*/)[0].length;
  for (let i = defLine + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') break;
    if (/^\s*#{1,6}\s/.test(line)) break;
    const indent = line.match(/^\s*/)[0].length;
    if (indent <= baseIndent) break;
    block.push(line);
  }
  return block;
}

// Формулировка требования без ID-префикса и cross-reference в скобках.
function requirementText(block) {
  const joined = block.map((l) => l.trim()).join(' ');
  return joined
    .replace(/^-\s+/, '')
    .replace(/^[A-Z]+-\d{3,}\s*(?:\(→[^)]*\))?\s*:\s*/, '')
    .replace(/^#\s+[A-Z]+-\d{3,}\s*:?\s*/, '')
    .trim();
}

// Cross-reference из заголовка требования: "UI-004 (→ FR-005, BR-002): ..."
function derivedFromOf(defLine, prefixes) {
  const m = defLine.match(/\(→([^)]*)\)/);
  return m ? idsIn(m[1], prefixes) : [];
}

function idsIn(text, prefixes) {
  const re = new RegExp(`\\b((?:${prefixes.join('|')})-\\d{3,})\\b`, 'g');
  return [...new Set([...text.matchAll(re)].map((m) => m[1]))];
}

// Acceptance criteria: "- AC для FR-001, FR-002: Given ... When ... Then ..."
// (формат закреплён в templates/requirements.md).
function collectAcceptance(f, section, prefixes) {
  const re = new RegExp(
    `^\\s*[-*]\\s+AC\\s+для\\s+((?:(?:${prefixes.join('|')})-\\d{3,}\\s*,?\\s*)+):\\s*(.+)$`,
    'i'
  );
  const byId = new Map();
  for (let i = 0; i < f.lines.length; i++) {
    if (!/acceptance/i.test(section[i])) continue;
    const m = f.lines[i].match(re);
    if (!m) continue;
    const entry = { line: i + 1, text: m[2].trim() };
    for (const id of idsIn(m[1], prefixes)) {
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(entry);
    }
  }
  return byId;
}

// Секция Traceability: | ID | Источник | Покрыто |
function collectTraceability(f, section, prefixes) {
  const byId = new Map();
  for (let i = 0; i < f.lines.length; i++) {
    if (!/traceability/i.test(section[i])) continue;
    const line = f.lines[i].trim();
    if (!line.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/.test(line)) continue; // разделитель таблицы
    const cells = line.slice(1, line.endsWith('|') ? -1 : undefined).split('|').map((c) => c.trim());
    if (cells.length < 2) continue;
    const ids = idsIn(cells[0], prefixes);
    if (ids.length !== 1) continue; // строка заголовка или нестандартная ячейка
    byId.set(ids[0], {
      source: cells[1] ?? '',
      covered: cells[2] ?? '',
      coveredIds: idsIn(cells[2] ?? '', prefixes),
      line: i + 1,
    });
  }
  return byId;
}

// ---------------------------------------------------------------------------
// Метаданные прогона: снимок спеки и подключённого кода.
//
// Без них вердикты верификации невоспроизводимы: file:line в чужом репозитории
// имеет смысл только вместе с commit, а грязное или symlink-подключение
// означает, что у другого человека тех же строк не будет.
// ---------------------------------------------------------------------------

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function repoSnapshot(dir) {
  const head = git(['rev-parse', '--short', 'HEAD'], dir);
  const status = git(['status', '--porcelain'], dir);
  return { head, dirty: status === null ? null : status !== '' };
}

function connectedServices() {
  const dir = path.join(ROOT, 'services');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name !== 'README.md' && !name.startsWith('.'))
    .sort()
    .map((name) => {
      const abs = path.join(dir, name);
      const snap = repoSnapshot(abs);
      return {
        name,
        path: `services/${name}`,
        symlink: lstatSync(abs).isSymbolicLink(),
        head: snap.head,
        dirty: snap.dirty,
      };
    });
}

// Требования, затронутые открытыми change proposals: верификация идёт против
// спеки, которая может сдвинуться. Помечается в отчёте, не блокирует прогон.
function pendingChanges(prefixes) {
  const dir = path.join(ROOT, 'docs', 'changes');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (name === 'archive' || name === 'README.md' || name.startsWith('.')) continue;
    const rel = `docs/changes/${name}/proposal.md`;
    if (!existsSync(path.join(ROOT, rel))) continue;
    const f = parseFile(rel);
    out.push({ change: name, file: rel, ids: idsIn(f.masked.join('\n'), prefixes) });
  }
  return out;
}

function validateExitCode() {
  try {
    execFileSync(process.execPath, ['scripts/validate-docs.mjs'], {
      cwd: ROOT,
      stdio: 'ignore',
    });
    return 0;
  } catch (e) {
    return typeof e.status === 'number' ? e.status : 2;
  }
}

// ---------------------------------------------------------------------------
// Сбор инвентаря.
// ---------------------------------------------------------------------------

function inventory(opts) {
  const schema = loadSchemas();
  const prefixes = schema.idPrefixes;

  const files = collectFiles().filter((rel) => {
    if (isArchivedChange(rel)) return false;
    // change proposals не определяют ID, только ссылаются на них
    if (isChangeDoc(rel) || rel.startsWith('templates/examples/changes/')) return false;
    if (rel.startsWith('docs/')) return true;
    if (opts.includeTemplates && rel.startsWith('templates/examples/')) return true;
    return false;
  });

  const records = [];
  for (const rel of files) {
    const scope = inventoryScopeOf(rel);
    if (opts.scope && scope !== opts.scope) continue;

    const f = parseFile(rel);
    if (f.fmUnclosed) continue;

    // parseYamlSubset возвращает { data, keyLines, dupKeys }
    const fm = f.fmText === null ? {} : (parseYamlSubset(f.fmText).data ?? {});
    const defs = {};
    collectDefinitions(f, schema, defs, scope);
    const found = defs[scope] ?? {};
    if (Object.keys(found).length === 0) continue;

    const section = sectionIndex(f.headings, f.lines);
    const acceptance = collectAcceptance(f, section, prefixes);
    const traceability = collectTraceability(f, section, prefixes);

    for (const [id, occurrences] of Object.entries(found)) {
      const { line } = occurrences[0];
      const isAdr = id.startsWith('ADR-');
      const block = requirementBlock(f.lines, line, isAdr);
      const body = block.join('\n');
      const textBlock = isAdr ? [f.lines[line]] : block;
      const trace = traceability.get(id) ?? null;
      records.push({
        scope,
        id,
        type: id.split('-')[0],
        file: rel,
        line: line + 1,
        section: section[line] || null,
        text: requirementText(textBlock),
        status: typeof fm.status === 'string' ? fm.status : null,
        docType: typeof fm.type === 'string' ? fm.type : null,
        deprecated: fm.status === 'deprecated' || /\bdeprecated\b/i.test(body),
        derivedFrom: derivedFromOf(f.lines[line], prefixes),
        traces: idsIn(body, prefixes).filter((x) => x !== id),
        acceptance: acceptance.get(id) ?? [],
        traceSource: trace?.source ?? null,
        coveredByDocs: trace?.coveredIds ?? [],
        coveredRaw: trace?.covered ?? null,
        hasTbd: /\bTBD\b/.test(body),
        hasAssumption: /\bASSUMPTION\b/.test(body),
      });
    }
  }

  records.sort((a, b) =>
    a.scope.localeCompare(b.scope) ||
    a.type.localeCompare(b.type) ||
    a.id.localeCompare(b.id, undefined, { numeric: true }));

  const spec = repoSnapshot(ROOT);
  const services = connectedServices();
  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    specCommit: spec.head,
    specDirty: spec.dirty,
    validateExit: validateExitCode(),
    codeConnected: services.length > 0,
    services,
    pendingChanges: pendingChanges(prefixes),
    scopes: [...new Set(records.map((r) => r.scope))],
    requirements: records,
  };
}

// ---------------------------------------------------------------------------
// Вывод.
// ---------------------------------------------------------------------------

function renderMd(inv) {
  const out = [];
  out.push('## Run metadata', '');
  out.push('| Параметр | Значение |', '|----------|----------|');
  out.push(`| Дата | ${inv.generatedAt} |`);
  out.push(`| Spec commit | \`${inv.specCommit ?? 'n/a'}\`${inv.specDirty ? ', working tree dirty' : ''} |`);
  out.push(`| Spec validation | \`node scripts/validate-docs.mjs\` → exit ${inv.validateExit} |`);
  out.push(`| Code connected | ${inv.codeConnected ? 'да' : 'нет'} |`);
  out.push(`| Services | ${inv.services.length === 0 ? '—' : inv.services.map((x) =>
    `\`${x.path}\` @ \`${x.head ?? 'n/a'}\`${x.symlink ? ', symlink' : ''}${x.dirty ? ', dirty' : ''}`).join('; ')} |`);
  out.push(`| Open change proposals | ${inv.pendingChanges.length === 0 ? 'none' :
    inv.pendingChanges.map((c) => `${c.change} (${c.ids.join(', ') || '—'})`).join('; ')} |`);
  out.push(`| Требований в инвентаре | ${inv.requirements.length} |`);

  if (inv.requirements.length === 0) {
    out.push('', 'Требований в выбранной области нет.');
    return out.join('\n');
  }

  // Каркас матрицы: строки задаёт скрипт, агент заполняет только колонки
  // вердиктов. Добавлять и удалять строки нельзя — это структурная защита
  // от «потерянного» неудобного требования.
  let scope = null;
  for (const r of inv.requirements) {
    if (r.scope !== scope) {
      scope = r.scope;
      out.push('', `## Pass 1 — Spec → Code: ${scope}`, '',
        '| ID | Тип | Требование (кратко) | Источник | AC | Флаги | Verdict | Код | Тест | Conf. | Refuter |',
        '|----|-----|---------------------|----------|----|-------|---------|-----|------|-------|---------|');
    }
    const flags = [
      r.deprecated ? 'deprecated' : null,
      r.hasTbd ? 'TBD' : null,
      r.hasAssumption ? 'ASSUMPTION' : null,
    ].filter(Boolean).join(', ') || '—';
    const text = r.text.length > 80 ? `${r.text.slice(0, 77)}…` : r.text;
    out.push(`| ${r.id} | ${r.type} | ${text.replace(/\|/g, '\\|')} | \`${r.file}:${r.line}\` | ` +
      `${r.acceptance.length} | ${flags} |  |  |  |  |  |`);
  }
  return out.join('\n');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  let inv;
  try {
    inv = inventory(opts);
  } catch (e) {
    fail(e.message);
  }
  console.log(opts.format === 'md' ? renderMd(inv) : JSON.stringify(inv, null, 2));
}

main();
