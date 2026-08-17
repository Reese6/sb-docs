# Architecture Decision Records

Глобальные архитектурные решения (ADR), затрагивающие несколько features или систему целиком. ADR уровня одной feature живут в `docs/features/<feature-name>/decisions/`.

## Когда нужен ADR

Решение заслуживает ADR, если оно:

- существенно влияет на архитектуру;
- сложно изменить;
- имеет несколько разумных альтернатив;
- создаёт важные ограничения;
- важно для понимания будущими разработчиками.

Не создавать ADR на каждую мелочь.

## Формат

- Шаблон: `templates/adr.md`.
- Имя файла: `adr-XXX-<short-kebab-title>.md` (например, `adr-001-event-driven-notifications.md`).
- ID `ADR-XXX` — сквозная нумерация в пределах этой директории; стандарт — `../../../schemas/README.md`.
- Статусы: `proposed`, `accepted`, `deprecated`, `superseded`, `rejected`.
- Если ADR заменяет другой — двусторонняя ссылка (superseded by / supersedes).

## Список ADR

TBD: глобальные ADR ещё не созданы.
