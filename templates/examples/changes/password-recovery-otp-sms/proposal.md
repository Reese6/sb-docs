---
title: Доставка OTP по SMS
type: change
status: draft
version: 0.1
owners:
  - product
related:
  - ../../password-recovery/requirements.md
---

# Доставка OTP по SMS

<!-- Пример заполненного change proposal (reference implementation).
Иллюстративен: предполагает, что requirements.md feature password-recovery
находится в статусе approved. Реальные proposals живут в docs/changes/. -->

## Status

proposed

## Why

Продуктовая постановка расширена: пользователи без доступа к почте не могут завершить восстановление пароля. Продуктовая команда запросила SMS как альтернативный канал доставки OTP. Источник: указание человека (product owner), 2026-08.

## What Changes

- Пользователь выбирает канал доставки OTP: email или SMS.
- Требование об отправке OTP перестаёт быть привязанным только к email.
- UI, API и техническое решение потребуют обновления под выбор канала (см. Impact).

## Affected Documents

| Документ | Статус / версия | Операции |
|----------|-----------------|----------|
| [requirements.md](../../password-recovery/requirements.md) | approved / 1.0 | ADDED, MODIFIED |

## Deltas

### [requirements.md](../../password-recovery/requirements.md)

#### ADDED

- FR-NEW-1: Пользователь может выбрать канал доставки OTP — email или SMS — при запросе восстановления пароля. Trace: указание product owner. TBD: источник номера телефона (профиль учётной записи или ввод при запросе).

#### MODIFIED

- FR-002:
  - Было: Система должна отправить OTP на указанный email, если учётная запись с таким email существует.
  - Станет: Система должна отправить OTP по выбранному каналу доставки (FR-NEW-1), если учётная запись с указанным email существует.
  - Причина: доставка OTP больше не ограничена email.

## Impact

- [ui.md](../../password-recovery/ui.md): UI-001 (форма запроса восстановления) — добавить выбор канала.
- [api.md](../../password-recovery/api.md): API-001 (создание сессии восстановления) — параметр канала доставки.
- [technical.md](../../password-recovery/technical.md): интеграция с SMS-провайдером. TBD: выбор провайдера — кандидат в ADR.
- Traceability в requirements.md: строки FR-002 и нового требования.
- BR-004 (нераскрытие существования учётной записи) распространяется на SMS-канал — проверить формулировки при apply.

## Open Questions

- TBD: источник номера телефона для SMS-канала.
- ASSUMPTION: интервал повторной отправки (BR-002) един для обоих каналов.
  Requires confirmation.

## Assigned IDs

Not applicable: заполняется при apply.
