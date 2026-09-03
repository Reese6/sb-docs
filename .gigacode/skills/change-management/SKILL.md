---
name: change-management
description: Управляет изменениями approved-документов через change proposals в docs/changes/ — proposal с дельтами ADDED/MODIFIED/REMOVED, применение утверждённого человеком proposal пишущими skills, архивирование. Триггеры — «изменить approved-документ», «подготовь change proposal», «примени proposal», «отклонённый proposal». Вход — approved-документ или существующий proposal. Не для MINOR-правок approved, правок draft/review (пишущие skills), новых features (documentation-orchestrator).
---

# Skill: change-management

## Когда использовать

Содержательно изменить `approved`-документ — добавить, изменить или пометить deprecated требования (MAJOR-версия) — через proposal в `docs/changes/<change-name>/`. Целевые документы skill сам не редактирует: при apply правки выполняют пишущие skills по своим SKILL.md. Поводы: нужно содержательное изменение approved-документа; человек утвердил proposal — применить; человек отклонил — архивировать. Порог — [CONTRIBUTING.md](../../../CONTRIBUTING.md), «Изменение утверждённых документов»; структура и жизненный цикл — [docs/changes/README.md](../../../docs/changes/README.md). MINOR-правки approved и правки `draft`/`review` — пишущий skill напрямую; новая feature — `documentation-orchestrator`; проверка — `documentation-review`.

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| Целевой документ `approved` и изменение содержательное | Стоп. Ответ: «Proposal не нужен — обычный процесс через пишущий skill». |
| Режим по body `## Status` существующего proposal: `approved` — apply, `rejected` — архивирование; proposal нет — propose | При `proposed` — Стоп. Ответ: «Proposal ждёт решения человека; не применяю и статус не меняю». |
| Режим propose: в `docs/changes/` нет другого активного proposal с теми же целевыми документами или ID | Стоп. Ответ: «Пересечение с proposal <name> — сначала согласовать; параллельный proposal не создаю». |

## Прочитать

1. Обязательно: [CONTRIBUTING.md](../../../CONTRIBUTING.md) (порог, версии, статусы); [schemas/README.md](../../../schemas/README.md) («Статусы change proposal», «Жизненный цикл ID»); целевые документы целиком; связанные документы feature. Правила — по AGENTS.md.
2. Глобальный контекст: [business-rules.md](../../../docs/product/business-rules.md), [glossary.md](../../../docs/product/glossary.md); «Активные изменения» в [docs/changes/README.md](../../../docs/changes/README.md).
3. Образец: [proposal.md](../../../templates/examples/changes/password-recovery-otp-sms/proposal.md) и [tasks.md](../../../templates/examples/changes/password-recovery-otp-sms/tasks.md) из `templates/examples/changes/`.

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст — русский, ключевые слова — английские; факт — без пометки, только из постановки, документов или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.` Действует и внутри дельт.

1. Статусы `approved`/`rejected` — только человек, ни у proposal, ни у целевых документов. `proposed`-proposal не применять и не «дозревать».
2. Новые требования в дельтах — placeholder `<TYPE>-NEW-<n>` (`FR-NEW-1`), уникальный в пределах proposal; реальный ID присваивает пишущий skill при apply (следующий свободный, включая deprecated).
3. MODIFIED «Было:» — дословная текущая формулировка; при apply сверяется с целевым документом.
4. REMOVED при apply = пометка `deprecated` с причиной и заменяющим ID, не удаление; ID не переиспользуются.
5. Статус proposal в frontmatter до решения человека — максимум `review`.
6. Правки целевых документов выполняют пишущие skills по своим SKILL.md в порядке pipeline: requirements → ui/api → technical.
7. Архив `docs/changes/archive/` после переноса не редактируется, даже если ссылки устарели; из валидации исключён.

## Шаги

### Режим propose

1. Создать `docs/changes/<change-name>/proposal.md` (kebab-case) из [templates/change-proposal.md](../../../templates/change-proposal.md), при необходимости `tasks.md` из [templates/change-tasks.md](../../../templates/change-tasks.md); дельты по формату шаблона (правила 2–4); комментарии `<!-- AI: -->` выполнить и удалить.
2. Добавить proposal в «Активные изменения» в `docs/changes/README.md`.
3. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

### Режим apply

1. Проверить: body `## Status` = `approved` и frontmatter `status: approved`. Иначе — стоп.
2. Сверить каждое «Было:» с целевым документом дословно. Расхождение — стоп: frontmatter proposal → `status: review` (body не менять), сообщить пользователю.
3. Выполнить план (`tasks.md`; нет — дельты по порядку pipeline): каждую правку — соответствующим пишущим skill; placeholders → реальные ID; REMOVED → deprecated.
4. Заполнить `## Assigned IDs` в proposal.md (placeholder → реальный ID); сами дельты не переписывать.
5. Целевые документы: `version` MAJOR bump, `status: approved` → `review`.
6. Запустить `.gigacode/skills/documentation-review` по затронутым feature; отчёт передать целиком, находки не устранять молча.
7. Архивировать: body `## Status` → `applied`, frontmatter → `deprecated`; `git mv docs/changes/<change-name> docs/changes/archive/YYYY-MM-<change-name>` (дата применения); обновить «Активные изменения».
8. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

### Режим rejected

Только шаги 7–8 режима apply, без правок целевых документов: body `## Status` остаётся `rejected`, frontmatter → `deprecated`, директория архивируется.

## Примеры

Неправильно — реальный ID до apply, «Было:» пересказано:

```text
#### ADDED
- FR-006: Пользователь может выбрать канал доставки кода.
#### MODIFIED
- FR-002:
  - Было: система шлёт код на email.
```

Правильно:

```text
#### ADDED
- FR-NEW-1: Пользователь может выбрать канал доставки OTP — email или SMS. Trace: указание product owner.
#### MODIFIED
- FR-002:
  - Было: Система должна отправить OTP на указанный email, если учётная запись с таким email существует.
  - Станет: Система должна отправить OTP по выбранному каналу, если учётная запись существует.
  - Причина: добавлен канал SMS.
```

## Чеклист

- [ ] Порог соблюдён: proposal только для содержательного изменения approved-документа.
- [ ] `approved`/`rejected` не выставлены AI — ни у proposal, ни у целевых документов.
- [ ] При apply каждое «Было:» сверено дословно.
- [ ] Реальные ID присвоены пишущими skills; placeholders `<TYPE>-NEW-<n>` в целевых документах не остались.
- [ ] REMOVED помечены deprecated, не удалены; ID не переиспользованы.
- [ ] `.gigacode/skills/documentation-review` запущен, отчёт передан целиком.
- [ ] «Активные изменения» в `docs/changes/README.md` актуален; архив не редактировался.
- [ ] `node scripts/validate-docs.mjs` — exit 0.

## Отчёт

Режим propose:

```text
Файлы: docs/changes/<change-name>/proposal.md [, tasks.md]
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
Статус: proposed — ждёт решения человека: `## Status` approved или rejected в body; при approved — и frontmatter `status: approved`
Следующий шаг: после approved — «примени proposal <change-name>»
```

Режим apply:

```text
Файлы: <изменённые целевые документы; архив docs/changes/archive/YYYY-MM-<change-name>/>
Assigned IDs: <placeholder → ID, …>
Дельты: <применённые ADDED/MODIFIED/REMOVED>
Итог review: <n ERROR, m WARNING; четыре списка>
Следующий шаг: повторный перевод целевых документов в approved — решение человека
```
