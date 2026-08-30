# AGENTS.md

Entry point для AI-агента. Прочитай этот файл первым.

## Что это за репозиторий

Формализованная система ведения продуктовой, функциональной, UI, API и технической документации:

```text
Product Context → Product Documentation → Requirements → UI/API → Technical Specification → Review
```

Полное описание — `README.md`.

## Карта репозитория

| Что искать | Где |
|------------|-----|
| Глобальный продуктовый контекст | `docs/product/` (overview, vision, glossary, personas, business-rules, NFR) |
| Документация фич | `docs/features/<feature-name>/` |
| Изменения утверждённых документов (change proposals) | `docs/changes/` |
| Архитектура и ADR | `docs/architecture/`, `docs/architecture/adr/` |
| Глобальные API-соглашения | `docs/api/` |
| Шаблоны документов | `templates/` |
| Тест-кейсы ручного тестирования | `test-cases/` |
| Пример заполненной feature (reference) | `templates/examples/password-recovery/` |
| Правила работы (обязательны к прочтению) | `rules/` |
| Стандарт ID и frontmatter, схемы | `schemas/` |
| Пошаговые процессы работы с документацией | `skills/*/SKILL.md` |
| Процесс изменений, commit-конвенция, статусы | `CONTRIBUTING.md` |
| Workflow человека: сценарии и промпты | `WORKFLOW.md` |
| Механическая валидация документации | `scripts/validate-docs.mjs` |
| Работа с внешними (устанавливаемыми) skills | `docs/ai/external-skills.md` |
| Исходный код сервисов (локально, не в Git) | `services/` |
| Список репозиториев сервисов и их клонирование | `repos.json`, `scripts/repos.mjs` |

## Обязательно перед любым изменением

1. Прочитать правила `rules/` — все обязательны:
   - `rules/ai-guardrails.md` — главный документ защиты от галлюцинаций;
   - `rules/writing.md` — стиль формулировок, неизмеримые слова, разделение WHAT/HOW;
   - `rules/requirements.md` — типы и качество требований;
   - `rules/linking.md` — связывание документов, «одно требование — один файл», impact-анализ;
   - `rules/terminology.md` — термины только из `docs/product/glossary.md`;
   - `rules/markdown.md` — структура документов и секций.
2. Прочитать связанные документы затрагиваемой feature: `product.md`, `requirements.md`, `ui.md`, `api.md`, `technical.md`.
3. Проверить глобальный контекст: `docs/product/business-rules.md`, `docs/product/glossary.md`.
4. Новые feature-документы создавать только из шаблонов `templates/` (см. таблицу ниже). Для глобальных документов `docs/product/`, `docs/api/`, `docs/architecture/` шаблонов нет — редактировать существующие файлы, сохраняя их структуру.

## Какие файлы создавать

| Тип документа | Шаблон | Куда | Обязательность |
|---------------|--------|------|----------------|
| README feature | `templates/feature.md` | `docs/features/<feature-name>/README.md` | обязателен |
| Product | `templates/product.md` | `docs/features/<feature-name>/product.md` | обязателен |
| Requirements | `templates/requirements.md` | `docs/features/<feature-name>/requirements.md` | обязателен |
| UI | `templates/ui.md` | `docs/features/<feature-name>/ui.md` | если есть интерфейс |
| API | `templates/api.md` | `docs/features/<feature-name>/api.md` | если есть API |
| Technical | `templates/technical.md` | `docs/features/<feature-name>/technical.md` | при описании реализации |
| ADR feature | `templates/adr.md` | `docs/features/<feature-name>/decisions/adr-XXX-<short-kebab-title>.md` | при значимом решении |
| ADR глобальный | `templates/adr.md` | `docs/architecture/adr/adr-XXX-<short-kebab-title>.md` | при решении, затрагивающем несколько фич |
| Change proposal | `templates/change-proposal.md` | `docs/changes/<change-name>/proposal.md` | при содержательном изменении approved-документа |
| Change tasks | `templates/change-tasks.md` | `docs/changes/<change-name>/tasks.md` | опционален до apply proposal |
| Test cases | `templates/test-cases.md` | `test-cases/<feature-name>.md` | опционален |

