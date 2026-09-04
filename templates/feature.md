---
title: <Название фичи>
type: feature-readme
status: draft
feature: <feature-name>
version: 0.1
owners:
  - product
---

# <Название фичи>

<!-- AI: README feature — точка входа. Один абзац: что делает feature и зачем.
Без деталей реализации и без дублирования product.md — только суть и навигация. -->

TBD: краткое описание feature (1–2 предложения).

## Documents

<!-- AI: перечислить существующие документы feature с их статусами из frontmatter.
Директории api/ и model/ — одной строкой со ссылкой на их README.md; статус берётся
из индекса. Файлы методов и сущностей в эту таблицу не выносить.
Не создавать строки для файлов, которых нет и которые не нужны (backend-only — без ui.md);
для ненужных указать "not planned" с причиной. -->

| Документ | Статус | Назначение |
|----------|--------|------------|
| [product.md](product.md) | draft | WHAT + WHY |
| [requirements.md](requirements.md) | draft | FR / BR / NFR |
| [model/](model/README.md) | draft | Модель данных: сущности feature |
| [ui.md](ui.md) | draft | Поведение интерфейса |
| [api/](api/README.md) | draft | Контракт API |
| [technical.md](technical.md) | draft | Техническое решение |
| `decisions/` | — | ADR feature |

## Related global context

<!-- AI: ссылки на используемый глобальный контекст (glossary-термины, BR-XXX, NFR-XXX,
API-соглашения). Не копировать содержимое — только ссылки (rules/linking.md). -->

TBD: ссылки на глобальные BR/NFR и разделы docs/product/, docs/api/.

## Status summary

<!-- AI: текущее состояние работы над feature: что утверждено, что в работе,
ключевые нерешённые вопросы (сводка Open questions из документов). -->

TBD: текущее состояние.
