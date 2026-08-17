# 14. Финализация AGENTS.md

> Источник: INIT.md, ЭТАП 14. Приоритет: P4.
> Зависит от: 13 (все skills готовы).

## Цель

Доработать `AGENTS.md` до основного entry point для AI-агента.

## AI при входе в repository должен понять

1. Что это за repository.
2. Где находится product context.
3. Где находятся features.
4. Как определить нужный skill.
5. Какие документы необходимо читать перед изменением.
6. Где находятся templates.
7. Где находятся rules.
8. Как обрабатывать `TBD`.
9. Как работать с `ASSUMPTION`.
10. Как обращаться с requirement IDs.
11. Когда анализировать `services/`.
12. Когда запускать documentation review.

## Routing table

```text
Создать/изменить описание функции
→ product-documentation

Формализовать требования
→ requirements

Описать интерфейс
→ ui-requirements

Описать API
→ api-requirements

Описать реализацию
→ technical-documentation

Зафиксировать архитектурное решение
→ architecture-decisions

Проверить документацию
→ documentation-review

Комплексная новая feature
→ documentation-orchestrator
```

## Требования

- Согласованность с README.md, rules/, skills/ — без противоречий и дублирования.
- Учесть критерий качества проекта: новый AI-агент после чтения только AGENTS.md + README.md должен понять структуру, source of truth, выбор skill, работу с неизвестной информацией и проверку результата.

## Результат (deliverables)

- Обновлённый `AGENTS.md`.

## Критерии готовности

- Все 12 пунктов понимания покрыты.
- Routing table включена и соответствует реальным skills.
- Нет противоречий с README.md и rules/.
