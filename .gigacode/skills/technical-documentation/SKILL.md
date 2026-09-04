---
name: technical-documentation
description: Создаёт и изменяет technical.md feature — HOW (компоненты, data flow, данные, миграции, деплой) на основе требований и кода в services/. Триггеры — «опиши реализацию», «техническое решение», «компоненты», «data flow», «миграция», «services/», «technical.md». Вход — product.md и requirements.md (model.md, ui.md, api.md — если есть). Не для требований (requirements), API (api-requirements), интерфейса (ui-requirements), ADR (architecture-decisions).
---

# Skill: technical-documentation

## Когда использовать

Создать или изменить `docs/features/<feature>/technical.md` — как реализовать утверждённые требования. Новые требования здесь не появляются, только реализация существующих. Поводы: готовы `product.md` и `requirements.md`; добавить или изменить техническое решение; стадия technical оркестратора. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| `product.md` и `requirements.md` feature существуют | Стоп. Ответ: «Сначала product.md (skill `product-documentation`) и requirements.md (skill `requirements`)». |
| Прочитаны требования и существующие ADR, проверен `services/` | Стоп: решение «из головы» не описывается. Сначала «Прочитать» и шаг 1. |
| Документ не `approved`, либо правка MINOR, либо apply утверждённого change proposal | Стоп. Ответ: «Содержательное изменение approved-документа — через `change-management`». |

## Прочитать

1. Обязательно: `product.md` и `requirements.md` feature целиком; [services/README.md](../../../services/README.md); [schemas/README.md](../../../schemas/README.md) — frontmatter. Правила — по AGENTS.md.
2. Если есть: `model.md`, `ui.md` и `api.md` целиком — решение реализует их состав данных, контракт и поведение, не переопределяет; текущий `technical.md`; ADR — глобальные в [docs/architecture/adr/](../../../docs/architecture/adr/README.md) и `docs/features/<feature>/decisions/`.
3. Архитектурный контекст: [overview.md](../../../docs/architecture/overview.md), [components.md](../../../docs/architecture/components.md), [data-model/](../../../docs/architecture/data-model/README.md), [integrations.md](../../../docs/architecture/integrations.md) — имена компонентов и сущностей брать оттуда.

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из `requirements.md`, `ui.md`/`api.md`, кода в `services/`, `docs/architecture/` или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; у `technical.md` своих ID нет — только ссылки на FR/BR/NFR/UI/API.

1. Два источника правды: `requirements.md` (и `model.md`, `ui.md`, `api.md`) — требуемое поведение; код в `services/` — текущая реализация. Уровни не смешивать.
2. Код противоречит требованию — в Current implementation: какой ID нарушен, что делает код. Требование под код не переписывать; код как соответствующий не описывать. Непонятно, что верно, — `TBD` или вопрос в Open questions.
3. Current implementation — только из кода и документации: значимое поведение, без пересказа построчно. Поведение из кода, которого нет в `requirements.md`, — факт реализации, не требование; значимое — в Open questions. Код не подключён — `TBD: код сервиса X не подключён в services/`, предложить `npm run pull`.
4. Related requirements — только ID со ссылками. Пробел в требованиях — предложить дополнить `requirements.md` через skill `requirements`; здесь требование не фиксировать.
5. Доменные сущности и поля — в `model.md` feature и в `docs/architecture/data-model/`; здесь ссылка на них и физический уровень: таблицы, индексы, миграции. Сущности не переописывать; `model.md` нет, а сущности новые — предложить skill `data-model`.
6. Каждое требование из охвата реализуемо описанным решением; непокрытое — `TBD` или вопрос в Open questions.
7. Числа (нагрузка, тайм-ауты, лимиты, TTL) — только из NFR, кода или слов человека; имена компонентов, сервисов, таблиц, топиков, метрик — только из кода или `docs/architecture/`. Иного источника нет — `TBD`.
8. Существенный выбор (есть альтернативы, сложно изменить, создаёт ограничения) — кратко в Alternatives и предложить skill `architecture-decisions`; молча не принимать.
9. Решение не противоречит принятым ADR: следовать ADR или инициировать новый через `architecture-decisions`.
10. Внешние endpoints и пользовательские ошибки — `api.md`/`ui.md`, acceptance criteria — `requirements.md`; здесь внутренние API, ломающие изменения выделять явно.
11. Новый документ — `type: technical`, `status: draft`. Существующий — минимальная правка; `version`: MINOR без изменения смысла, MAJOR при изменении решения; `approved` после правки → `review`.

