# 11. Skill `architecture-decisions`

> Источник: INIT.md, ЭТАП 11. Приоритет: P2.
> Зависит от: 10.

## Цель

Создать `skills/architecture-decisions/SKILL.md` для работы с ADR.

## Концептуальный ориентир

- `architecture-decision-records` (без runtime dependency).

## Поведение skill

Определять, когда решение заслуживает ADR. ADR нужен, если решение:

- существенно влияет на архитектуру;
- сложно изменить;
- имеет несколько разумных альтернатив;
- создаёт важные ограничения;
- важно понимать будущим разработчикам.

Не создавать ADR на каждую мелочь.

## Статусы ADR

```text
proposed
accepted
deprecated
superseded
rejected
```

Если ADR заменяет другой ADR — двусторонняя ссылка (superseded ↔ superseding).

## Требования

- Использовать `templates/adr.md` и ID `ADR-XXX` (стандарт задачи 04).
- Размещение: глобальные — `docs/architecture/adr/`, feature-специфичные — `docs/features/<name>/decisions/`.
- Traceability к требованиям (пример: `ADR-003 → NFR-002`).

## Результат (deliverables)

- `skills/architecture-decisions/SKILL.md`

## Критерии готовности

- 5 критериев необходимости ADR зафиксированы.
- 5 статусов поддержаны.
- Правило двусторонней ссылки при supersede описано.
