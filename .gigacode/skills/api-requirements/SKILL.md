---
name: api-requirements
description: Создаёт и изменяет api.md feature — человекочитаемый контракт API (endpoints, request/response, ошибки, идемпотентность, лимиты) со стабильными API-XXX и ссылками на FR/BR/NFR. Триггеры — «опиши API», «endpoint», «контракт», «запрос и ответ», «коды ошибок», «api.md». Вход — готовые product.md и requirements.md. Не для FR/BR/NFR (requirements), интерфейса (ui-requirements), реализации (technical-documentation).
---

# Skill: api-requirements

## Когда использовать

Создать или изменить `docs/features/<feature>/api.md` — контракт клиент–сервер для людей: продакта, тестировщика, разработчиков клиента и сервера. Источник контракта — `requirements.md`. OpenAPI не генерируется: это отдельная задача по явному запросу, `api.md` остаётся источником смысла. Поводы: готовы `product.md` и `requirements.md`; добавить или изменить API-требование; стадия API оркестратора. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| `product.md` и `requirements.md` feature существуют | Стоп. Ответ: «Сначала product.md (skill `product-documentation`) и requirements.md (skill `requirements`)». |
| Документ не `approved`, либо правка MINOR, либо apply утверждённого change proposal | Стоп. Ответ: «Содержательное изменение approved-документа — через `change-management`». |

## Прочитать

1. Обязательно: `product.md` и `requirements.md` feature целиком; соглашения [docs/api/overview.md](../../../docs/api/overview.md), [conventions.md](../../../docs/api/conventions.md), [authentication.md](../../../docs/api/authentication.md), [errors.md](../../../docs/api/errors.md) — контракт feature обязан им следовать; [schemas/README.md](../../../schemas/README.md) — ID и frontmatter. Правила — по AGENTS.md.
2. Если есть: текущий `api.md` целиком, включая deprecated (они занимают номера); `ui.md` и `technical.md` — валидация и ошибки в API обязаны совпадать с UI; документация сервисов [docs/api/services/](../../../docs/api/services/README.md).
3. Образец: [templates/examples/password-recovery/api.md](../../../templates/examples/password-recovery/api.md).

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций, ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из `requirements.md`, `docs/api/`, документации сервисов или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; существующие ID не менять и не переиспользовать.

1. Охват — FR/BR/NFR с ответом на вопрос «какой запрос и ответ это реализует?». Чисто интерфейсные требования в `api.md` не попадают.
2. Каждый сценарий `product.md`, требующий сервера, проходим через описанные endpoints. Непроходимый — пробел: `TBD` в соответствующей секции.
3. Endpoints, поля, коды ошибок, лимиты, тайм-ауты, форматы — только из источников, не «по аналогии». Признак нарушения: значение, которого нет ни в `requirements.md`, ни в `docs/api/`, и которое не дал человек.
4. Определение требования — строго `- API-007 (→ FR-012): <специфика API>`: только ID источника и специфика уровня API, формулировку FR/BR/NFR не копировать. Связи нет — найти источник или явно написать, почему её нет.
5. Новый ID = наибольший `API-XXX` в feature (включая deprecated) + 1; пропуски не заполнять. Изменение формулировки сохраняет ID; удаление = пометка `deprecated`.
6. Аутентификация, формат ошибок, общие коды, пагинация, форматы данных описаны один раз в `docs/api/` — в feature только ссылка и специфика endpoint.
7. Специфичный код ошибки — в `api.md` со ссылкой на `docs/api/errors.md`. Новый общий код — предложить в `docs/api/errors.md`, локально не заводить.
8. Endpoint, нарушающий `docs/api/conventions.md`, — с явным обоснованием (ADR или пометка в `api.md`).
9. Валидация и семантика ошибок совпадают с `ui.md`; расхождение — пометить конфликт, не «чинить» молча.
10. Документ — проза, таблицы, примеры; не YAML-дамп. Значения в Examples — правдоподобные, но явно тестовые; реальные данные не использовать.
11. Новый документ — `type: api`, `status: draft`. Существующий — минимальная правка; `version`: MINOR без изменения смысла, MAJOR при новых или изменённых API-XXX; `approved` после правки → `review`.

## Шаги

1. Из `requirements.md` выбрать требования с серверным проявлением (правило 1); проверить проходимость сценариев (правило 2).
2. Для каждого endpoint — подраздел `###` с методом, путём, назначением и `API-XXX` (правила 4–5). Контракты различаются — секции заполнять per-endpoint внутри подразделов.
3. Для каждого endpoint заполнить каждую секцию шаблона (request, validation, response, authentication, authorization, errors, idempotency, pagination, filtering, sorting, rate limits, security, side effects, events, examples) или `Not applicable: <причина>`. Конкурентные запросы — в Idempotency.
4. Новый документ — из [templates/api.md](../../../templates/api.md): комментарии `<!-- AI: -->` выполнить и удалить.
5. Заполнить Traceability: строка на каждый `API-XXX`, включая deprecated, с минимум одной связью; затем обновить колонку «Покрыто (UI / API / technical)» в Traceability `requirements.md` (часть API).
6. Если изменён существующий `API-XXX`: `grep -rn "API-003" docs/` → проверить расхождение с `requirements.md` и `ui.md` (валидация, ошибки) → конфликт пометить `TBD`/`ASSUMPTION` → обновить Traceability затронутых документов. Связанные документы молча не переписывать.
7. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — скопирована формулировка BR, выдуманы число и код ошибки:

```text
- API-003: Пользователь может запросить код повторно не чаще одного раза в 60 секунд, при более частом вызове endpoint возвращает 429 с кодом RATE_LIMIT_EXCEEDED.
```

Правильно — только ID источника и специфика API; неподтверждённый код — TBD:

```text
- API-003 (→ BR-002): повторный вызов ранее истечения интервала повторной отправки возвращает 429. TBD: код ошибки — по docs/api/errors.md.
```

## Чеклист

- [ ] Каждое существенное API-требование имеет `API-XXX` в форме `- API-XXX (→ FR-XXX): …`; номера не переиспользованы.
- [ ] Каждая секция шаблона заполнена для каждого endpoint или помечена `Not applicable`.
- [ ] Формулировки FR/BR/NFR не скопированы — только ID и специфика API.
- [ ] Глобальные соглашения не скопированы — только ссылки на `docs/api/` и специфика endpoint.
- [ ] Ни одного выдуманного endpoint, поля, кода или лимита; каждое значение прослеживается к `requirements.md`, `docs/api/` или словам человека.
- [ ] Каждый `ASSUMPTION` — с `Requires confirmation.`; ни один не записан как факт.
- [ ] Документ человекочитаем; в OpenAPI не превращён; Examples — тестовые значения.
- [ ] Traceability содержит все `API-XXX`; колонка «Покрыто» в `requirements.md` обновлена.

## Отчёт

```text
Файлы: <созданные/изменённые пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
FR/BR/NFR без API-покрытия: <ID или none>
Следующий шаг: .gigacode/skills/technical-documentation, затем .gigacode/skills/documentation-review
```
