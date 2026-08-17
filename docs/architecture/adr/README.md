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
- ID `ADR-XXX` — нумерация в глобальной области уникальности (вся документация вне `docs/features/`); стандарт — `../../../schemas/README.md`.
- Заголовок H1 обязан начинаться с `ADR-XXX:` — именно H1 определяет ID для автоматической валидации.
- У ADR два независимых статуса: статус документа в frontmatter (`draft`/`review`/`approved`/`deprecated`) и статус решения в секции Status (`proposed`, `accepted`, `deprecated`, `superseded`, `rejected`). Ориентировочное соответствие: `proposed` ↔ `draft`/`review`, `accepted` ↔ `approved`, `superseded`/`rejected` ↔ `deprecated`.
- Если ADR заменяет другой — двусторонняя ссылка (superseded by / supersedes).

## Список ADR

TBD: глобальные ADR ещё не созданы.
