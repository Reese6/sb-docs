---
title: <Change title>
type: change
status: draft
version: 0.1
owners:
  - product
related:
  - ../features/<feature-name>/requirements.md
---

# <Название изменения>

<!-- AI: change proposal — предлагаемое содержательное изменение утверждённых
(approved) документов. Создаётся в docs/changes/<change-name>/proposal.md
(kebab-case). Когда proposal обязателен, а когда достаточно обычного процесса —
CONTRIBUTING.md, раздел «Изменение утверждённых документов».
Правила FACT / ASSUMPTION / TBD (rules/ai-guardrails.md) действуют и здесь:
дельты не выдумываются, неизвестные значения — TBD. -->

## Status

<!-- AI: статус ИЗМЕНЕНИЯ, одно из: proposed | approved | applied | rejected.
Не путать со статусом ДОКУМЕНТА в frontmatter (draft/review/approved/deprecated);
соответствие — schemas/README.md, раздел «Статусы change proposal».
Статусы approved и rejected выставляет только человек; applied — после
внесения всех правок в целевые документы (skills/change-management). -->

proposed

## Why

<!-- AI: мотивация изменения: какая проблема или новая постановка его вызвала,
со ссылкой на источник (продуктовая постановка, указание человека, ADR). -->

## What Changes

<!-- AI: суть изменения в 2–5 пунктах, человеческим языком, без пересказа
дельт. Читатель должен понять объём изменения, не читая секцию Deltas. -->

## Affected Documents

<!-- AI: все затрагиваемые документы. Статус и версия — текущие из frontmatter
целевого документа на момент создания proposal. Ссылки относительные. -->

| Документ | Статус / версия | Операции |
|----------|-----------------|----------|
| [requirements.md](../features/<feature-name>/requirements.md) | approved / 1.0 | ADDED, MODIFIED |

## Deltas

<!-- AI: одна подсекция ### на целевой документ; внутри — только применимые
подсекции #### ADDED / #### MODIFIED / #### REMOVED (неприменимые опускаются).
Правила:
- новые требования получают placeholder <TYPE>-NEW-<n> (FR-NEW-1, UI-NEW-2),
  уникальный в пределах proposal; реальный ID присваивается только при apply
  (schemas/README.md, «Жизненный цикл ID»);
- в MODIFIED поле «Было:» цитирует текущую формулировку ДОСЛОВНО — при apply
  она сверяется с целевым документом, расхождение останавливает применение;
- REMOVED при apply означает пометку deprecated с причиной и заменяющим ID,
  а не физическое удаление;
- операции RENAMED не существует: переименование ID запрещено; разделение
  требования = MODIFIED/REMOVED старого + ADDED новых. -->

### <целевой документ>

#### ADDED

- FR-NEW-1: <полный финальный текст требования>. Trace: <источник>.

#### MODIFIED

- FR-XXX:
  - Было: <дословная текущая формулировка>.
  - Станет: <новая формулировка>.
  - Причина: <причина изменения>.

#### REMOVED

- FR-XXX: <причина>. Заменяется: FR-NEW-1.

## Impact

<!-- AI: impact-анализ по rules/linking.md: связанные ID и документы (UI, API,
technical, Traceability), которые потребуют обновления при apply. -->

## Open Questions

<!-- AI: открытые вопросы уровня изменения: TBD и ASSUMPTION с
«Requires confirmation.». Нет — «None». -->

## Assigned IDs

<!-- AI: заполняется при apply: соответствие placeholder → реальный ID.
До apply: «Not applicable: заполняется при apply». Дельты выше при этом
не переписываются — история изменения остаётся как была предложена. -->

Not applicable: заполняется при apply.
