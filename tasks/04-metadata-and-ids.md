# 04. Стандарт метаданных и идентификаторов

> Источник: INIT.md, ЭТАП 3. Приоритет: P0.
> Зависит от: 03.

## Цель

Разработать единый стандарт идентификаторов требований и YAML frontmatter для документов; создать схемы в `schemas/`.

## Стандарт идентификаторов

Минимум:

```text
FR-XXX   Functional Requirement
BR-XXX   Business Rule
NFR-XXX  Non-functional Requirement
UI-XXX   UI Requirement
API-XXX  API Requirement
ADR-XXX  Architecture Decision
```

Определить:

- формат;
- правила создания;
- правила удаления;
- правила изменения;
- запрет на переиспользование удалённых ID;
- правила cross-reference.

Пример cross-reference:

```text
UI-004 → FR-012
API-007 → FR-012
ADR-003 → NFR-002
```

## YAML frontmatter

Пример:

```yaml
---
title: Password recovery
type: requirements
status: draft
feature: password-recovery
version: 1.0
owners:
  - product
related:
  - product.md
  - ui.md
  - api.md
  - technical.md
---
```

Статусы документов:

```text
draft
review
approved
deprecated
```

## Шаги

1. Описать стандарт ID (формат, жизненный цикл, cross-reference) — согласовать с `rules/requirements.md` и `rules/linking.md` из задачи 03.
2. Разработать стандарт YAML frontmatter.
3. Создать схемы:
   - `schemas/requirement.schema.yaml`
   - `schemas/feature.schema.yaml`
   - `schemas/metadata.schema.yaml`

## Ограничения

- Схемы должны быть достаточно простыми, чтобы AI мог стабильно их соблюдать.
- Не создавать чрезмерно сложные YAML schemas (см. «Что не нужно делать» в INIT.md).

## Результат (deliverables)

- Документ со стандартом ID и frontmatter (в `rules/` или `schemas/`).
- Три схемы в `schemas/`.

## Критерии готовности

- Все 6 типов ID определены с полным жизненным циклом.
- Запрет переиспользования удалённых ID зафиксирован.
- Frontmatter покрывает: title, type, status, feature, version, owners, related.
- 4 статуса документов определены.
