---
name: change-management
description: Управление изменениями утверждённых документов через change proposals в docs/changes/ — создание proposal с дельтами требований (ADDED/MODIFIED/REMOVED), применение утверждённого человеком proposal к целевым документам силами пишущих skills, архивирование. Использовать при содержательном изменении approved-документа (добавление/изменение/удаление требований), применении или отклонении proposal. Не использовать для MINOR-правок approved-документов, любых правок draft/review-документов и новых features.
---

# Skill: change-management

Управляет изменениями утверждённых (approved) документов через change proposals в `docs/changes/<change-name>/`. Сам не редактирует целевые документы: при apply содержательные правки выполняют пишущие skills по своим SKILL.md — по прецеденту `documentation-orchestrator`.

Каноническое правило порога (когда proposal обязателен) — [CONTRIBUTING.md](../../CONTRIBUTING.md), раздел «Изменение утверждённых документов». Структура директории и жизненный цикл — [docs/changes/README.md](../../docs/changes/README.md), статусы — [schemas/README.md](../../schemas/README.md), раздел «Статусы change proposal».

## Когда использовать

- Нужно содержательно изменить approved-документ: добавить, изменить или пометить deprecated требования (MAJOR-версия).
- Человек утвердил существующий proposal (`## Status: approved`) — нужно применить его дельты.
- Человек отклонил proposal (`## Status: rejected`) — нужно архивировать его без применения.

## Когда не использовать

| Задача | Правильный путь |
|--------|-----------------|
| MINOR-правка approved-документа (опечатки, ссылки, формулировки без изменения смысла) | соответствующий пишущий skill напрямую |
| Любая правка `draft`/`review`-документа | соответствующий пишущий skill напрямую |
| Новая feature целиком | `skills/documentation-orchestrator` |
| Проверить документацию | `skills/documentation-review` |

## Процесс

### Шаг 0. Определить режим

- Proposal для запрошенного изменения не существует — режим **propose**.
- Proposal существует, body `## Status` = `approved` — режим **apply**.
- Proposal существует, body `## Status` = `rejected` — режим **архивирование rejected** (шаг 3 режима apply не выполняется, см. ниже).
- Proposal существует, body `## Status` = `proposed` — остановиться: ждать решения человека, не применять и не «дозревать» статус самостоятельно.

### Режим propose

1. Прочитать контекст: [rules/ai-guardrails.md](../../rules/ai-guardrails.md), [schemas/README.md](../../schemas/README.md), [CONTRIBUTING.md](../../CONTRIBUTING.md), целевые документы целиком, связанные документы feature и глобальный контекст ([docs/product/business-rules.md](../../docs/product/business-rules.md), [docs/product/glossary.md](../../docs/product/glossary.md)).
2. Проверить порог: изменение содержательное и целевой документ `approved`? Нет — направить в обычный процесс (пишущий skill); proposal «на всякий случай» не создавать.
3. Проверить пересечение с активными proposals в `docs/changes/` по целевым документам и ID. Конфликт — остановиться и согласовать с пользователем, не создавать параллельный proposal молча.
4. Создать `docs/changes/<change-name>/proposal.md` (и при необходимости `tasks.md`) из шаблонов [templates/change-proposal.md](../../templates/change-proposal.md) и [templates/change-tasks.md](../../templates/change-tasks.md). Дельты — по формату шаблона: новые требования — placeholders `<TYPE>-NEW-<n>`; в MODIFIED «Было:» — дословная текущая формулировка; правила FACT/ASSUMPTION/TBD действуют внутри дельт.
5. Обновить список «Активные изменения» в [docs/changes/README.md](../../docs/changes/README.md).
6. Прогнать `node scripts/validate-docs.mjs`. Сообщить пользователю: proposal создан и ждёт решения человека (`approved`/`rejected`); статус документа в frontmatter — максимум `review`.

### Режим apply

1. Проверить вход: body `## Status` = `approved` и frontmatter `status: approved` (оба выставляет только человек). Иначе — остановиться.
2. Сверить каждое «Было:» из дельт с текущим текстом целевых документов — дословно. Расхождение (документ изменился после создания proposal) — остановиться, вернуть proposal в `review` и сообщить пользователю.
3. Выполнить план (`tasks.md`, при его отсутствии — дельты по порядку pipeline: requirements → ui/api → technical): каждую правку выполняет соответствующий пишущий skill по своему SKILL.md. Пишущие skills присваивают реальные ID вместо placeholders (следующий свободный номер, включая deprecated); REMOVED — пометка deprecated с причиной и заменяющим ID, не удаление.
4. Заполнить секцию `## Assigned IDs` в proposal.md (placeholder → реальный ID); сами дельты не переписывать.
5. Целевые документы: version MAJOR bump, статус `approved` → `review` (по [schemas/README.md](../../schemas/README.md)).
6. Запустить `skills/documentation-review` по затронутым feature; отчёт передать пользователю целиком, находки не устранять молча.
7. Архивировать: body `## Status` → `applied`, frontmatter → `deprecated`, перенести директорию в `docs/changes/archive/YYYY-MM-<change-name>/` (`YYYY-MM` — дата применения, `git mv`), обновить «Активные изменения» в [docs/changes/README.md](../../docs/changes/README.md). После переноса файлы архива не редактируются, даже если относительные ссылки в них устарели, — архив исключён из валидации.
8. Сообщить пользователю: применённые дельты и затронутые файлы, таблица Assigned IDs, итог review. Повторный перевод целевых документов в `approved` — отдельное решение человека, обычным процессом.

Для rejected-proposal выполняются только шаги 7–8 без внесения правок: body `## Status` остаётся `rejected`, frontmatter → `deprecated`, директория архивируется.

## Проверить результат

Перед завершением пройти чеклист:

- [ ] Порог соблюдён: proposal создан только для содержательного изменения approved-документа.
- [ ] Статусы `approved`/`rejected` не выставлены AI — ни у proposal, ни у целевых документов.
- [ ] При apply каждое «Было:» сверено дословно с целевым документом.
- [ ] Реальные ID присвоены пишущими skills; placeholders `<TYPE>-NEW-<n>` не остались в целевых документах.
- [ ] REMOVED-требования помечены deprecated, не удалены; их ID не переиспользованы.
- [ ] `skills/documentation-review` запущен, отчёт передан целиком.
- [ ] Список «Активные изменения» в `docs/changes/README.md` актуален.
- [ ] Архивные директории не редактировались; `node scripts/validate-docs.mjs` — exit 0.
