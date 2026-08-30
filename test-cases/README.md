# test-cases/

Тест-кейсы ручного тестирования: один файл на feature — `test-cases/<feature-name>.md`.

- Создаются skill `skills/test-cases` по шаблону `templates/test-cases.md`.
- Источник — только документация `docs/` (requirements, ui, api, business rules). Код в `services/` источником не является.
- Неизвестные значения помечаются `TBD`, не выдумываются (`rules/ai-guardrails.md`).
- После apply change proposal файл затронутой feature обновляется инкрементально (skill `test-cases`, режим change): новые TC — по ADDED, переписанные — по MODIFIED, `DEPRECATED` — по REMOVED; номера TC не переиспользуются.
