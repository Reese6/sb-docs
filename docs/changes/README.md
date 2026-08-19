# Changes

Change proposals — предлагаемые изменения утверждённых (approved) документов. Одна директория = одно изменение.

## Когда нужен change proposal

Содержательное изменение approved-документа (добавление, изменение или удаление требований — MAJOR-версия) вносится только через change proposal. MINOR-правки approved-документов и любые правки `draft`/`review`-документов идут обычным процессом. Каноническое правило порога — [CONTRIBUTING.md](../../CONTRIBUTING.md), раздел «Изменение утверждённых документов».

## Структура

```text
docs/changes/
├── <change-name>/        # активное изменение, kebab-case
│   ├── proposal.md       # why / what / deltas; обязателен
│   └── tasks.md          # план применения; опционален до apply
└── archive/              # применённые и отклонённые изменения
    └── YYYY-MM-<change-name>/
```

Шаблоны — [templates/change-proposal.md](../../templates/change-proposal.md) и [templates/change-tasks.md](../../templates/change-tasks.md). Пример заполнения — [templates/examples/changes/password-recovery-otp-sms](../../templates/examples/changes/password-recovery-otp-sms/proposal.md). Состав директории проверяет `scripts/validate-docs.mjs` по [schemas/change.schema.yaml](../../schemas/change.schema.yaml).

Директория `archive/` создаётся при первом архивировании. Архив заморожен: файлы после переноса не редактируются (ссылки в них могут устареть — это допустимо), из валидации frontmatter, ID и ссылок архив исключён.

## Жизненный цикл

```text
proposed → approved → applied
        ↘ rejected
```

- `proposed` — предложение создано (AI или человеком), ждёт решения.
- `approved` / `rejected` — выставляет только человек.
- `applied` — все дельты внесены в целевые документы; proposal архивируется.

Статус изменения живёт в секции `## Status` файла `proposal.md`; соответствие со статусом документа в frontmatter — [schemas/README.md](../../schemas/README.md), раздел «Статусы change proposal». Полный процесс — skill `change-management`.

## Активные изменения

Активных изменений нет.
