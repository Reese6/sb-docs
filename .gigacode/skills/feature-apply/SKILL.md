---
name: feature-apply
description: Промоутит результаты approved-feature в глобальные документы — новые сущности в docs/architecture/data-model/ и сервисные API в docs/api/services/, с change proposal вместо правки approved-целей. Триггеры — «примени feature», «промоут», «вынеси сущности в глобальную модель», «сервисный API», стадия apply оркестратора. Вход — approved директории model/ и api/ feature. Не для apply утверждённого proposal (change-management), содержания документов feature (пишущие skills), вызовов чужих систем (technical-documentation).
---

# Skill: feature-apply

## Когда использовать

Перенести результаты `approved`-feature в глобальные документы: новые сущности — в `docs/architecture/data-model/<entity>.md`, сервисные API — в `docs/api/services/<service>.md`. Единственный skill, создающий эти файлы. Поводы: документы feature переведены человеком в `approved`; стадия apply оркестратора. Целевой файл уже `approved` — skill готовит change proposal, применяет его `change-management`. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| Индексы и все файлы `model/` и `api/` feature — в статусе `approved` | Стоп. Ответ: «Промоут только из approved-документов; статус ставит человек». Расхождение статусов внутри директории назвать поимённо. |
| Целевой глобальный файл отсутствует либо его `status` — `draft` или `review` | Целевой `approved`: на месте не править. Подготовить change proposal (`change-management`, режим propose). |
| В `docs/changes/` нет активного proposal на те же целевые документы | Стоп. Ответ: «Пересечение с proposal `<change-name>` — сначала согласовать». |

## Прочитать

1. Обязательно: `model/README.md` и все файлы сущностей `model/`, `api/README.md` и все файлы методов `api/` целиком; [data-model/](../../../docs/architecture/data-model/README.md) и все файлы сущностей в этой директории; [services/](../../../docs/api/services/README.md) и все файлы сервисов; [components.md](../../../docs/architecture/components.md) — имена сервисов; [schemas/README.md](../../../schemas/README.md) — frontmatter и нумерация ID. Правила — по AGENTS.md.
2. Если есть: активные proposal в [docs/changes/](../../../docs/changes/README.md).
3. Куда идут вызовы чужих систем: [integrations.md](../../../docs/architecture/integrations.md).

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из `approved`-документов feature или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; существующие ID не менять и не переиспользовать.

1. Промоут переносит содержание дословно. Новых полей, методов и значений при переносе не появляется.
2. Новая сущность — файл `docs/architecture/data-model/<entity>.md` из `templates/entity.md`, имя kebab-case, `type: architecture`, `status: draft`, без ключа `feature`.
3. Секция «Используется в features» файла сущности — ссылка на feature; при повторном промоуте строка добавляется, прежние сохраняются.
4. Сервисный API — файл `docs/api/services/<service>.md` из `templates/service-api.md`, ключ `feature` из frontmatter удалить. Имя файла совпадает с именем сервиса в `components.md`.
5. API, которые feature вызывает у чужих систем, — в `docs/architecture/integrations.md`, не в `services/`.
6. `API-XXX` сервисного документа — новый номер глобальной области: максимум по документации вне `docs/features/`, включая deprecated, плюс один. Номер из feature не переносить.
7. Форма определения метода — `- API-001 (→ FR-012): <специфика>` первой строкой блока `##`; ID в заголовок не выносить.
8. ID другой области сопровождается ссылкой на файл-источник при первом упоминании (`rules/linking.md`).
9. Целевой файл `approved` — ни строки в него: `docs/changes/<change-name>/proposal.md` из `templates/change-proposal.md`, дельты `ADDED` и `MODIFIED`, `## Status` в body — `proposed`.
10. Статусы `approved` и `rejected` ставит только человек — ни у proposal, ни у целевых файлов.
11. Индексы обязательны: сущность — в `data-model/README.md`, сервис — в `services/README.md`, proposal — в «Активные изменения» `docs/changes/README.md`.
12. Документы feature этот skill не меняет; apply утверждённого proposal — `change-management`.

## Шаги

1. Проверить `status` индексов и всех файлов `model/` и `api/` по таблице «Вход и стоп-условия».
2. Выписать промоутируемое: сущности из файлов `model/`; методы из файлов `api/`, которые шире одной feature (правило 5).
3. Для каждой цели определить развилку: файла нет — создать; `draft` или `review` — дополнить; `approved` — proposal.
4. Создать файлы сущностей из [templates/entity.md](../../../templates/entity.md); заполнить «Назначение», «Поля», «Связи», «Правила», «Используется в features».
5. Создать или дополнить сервисные документы из [templates/service-api.md](../../../templates/service-api.md) без ключа `feature`; присвоить новые `API-XXX` (правила 6–7).
6. Если есть цель в статусе `approved`: создать `docs/changes/<change-name>/proposal.md` из [templates/change-proposal.md](../../../templates/change-proposal.md) и добавить его в «Активные изменения» [docs/changes/README.md](../../../docs/changes/README.md).
7. Обновить индексы в форме `- [<Сущность>](<entity>.md) — <назначение одной фразой>` и `- [<service-name>](<service-name>.md) — <назначение одной фразой>`; строку `TBD` при первой записи удалить.
8. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — approved-цель дописана на месте, номер перенесён из feature:

```text
services/auth.md (status approved) — дописан блок POST /reset с номером API-003 из feature.
```

Правильно — цель не тронута, изменение вынесено в proposal:

```text
services/auth.md approved — файл не изменялся.
changes/auth-reset-endpoint/proposal.md создан, Status proposed, дельта ADDED.
```

## Чеклист

- [ ] Исходные документы feature — `approved`; их содержание не изменялось.
- [ ] Каждая новая сущность вынесена в отдельный файл `data-model/<entity>.md` со `status: draft`.
- [ ] В сервисном документе нет ключа `feature`; имя файла совпадает с именем сервиса в `components.md`.
- [ ] Номера API присвоены заново по глобальной области; номера из feature не перенесены.
- [ ] ID другой области дан со ссылкой на файл-источник.
- [ ] Ни один `approved`-файл не изменён на месте; для каждого создан proposal со статусом `proposed`.
- [ ] Оба индекса пополнены; строки `TBD` при первой записи удалены.
- [ ] Новых полей, методов и значений при переносе не появилось.

## Отчёт

```text
Файлы: <созданные/изменённые пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
Promoted: сущности <список>; сервисы <список>; proposals <список или none>
Следующий шаг: .gigacode/skills/change-management при наличии proposal, иначе .gigacode/skills/documentation-review
```