## Шаги

1. Проверить `services/`: подключён ли код сервисов feature (пути — `docs/architecture/components.md`). Подключён — изучить затронутые сервисы; нет — правило 3.
2. Определить охват: из `requirements.md`, `ui.md`, `api.md` выбрать FR/BR/NFR/UI/API, которые реализует решение (правила 4, 6).
3. Описать Current implementation (правила 2–3) и Proposed solution: суть подхода в нескольких абзацах, достаточно детально для реализации.
4. Заполнить каждую секцию шаблона (components; data flow — Mermaid sequenceDiagram или список; services involved с путём в `services/`; data model changes — ссылка на `model.md` и физические изменения; API changes; events; caching; transactions; error handling; security; observability; performance; backward compatibility; migration; deployment; testing considerations; alternatives; risks) или `Not applicable: <причина>`.
5. Новый документ — из [templates/technical.md](../../../templates/technical.md): комментарии `<!-- AI: -->` выполнить и удалить; в `related` — только существующие файлы.
6. Обновить колонку «Покрыто (UI / API / technical)» в Traceability `requirements.md` (часть technical) для всех ID из Related requirements.
7. Если изменено существующее решение: `grep -rn` по затронутым ID и именам компонентов в `docs/` → расхождения с `requirements.md`, `model.md`, `ui.md`, `api.md`, ADR → конфликт пометить `TBD`/`ASSUMPTION` → обновить Traceability. Связанные документы молча не переписывать.
8. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — код описан как соответствующий требованию, выдуманы имя сервиса и число:

```text
Current implementation: Сервис otp-service хранит код 5 минут в таблице otp_codes, как требует BR-005.
```

Правильно — расхождение зафиксировано, источники названы:

```text
Current implementation: Сервис X (`services/x`) хранит OTP в открытом виде в таблице `otp_codes` — противоречит NFR-002. Срок жизни кода в коде не ограничен: BR-005 не реализовано. TBD: код сервиса уведомлений не подключён в services/.
```

## Чеклист

- [ ] Подготовка выполнена: прочитаны требования, `ui.md`/`api.md`, ADR; проверен `services/`.
- [ ] Требуемое поведение — из `requirements.md`, текущая реализация — из кода; уровни не смешаны.
- [ ] Каждое расхождение кода с требованиями отмечено явно; код не подключён — стоит `TBD: код сервиса X не подключён в services/`.
- [ ] Каждая секция шаблона заполнена или помечена `Not applicable: <причина>`; незаполнимое содержит `TBD`.
- [ ] Новых требований нет; Related requirements — только ID со ссылками.
- [ ] Доменные сущности не переописаны — дана ссылка на `model.md`; здесь только физический уровень.
- [ ] Ни одного выдуманного имени или числа; каждый `ASSUMPTION` — с `Requires confirmation.`; решение не противоречит ADR, существенные выборы — в Alternatives.
- [ ] колонка «Покрыто» в `requirements.md` обновлена.

## Отчёт

```text
Файлы: <созданные/изменённые пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа, включая неподключённые сервисы): <список или none>
Расхождения кода и требований: <ID и суть, или none>
Следующий шаг: .gigacode/skills/architecture-decisions при существенном выборе, затем .gigacode/skills/documentation-review
```
