#!/usr/bin/env node
// Управление репозиториями сервисов (repos.json). Node >= 18, без зависимостей.
//
// Команды:
//   node scripts/repos.mjs pull    — клонировать отсутствующие репозитории в
//                                    services/<name> и перейти на главную ветку;
//                                    уже склонированные не трогает.
//   node scripts/repos.mjs update  — актуализировать: отсутствующие клонировать,
//                                    существующие — fetch + checkout главной
//                                    ветки + pull --ff-only. Репозитории с
//                                    незакоммиченными изменениями пропускаются.
//
// Репозитории обрабатываются параллельно; строка результата печатается по мере
// завершения каждого.
//
// Главная ветка: поле "branch" в repos.json, иначе автоопределение по
// origin/HEAD (поддерживаются и main, и master).
//
// Символьные ссылки в services/ (локальные копии, подключённые через ln -s)
// не обновляются — это рабочие копии пользователя.
//
// Exit codes: 0 — чисто; 1 — были ошибки; 2 — некорректный запуск/конфиг.

import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CONFIG_PATH = path.join(ROOT, 'repos.json');

// ---------------------------------------------------------------------------
// Вспомогательные
// ---------------------------------------------------------------------------

function fail(message) {
  console.error(`ошибка: ${message}`);
  process.exit(2);
}

function git(args, cwd) {
  return new Promise((resolve) => {
    const child = spawn('git', args, { cwd });
    let out = '';
    let err = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.stderr.on('data', (chunk) => { err += chunk; });
    child.on('error', (e) => resolve({ ok: false, out: '', err: e.message }));
    child.on('close', (status) => {
      resolve({ ok: status === 0, out: out.trim(), err: err.trim() });
    });
  });
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) fail(`не найден конфиг ${CONFIG_PATH}`);
  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    fail(`repos.json не парсится как JSON: ${e.message}`);
  }
  if (!Array.isArray(config.repos)) fail('repos.json: поле "repos" должно быть массивом');
  for (const repo of config.repos) {
    if (!repo.name || !repo.url) {
      fail(`repos.json: у каждого репозитория обязательны "name" и "url" (${JSON.stringify(repo)})`);
    }
  }
  return {
    target: config.target || 'services',
    repos: config.repos,
  };
}

// Главная ветка: сначала origin/HEAD локально, затем запрос к remote.
async function detectDefaultBranch(dir) {
  const local = await git(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'], dir);
  if (local.ok) return local.out.replace(/^origin\//, '');
  const remote = await git(['ls-remote', '--symref', 'origin', 'HEAD'], dir);
  if (remote.ok) {
    const m = remote.out.match(/^ref:\s+refs\/heads\/(\S+)\s+HEAD/m);
    if (m) return m[1];
  }
  return null;
}

async function checkoutBranch(repo, dir) {
  const branch = repo.branch || (await detectDefaultBranch(dir));
  if (!branch) return { ok: false, message: 'не удалось определить главную ветку' };
  const res = await git(['checkout', '-q', branch], dir);
  if (!res.ok) return { ok: false, message: `checkout ${branch}: ${res.err}` };
  return { ok: true, branch };
}

// ---------------------------------------------------------------------------
// Операции над одним репозиторием. Возвращают { status, detail? }.
// ---------------------------------------------------------------------------

async function clone(repo, dir) {
  const res = await git(['clone', '--quiet', repo.url, dir], ROOT);
  if (!res.ok) return { status: 'error', detail: `clone: ${res.err}` };
  const co = await checkoutBranch(repo, dir);
  if (!co.ok) return { status: 'error', detail: co.message };
  return { status: 'cloned', detail: co.branch };
}

async function update(repo, dir) {
  const dirty = await git(['status', '--porcelain'], dir);
  if (!dirty.ok) return { status: 'error', detail: `status: ${dirty.err}` };
  if (dirty.out !== '') return { status: 'skipped-dirty', detail: 'есть незакоммиченные изменения' };

  const fetch = await git(['fetch', '--prune', '--quiet'], dir);
  if (!fetch.ok) return { status: 'error', detail: `fetch: ${fetch.err}` };

  const co = await checkoutBranch(repo, dir);
  if (!co.ok) return { status: 'error', detail: co.message };

  const before = (await git(['rev-parse', 'HEAD'], dir)).out;
  const pull = await git(['pull', '--ff-only', '--quiet'], dir);
  if (!pull.ok) return { status: 'error', detail: `pull --ff-only: ${pull.err}` };
  const after = (await git(['rev-parse', 'HEAD'], dir)).out;

  return after === before
    ? { status: 'up-to-date', detail: co.branch }
    : { status: 'updated', detail: `${co.branch} ${before.slice(0, 7)}..${after.slice(0, 7)}` };
}

async function processRepo(repo, targetDir, command) {
  const dir = path.join(ROOT, targetDir, repo.name);

  if (!existsSync(dir)) return clone(repo, dir);
  if (lstatSync(dir).isSymbolicLink()) {
    return { status: 'symlink', detail: 'локальная копия, не обновляется' };
  }
  if (!existsSync(path.join(dir, '.git'))) {
    return { status: 'error', detail: 'каталог существует, но это не git-репозиторий' };
  }
  if (command === 'pull') return { status: 'exists', detail: 'уже склонирован (актуализация: npm run update)' };
  return update(repo, dir);
}

// ---------------------------------------------------------------------------
// Запуск
// ---------------------------------------------------------------------------

const command = process.argv[2];
if (command !== 'pull' && command !== 'update') {
  fail('использование: node scripts/repos.mjs <pull|update>');
}

const { target, repos } = loadConfig();

if (repos.length === 0) {
  console.log('repos.json: список репозиториев пуст — делать нечего.');
  process.exit(0);
}

const results = await Promise.all(
  repos.map(async (repo) => {
    const { status, detail } = await processRepo(repo, target, command);
    console.log(`${status.padEnd(13)} ${target}/${repo.name}${detail ? ` — ${detail}` : ''}`);
    return status;
  }),
);

const errors = results.filter((s) => s === 'error').length;
console.log(`\nитого: ${repos.length} репо, ошибок: ${errors}`);
process.exit(errors > 0 ? 1 : 0);
