---
title: <Change title> — tasks
type: change
status: draft
version: 0.1
owners:
  - product
related:
  - proposal.md
---

# <Название изменения> — tasks

<!-- AI: план применения утверждённого proposal.md. Файл опционален до apply;
статус в frontmatter повторяет статус proposal.md. Выполняется skill'ом
change-management строго после того, как человек выставил approved. -->

## Apply Plan

<!-- AI: упорядоченный чеклист применения: для каждой стадии — пишущий skill,
целевой файл и применяемые дельты. Порядок — по pipeline:
requirements → ui/api → technical. Правки выполняют пишущие skills по своим
SKILL.md; они же присваивают реальные ID вместо placeholders. -->

- [ ] `skills/requirements` — <целевой requirements.md>: применить ADDED (FR-NEW-1), MODIFIED (FR-XXX).
- [ ] `skills/ui-requirements` — <целевой ui.md>: обновить связанные UI-XXX (Impact).

## Verification

<!-- AI: проверки после применения всех дельт. -->

- [ ] `node scripts/validate-docs.mjs` — exit 0.
- [ ] `skills/documentation-review` по затронутым feature; отчёт передан целиком.
- [ ] Placeholders заменены реальными ID; секция Assigned IDs в proposal.md заполнена.
- [ ] Затронутые документы: version MAJOR bump, статус `approved` → `review`.
- [ ] Proposal архивирован в `docs/changes/archive/YYYY-MM-<change-name>/`.
