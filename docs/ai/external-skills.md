---
title: Recommended external skills
type: technical
status: draft
version: 0.1
owners:
  - architecture
---

# Recommended external skills

Справочник рекомендуемых внешних Agent Skills из реестра [skills.sh](https://skills.sh). Внешние skills — концептуальные ориентиры: на них можно смотреть при развитии собственных skills, у них можно заимствовать подходы и структуру.

## Ключевое правило

- Source of truth для процессов этого репозитория — **локальные** `skills/*/SKILL.md`.
- Внешние skills носят исключительно справочный характер: репозиторий **не имеет runtime dependency** от skills.sh или любых внешних skills.
- Установка внешних skills опциональна и не требуется для работы с документацией.
- При конфликте рекомендаций внешнего skill и локальных правил (`rules/`, `skills/`) приоритет всегда у локальных.

## Концептуальные ориентиры

Пять ориентиров из постановки проекта и их соответствие локальным skills:

| Ориентир | Пример в реестре skills.sh | Локальный source of truth |
|----------|----------------------------|---------------------------|
| prd-development | `deanpeters/product-manager-skills@prd-development` | `skills/product-documentation/` |
| user-story | `deanpeters/product-manager-skills@user-story` | `skills/requirements/` |
| documentation | `anthropics/knowledge-work-plugins@documentation` | `skills/documentation-orchestrator/`, `skills/documentation-review/` |
| api-documentation-generator | `sickn33/agentic-awesome-skills@api-documentation-generator` | `skills/api-requirements/` |
| architecture-decision-records | `wshobson/agents@architecture-decision-records` | `skills/architecture-decisions/` |

Страницы в реестре:

- <https://skills.sh/deanpeters/product-manager-skills/prd-development>
- <https://skills.sh/deanpeters/product-manager-skills/user-story>
- <https://skills.sh/anthropics/knowledge-work-plugins/documentation>
- <https://skills.sh/sickn33/agentic-awesome-skills/api-documentation-generator>
- <https://skills.sh/wshobson/agents/architecture-decision-records>

## Установка (опционально)

Если нужно изучить внешний skill локально, установка выполняется через `npx skills` (Node.js >= 18, сеть):

```bash
npx skills add deanpeters/product-manager-skills@prd-development
npx skills add deanpeters/product-manager-skills@user-story
npx skills add anthropics/knowledge-work-plugins@documentation
npx skills add sickn33/agentic-awesome-skills@api-documentation-generator
npx skills add wshobson/agents@architecture-decision-records
```

Поиск альтернатив:

```bash
npx skills search <query>
```

Установленные внешние skills не коммитятся в этот репозиторий и не участвуют в его процессах.
