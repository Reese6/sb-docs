# Features

Документация по фичам продукта. Одна директория = одна feature.

## Структура feature

```text
docs/features/<feature-name>/
├── README.md              # обзор feature, состав и статусы документов
├── product.md             # WHAT + WHY: проблема, цель, сценарии, scope
├── requirements.md        # FR / BR / NFR, acceptance criteria
├── model/                 # модель данных feature
│   ├── README.md          # индекс: существующие сущности, список, диаграмма
│   └── <entity>.md        # одна новая или изменяемая сущность
├── ui.md                  # поведение интерфейса (UI-XXX)
├── api/                   # контракт API
│   ├── README.md          # индекс: таблица методов, traceability
│   └── <method>-<имя>.md  # один метод (API-XXX)
├── technical.md           # HOW: техническое решение
└── decisions/             # ADR уровня feature
```

`api/` и `model/` — директории, а не файлы: у большой feature методов и сущностей десятки, и один документ на всех перестаёт читаться. Один метод — один файл, одна сущность — один файл, сводка — в `README.md` директории.

Имя директории — kebab-case: `password-recovery`, `sms-notifications`.

Шаблоны всех файлов — в `../../templates/`.

## Не каждый файл обязателен

Создаются только нужные документы:

- backend-only feature может не иметь `ui.md`;
- feature без внешнего API может не иметь `api/`;
- feature, которая не вводит и не меняет сущности, может не иметь `model/`;
- `decisions/` создаётся при первом ADR.

Директория `api/` или `model/` существует — в ней обязателен индекс `README.md` и хотя бы один документ кроме него. Пустую директорию находит `node scripts/validate-docs.mjs`.

Минимум для любой feature: `README.md`, `product.md`, `requirements.md`.

## Ключевое правило: не копировать глобальный контекст

**Глобальные правила продукта не копируются в feature.** Feature ссылается на глобальный контекст:

- термины — [../product/glossary.md](../product/glossary.md);
- пользователи — [../product/personas.md](../product/personas.md);
- глобальные бизнес-правила — [../product/business-rules.md](../product/business-rules.md) (по `BR-XXX`);
- глобальные NFR — [../product/non-functional-requirements.md](../product/non-functional-requirements.md) (по `NFR-XXX`);
- API-соглашения (аутентификация, ошибки, пагинация) — [../api/](../api/);
- архитектурный контекст — [../architecture/](../architecture/);
- сущности доменной модели — [../architecture/data-model/](../architecture/data-model/) (одна сущность = один файл).

Дублирование формулировки правила в feature — ошибка, которую находит documentation review. Правильно: «Применяется BR-003 (см. глобальные business rules)».

То же и с данными: `model/` ссылается на файлы сущностей в `../architecture/data-model/` и содержит только новые сущности и дельту существующих — поля описанной сущности не копируются. Сущность, которую feature использует без изменений, своего файла не получает: она остаётся строкой-ссылкой в `model/README.md`.

## Порядок создания документов

```text
product.md → requirements.md → model/ → ui.md / api/ → technical.md → decisions/ (при необходимости) → review
```

Каждый следующий документ ссылается на ID предыдущих (traceability): `UI-004 → FR-012`, `API-007 → FR-012`.

`model/` и `api/` заполняются по одному файлу за раз: команда `/feature-model <feature> <entity>` и `/feature-api <feature> <METHOD> <path>`.

## Список features

Features пока нет.
