# AGENTS.md

Entry point для AI-агента (Claude Code, Codex CLI и совместимые). Прочитай этот файл первым.

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
| Архитектура и ADR | `docs/architecture/`, `docs/architecture/adr/` |
| Глобальные API-соглашения | `docs/api/` |
| Шаблоны документов | `templates/` |
| Правила работы (обязательны к прочтению) | `rules/` |
| Стандарт ID и frontmatter, схемы | `schemas/` |
| Исходный код сервисов (локально, не в Git) | `services/` |

## Обязательно перед любым изменением

1. Прочитать `rules/ai-guardrails.md` — главный документ защиты от галлюцинаций.
2. Прочитать связанные документы затрагиваемой feature: `product.md`, `requirements.md`, `ui.md`, `api.md`, `technical.md`.
3. Проверить глобальный контекст: `docs/product/business-rules.md`, `docs/product/glossary.md`.
4. Новые документы создавать только из шаблонов `templates/`.

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

## Когда запускать review

Skill `documentation-review` запускается:

- после содержательного изменения `requirements.md`, `ui.md`, `api.md` или `technical.md`;
- перед переводом документа в статус `approved`;
- как финальная стадия работы над feature (в pipeline `documentation-orchestrator` — автоматически).

Review только формирует отчёт о находках; исправления вносят пишущие skills.

## Как определить нужный skill

```text
Создать/изменить описание функции   → skills/product-documentation
Формализовать требования            → skills/requirements
Описать интерфейс                   → skills/ui-requirements
Описать API                         → skills/api-requirements
Описать реализацию                  → skills/technical-documentation
Зафиксировать архитектурное решение → skills/architecture-decisions
Проверить документацию              → skills/documentation-review
Комплексная новая feature           → skills/documentation-orchestrator
```

Правило выбора: запрос укладывается в один документ — работать напрямую специализированным skill; комплексный запрос (новая feature целиком или изменение нескольких типов документов) — `skills/documentation-orchestrator`.

При сомнении сверяться с разделами «Когда использовать» / «Когда не использовать» в `SKILL.md` соответствующего skill.
