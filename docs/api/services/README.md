# API services

API-документация по отдельным сервисам: один файл (или директория) на сервис.

## Правила

- Имя файла — имя сервиса: `<service-name>.md` (kebab-case, совпадает с именем в `services/` и в `../../architecture/components.md`).
- Документ создаётся по шаблону `templates/service-api.md`; ключ `feature:` из frontmatter шаблона удалить — сервисный документ не принадлежит feature. Один метод — один `##`-блок «METHOD path»; `API-XXX` определяется первой строкой блока в форме `- API-001 (→ FR-012): …`, в заголовок ID не выносится.
- Глобальные соглашения (auth, ошибки, пагинация) не копируются — ссылки на `../authentication.md`, `../errors.md`, `../conventions.md`.
- API конкретной feature документируется в `docs/features/<feature-name>/api/`; здесь — сервисный уровень (обзор endpoints сервиса, ссылки на features).

## Как сюда попадают сервисные API

1. API уровня feature живёт в `docs/features/<feature-name>/api/`; сюда попадает то, что шире одной feature, — контракт сервиса.
2. Документы feature переводит в `approved` человек.
3. `/feature-apply` создаёт или дополняет `<service-name>.md` и добавляет строку в раздел «Сервисы» ниже.
4. Целевой файл уже `approved` — правки на месте нет: `/feature-apply` готовит change proposal в [../../changes/](../../changes/) (skill `change-management`).

## Сервисы

TBD: сервисы ещё не документированы.
