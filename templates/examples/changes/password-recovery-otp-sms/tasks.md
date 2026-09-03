---
title: Доставка OTP по SMS — задачи
type: change
status: draft
version: 0.1
owners:
  - product
related:
  - proposal.md
---

# Доставка OTP по SMS — задачи

<!-- Пример заполненного плана применения (reference implementation).
Выполняется skill'ом change-management после того, как человек выставил
approved в proposal.md. -->

## Apply Plan

- [ ] `.gigacode/skills/requirements` — [requirements.md](../../password-recovery/requirements.md): применить ADDED (FR-NEW-1), MODIFIED (FR-002); обновить Traceability.
- [ ] `.gigacode/skills/ui-requirements` — [ui.md](../../password-recovery/ui.md): выбор канала доставки в UI-001 (см. Impact).
- [ ] `.gigacode/skills/api-requirements` — [api.md](../../password-recovery/api.md): параметр канала в API-001 (см. Impact).
- [ ] `.gigacode/skills/technical-documentation` — [technical.md](../../password-recovery/technical.md): интеграция с SMS-провайдером; кандидат в ADR.

## Verification

- [ ] `node scripts/validate-docs.mjs` — exit 0.
- [ ] `.gigacode/skills/documentation-review` по feature password-recovery; отчёт передан целиком.
- [ ] Placeholder FR-NEW-1 заменён реальным ID; секция Assigned IDs в proposal.md заполнена.
- [ ] Затронутые документы: version MAJOR bump, статус `approved` → `review`.
- [ ] Proposal архивирован в `docs/changes/archive/YYYY-MM-password-recovery-otp-sms/`.
