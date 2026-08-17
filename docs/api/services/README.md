# API services

API-документация по отдельным сервисам: один файл (или директория) на сервис.

## Правила

- Имя файла — имя сервиса: `<service-name>.md` (kebab-case, совпадает с именем в `services/` и в `../../architecture/components.md`).
- Документ создаётся по шаблону `templates/api.md`; ключ `feature:` из frontmatter шаблона удалить — сервисный документ не принадлежит feature.
- Глобальные соглашения (auth, ошибки, пагинация) не копируются — ссылки на `../authentication.md`, `../errors.md`, `../conventions.md`.
- API конкретной feature документируется в `docs/features/<feature-name>/api.md`; здесь — сервисный уровень (обзор endpoints сервиса, ссылки на features).

## Сервисы

TBD: сервисы ещё не документированы.