Имена директорий фич — kebab-case. Решение уровня одной feature — в её `decisions/`; решение, влияющее на систему в целом, — в `docs/architecture/adr/`.

## Frontmatter и статусы

- YAML frontmatter обязателен в каждом документе `docs/`: `title`, `type`, `status`, `version`, `owners`; для feature-документов также `feature`. Стандарт и допустимые значения — `schemas/README.md`.
- Жизненный цикл документа: `draft → review → approved → deprecated`. Новый документ — `status: draft`.
- `approved` выставляет только человек. AI переводит документ максимум в `review`.

## FACT / ASSUMPTION / TBD

- **FACT** — подтверждённая информация из source of truth. Только факты становятся требованиями.
- **ASSUMPTION** — предположение. Помечается явно: `ASSUMPTION: срок жизни OTP составляет 5 минут. Requires confirmation.` Никогда не превращается в факт без подтверждения человеком.
- **TBD** — неизвестная информация: `TBD: время жизни OTP-кода.` Не заполняется выдуманными значениями.

Запрещено придумывать: требования, API, бизнес-правила, ограничения.

## Requirement IDs

- Форматы: `FR-XXX`, `BR-XXX`, `NFR-XXX`, `UI-XXX`, `API-XXX`, `ADR-XXX`. Стандарт — `schemas/README.md`.
- Существующие ID сохранять. Удалённые ID не переиспользовать.
- Требование определяется в одном файле; остальные ссылаются: `UI-004 → FR-012`.

## Source of truth (приоритет)

```text
1. Approved requirements
2. Approved business rules
3. Approved product documentation
4. Approved ADR
5. Existing technical documentation
6. Current source code (services/)
7. Assumptions
```

Код в `services/` — правда о **текущей** реализации; requirements — правда о **требуемом** поведении. Расхождение помечать явно, не «исправлять» молча.

## Когда анализировать services/

Только при написании или проверке технической документации (`technical.md`), чтобы описать текущую реализацию. Не использовать код как источник продуктовых требований.

Подключение кода: список репозиториев — `repos.json`; `npm run pull` клонирует отсутствующие в `services/` и переходит на главную ветку, `npm run update` актуализирует уже склонированные (см. `services/README.md`).

## Когда запускать review

Skill `documentation-review` запускается:

- после содержательного изменения `requirements.md`, `ui.md`, `api.md` или `technical.md`;
- перед переводом документа в статус `approved`;
- как финальная стадия работы над feature (в pipeline `documentation-orchestrator` — автоматически).

Review только формирует отчёт о находках; исправления вносят пишущие skills.

## Проверка результата

- `node scripts/validate-docs.mjs` — механическая проверка frontmatter, ID, ссылок и структуры. Exit code `0` — ошибок нет, `1` — есть. Запускать после любого изменения `docs/` и перед commit.
- Скрипт дополняет `skills/documentation-review`, но не заменяет его: противоречия, галлюцинации и терминологию проверяет review.

## Как определить нужный skill

```text
Создать/изменить описание функции   → skills/product-documentation
Формализовать требования            → skills/requirements
Описать интерфейс                   → skills/ui-requirements
Описать API                         → skills/api-requirements
Описать реализацию                  → skills/technical-documentation
Зафиксировать архитектурное решение → skills/architecture-decisions
Проверить документацию              → skills/documentation-review
Написать тест-кейсы ручного тестирования → skills/test-cases
Содержательно изменить утверждённый документ → skills/change-management
Комплексная новая feature           → skills/documentation-orchestrator
```

Правило выбора: запрос укладывается в один документ — работать напрямую специализированным skill; комплексный запрос (новая feature целиком или изменение нескольких типов документов) — `skills/documentation-orchestrator`.

При сомнении сверяться с разделами «Когда использовать» / «Когда не использовать» в `SKILL.md` соответствующего skill.
