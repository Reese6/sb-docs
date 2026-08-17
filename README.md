# Product Docs

Репозиторий продуктовой, функциональной, UI, API и технической документации команды разработки.

Документация создаётся и поддерживается преимущественно AI-агентами (Claude Code, Codex CLI и совместимые Agent Skills) и при этом остаётся полностью читаемой людьми.

## Назначение

Это не хранилище Markdown-файлов, а формализованная система ведения требований:

```text
Product Context → Product Documentation → Requirements → UI/API → Technical Specification → Review
```

Система обеспечивает:

- предсказуемую структуру документов;
- traceability между требованиями (FR/BR/NFR/UI/API/ADR);
- минимизацию дублирования через cross-reference;
- защиту от «придуманных» AI требований (FACT / ASSUMPTION / TBD);
- масштабирование на большую команду и много сервисов.

## Архитектура документации

```text
docs/
├── product/        # Глобальный продуктовый контекст: overview, vision, glossary,
│                   # personas, business-rules, non-functional-requirements
├── features/       # Документация по фичам: одна директория = одна feature
├── architecture/   # Архитектура системы и ADR
└── api/            # Глобальные API-соглашения и документация сервисов

templates/          # Шаблоны документов (source of truth для структуры)
rules/              # Глобальные правила для AI и людей (стиль, ID, ссылки, guardrails)
schemas/            # Стандарт метаданных, ID и простые YAML-схемы
skills/             # Agent Skills для работы с документацией
services/           # Локально подключённые репозитории сервисов (не коммитятся)
```

Ключевое правило: **глобальный контекст не копируется в feature** — feature ссылается на `docs/product/`, `docs/architecture/`, `docs/api/`.

## Типы документов

| Тип | Файл | Отвечает на | Содержит |
|-----|------|-------------|----------|
| Product | `product.md` | WHAT + WHY | Проблема, цель, пользователи, сценарии, scope |
| Requirements | `requirements.md` | Ожидаемое поведение | FR-XXX, BR-XXX, NFR-XXX, acceptance criteria |
| UI | `ui.md` | Поведение интерфейса | UI-XXX, экраны, состояния, валидация |
| API | `api.md` | Контракт взаимодействия | API-XXX, endpoints, request/response, errors |
| Technical | `technical.md` | HOW | Решение, компоненты, data flow, миграции |
| ADR | `decisions/adr-XXX-*.md` | WHY (техническое решение) | Контекст, решение, альтернативы, последствия |

Уровни не смешиваются: product не содержит деталей реализации, technical не переопределяет требования.

## Жизненный цикл документации

Каждый документ имеет статус в YAML frontmatter:

```text
draft → review → approved → deprecated
```

- `draft` — создан, не проверен;
- `review` — на проверке (в т.ч. skill `documentation-review`);
- `approved` — утверждён, является source of truth;
- `deprecated` — устарел, хранится для истории; его требования не действуют.

## Source of truth

Приоритет источников информации (сверху вниз):

```text
1. Approved requirements
2. Approved business rules
3. Approved product documentation
4. Approved ADR
5. Existing technical documentation
6. Current source code (services/)
7. Assumptions
```

- Requirements описывают **требуемое** поведение.
- Исходный код в `services/` описывает **текущую** реализацию.
- Расхождение между ними — сигнал для явной пометки, а не для автоматического «исправления» требований под код.

## Как добавить новую feature

1. Создать директорию `docs/features/<feature-name>/` (kebab-case).
2. Скопировать нужные шаблоны из `templates/` (не все файлы обязательны — см. `docs/features/README.md`).
3. Заполнить `product.md` (WHAT + WHY), затем `requirements.md`, затем `ui.md` / `api.md`, затем `technical.md`.
4. Присвоить требованиям ID по стандарту `schemas/README.md`.
5. Связать документы cross-reference (`UI-004 → FR-012`).
6. Прогнать review (skill `documentation-review`).

Для комплексной работы использовать skill `documentation-orchestrator` (см. `AGENTS.md`).

## Как AI работает с документацией

Обязательный порядок для AI-агента:

1. Прочитать `AGENTS.md` — entry point и routing по skills.
2. Прочитать `rules/` — особенно `rules/ai-guardrails.md`.
3. Перед изменением документа — прочитать связанные документы (product, requirements, ui, api, technical той же feature).
4. Неизвестную информацию помечать `TBD`, предположения — `ASSUMPTION`. Придумывать факты запрещено.
5. Сохранять существующие requirement ID, не переиспользовать удалённые.
6. После изменений обновлять cross-reference и запускать review.

## services/

`services/` предназначена для локального подключения (clone/symlink) репозиториев сервисов, чей исходный код AI может анализировать при написании технической документации.

- Содержимое `services/` **не попадает** в этот Git-репозиторий (см. `.gitignore`).
- Коммитится только `services/README.md`.
- Код в `services/` — source of truth только для текущей реализации, не для требований.
