# Skills

Справочник для авторов skills. Агентом при активации не читается: агент получает `description` из frontmatter, затем тело `SKILL.md`.

## Адресат

Skills исполняют слабые модели (DeepSeek Flash, Qwen). Отсюда форма: короткие директивы, правила отдельно от шагов, буквальные шаблоны ответов, минимум дублей с [AGENTS.md](../../AGENTS.md) (он всегда в контексте агента) и с комментариями `<!-- AI: -->` в `templates/`.

## Структура SKILL.md

Все двенадцать skills имеют одинаковый набор секций в этом порядке:

| Секция | Содержание | Лимит, симв. |
|--------|------------|--------------|
| `# Skill: <name>` | единственный H1 | — |
| `## Когда использовать` | что создаёт или меняет; поводы; последняя строка — что делают другие skills | 750 |
| `## Вход и стоп-условия` | таблица «Проверка / Если не выполнено»; справа «Стоп.» и буквальный ответ пользователю | 900 |
| `## Прочитать` | обязательно → если есть → глобальный контекст | 1000 |
| `## Правила` | абзац «Ядро» + 8–12 нумерованных однострочных правил | 2700 |
| `## Шаги` | 6–9 действий; условные начинаются с «Если …:»; последний — валидатор | 1700 |
| `## Примеры` | 1–2 пары «Неправильно / Правильно» в блоках `text` | 800 |
| `## Чеклист` | до 8 пунктов «да/нет»: то, что не ловит валидатор, а review даёт как ERROR | 900 |
| `## Отчёт` | буквальный блок `text` | 750 |

Секции «Когда использовать» и «Вход и стоп-условия» вместе играют роль «Когда использовать / Когда не использовать», на которые ссылается AGENTS.md. Два skill имеют одну дополнительную таблицу-справочник между «Правила» и «Шаги»: `## Стадии` (documentation-orchestrator) и `## Таблица находок` (documentation-review); на них лимит не распространяется.

## Микроформат директив

- Одна директива — одна строка. Не более 20 слов в предложении, не более одного «—».
- Вместо запрета — форма «X. Иначе — Y» или «только из …».
- Точные литералы в backticks: `TBD: …`, `ASSUMPTION: … Requires confirmation.`, `Not applicable: <причина>`.
- Без счётчиков («16 аспектов») — «каждая секция шаблона»; перечни секций и подсказки по ним живут в `templates/*.md`.
- Ссылки относительные, без якорей на кириллические заголовки.
- `description`: одна строка до 600 символов, без последовательности «двоеточие-пробел» (YAML); порядок: что делает и какой файл → «Триггеры — …» → «Вход — …» → «Не для — … (skill)».

## Общие блоки

Абзац «Ядро» в `## Правила` пишущих skills:

```text
Общие — AGENTS.md, rules/ai-guardrails.md. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из <источники skill> или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; существующие ID не менять и не переиспользовать.
```

Общая стоп-строка пишущих skills:

```text
| Документ не `approved`, либо правка MINOR, либо apply утверждённого change proposal | Стоп. Ответ: «Содержательное изменение approved-документа — через `change-management`». |
```

Отчёт пишущих skills — пять строк; оркестратор склеивает их из отчётов стадий:

```text
Файлы: <пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
<строка, специфичная для skill>
Следующий шаг: <skill>
```

## Карта skills

| Skill | Создаёт / меняет | Вход | Следующий |
|-------|------------------|------|-----------|
| feature-scaffold | директория feature, заготовки `README.md`, `product.md`, `requirements.md` | имя feature | product-documentation |
| product-documentation | `product.md` feature | директория feature, `docs/product/` | requirements |
| requirements | `requirements.md` | `product.md` | data-model, ui-requirements, api-requirements |
| data-model | `model.md` | `product.md`, `requirements.md` | ui-requirements, api-requirements |
| ui-requirements | `ui.md` | `product.md`, `requirements.md` | api-requirements, technical-documentation |
| api-requirements | `api.md` | `product.md`, `requirements.md`, `roles.md` | technical-documentation |
| technical-documentation | `technical.md` | `product.md`, `requirements.md`, `model.md`, `services/` | architecture-decisions |
| architecture-decisions | `decisions/adr-XXX-*.md`, `docs/architecture/adr/` | требования, существующие ADR | documentation-review |
| documentation-review | только отчёт | документы feature | пишущие skills |
| feature-apply | `docs/architecture/data-model/<entity>.md`, `docs/api/services/<service>.md`, proposal | approved `model.md`, `api.md` | change-management, documentation-review |
| change-management | `docs/changes/<name>/` | approved-документ | пишущие skills, documentation-review |
| documentation-orchestrator | только план | запрос пользователя | все стадии, затем review |

Выбор skill по задаче — раздел «Как определить нужный skill» в [AGENTS.md](../../AGENTS.md).

## Точные формы, которые проверяет валидатор

- Определение требования: `- UI-004 (→ FR-012): …` или `FR-001: …` в начале строки. Форма `UI-004 → FR-012: …` определением не считается.
- ID ADR берётся из H1: `# ADR-001: <Название решения>`. В frontmatter `title` двоеточие недопустимо: `title: ADR-001 <Название решения>`.
- Определение метода в `api.md`: `- API-001 (→ FR-012): …` первой строкой блока `## <METHOD> <path>`; ID в заголовок не выносится.
- Placeholder `<TYPE>-NEW-<n>` допустим только в `docs/changes/`.
- В `related` frontmatter и в таблице README feature — только существующие файлы.

## Проверка skills

[scripts/validate-docs.mjs](../../scripts/validate-docs.mjs) проверяет в `.gigacode/skills/` структуру Markdown и ссылки. Дополнительно:

```sh
for f in .gigacode/skills/*/SKILL.md; do printf '%s: ' "$f"; awk '/^```/{c=!c} !c && /^## /{sub(/^## /,""); print}' "$f" | paste -sd'|' -; done
for f in .gigacode/skills/*/SKILL.md; do printf '%s ' "$(grep -m1 '^description:' "$f" | sed 's/^description: //' | wc -m)"; echo "$f"; done
grep -n 'description:.*: ' .gigacode/skills/*/SKILL.md
wc -m .gigacode/skills/*/SKILL.md
```

При любом сокращении skill — матрица покрытия: каждая директива старой версии указывает на место в новой версии, в AGENTS.md, в шаблоне или в `rules/`.
