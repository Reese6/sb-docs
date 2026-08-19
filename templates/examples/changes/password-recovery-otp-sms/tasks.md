---
title: Password recovery — OTP via SMS — tasks
type: change
status: draft
version: 0.1
owners:
  - product
related:
  - proposal.md
---

# Доставка OTP по SMS — tasks

<!-- Пример заполненного плана применения (reference implementation).
Выполняется skill'ом change-management после того, как человек выставил
approved в proposal.md. -->

## Apply Plan

- [ ] `skills/requirements` — [requirements.md](../../password-recovery/requirements.md): применить ADDED (FR-NEW-1), MODIFIED (FR-002); обновить Traceability.
- [ ] `skills/ui-requirements` — [ui.md](../../password-recovery/ui.md): выбор канала доставки в UI-001 (см. Impact).
- [ ] `skills/api-requirements` — [api.md](../../password-recovery/api.md): параметр канала в API-001 (см. Impact).
- [ ] `skills/technical-documentation` — [technical.md](../../password-recovery/technical.md): интеграция с SMS-провайдером; кандидат в ADR.

## Verification

- [ ] `node scripts/validate-docs.mjs` — exit 0.
- [ ] `skills/documentation-review` по feature password-recovery; отчёт передан целиком.
- [ ] Placeholder FR-NEW-1 заменён реальным ID; секция Assigned IDs в proposal.md заполнена.
- [ ] Затронутые документы: version MAJOR bump, статус `approved` → `review`.
- [ ] Proposal архивирован в `docs/changes/archive/YYYY-MM-password-recovery-otp-sms/`.
