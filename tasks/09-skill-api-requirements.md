# 09. Skill `api-requirements`

> Источник: INIT.md, ЭТАП 9. Приоритет: P1.
> Зависит от: 07 (может выполняться параллельно с 08).

## Цель

Создать `skills/api-requirements/SKILL.md` — skill для человекочитаемой API specification.

## Концептуальные ориентиры

- `documentation`;
- `api-documentation-generator`.

Без runtime dependency.

## Поведение skill

- Не превращать документ автоматически в OpenAPI, если это не требуется.
- Создавать `api.md` по `templates/api.md`.

Описывать:

- назначение endpoint;
- request;
- response;
- validation;
- authentication;
- authorization;
- errors;
- idempotency;
- concurrency;
- pagination;
- filtering;
- sorting;
- rate limiting;
- security;
- side effects;
- events.

## Идентификаторы и traceability

- Каждое существенное API-требование получает `API-XXX`.
- API должен иметь traceability к продуктовым требованиям (FR/BR/NFR).

## Ограничения

- Не придумывать API (см. `rules/ai-guardrails.md`); неизвестные контракты — TBD/ASSUMPTION.
- Учитывать глобальные `docs/api/` (conventions, authentication, errors) — не дублировать их в каждой feature.

## Результат (deliverables)

- `skills/api-requirements/SKILL.md`

## Критерии готовности

- Все 16 аспектов описания endpoint перечислены.
- Правило «не OpenAPI по умолчанию» зафиксировано.
- Правила API-XXX ID и traceability к продуктовым требованиям описаны.
