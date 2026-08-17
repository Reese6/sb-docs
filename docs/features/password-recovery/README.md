---
title: Password recovery
type: feature-readme
status: draft
feature: password-recovery
version: 0.2
owners:
  - product
---

# Password recovery

Восстановление пароля по email с одноразовым кодом (OTP): пользователь запрашивает код, подтверждает владение учётной записью и задаёт новый пароль. Демонстрационная feature — reference implementation структуры документации.

## Documents

| Документ | Статус | Назначение |
|----------|--------|------------|
| [product.md](product.md) | draft | WHAT + WHY |
| [requirements.md](requirements.md) | draft | FR / BR / NFR |
| [ui.md](ui.md) | draft | Поведение интерфейса |
| [api.md](api.md) | draft | Контракт API |
| [technical.md](technical.md) | draft | Техническое решение |
| [decisions/adr-001-otp-vs-recovery-link.md](decisions/adr-001-otp-vs-recovery-link.md) | draft | ADR: OTP вместо ссылки восстановления |

## Related global context

- Термины **OTP** и **Сессия восстановления пароля** — [../../product/glossary.md](../../product/glossary.md).
- Глобальные business rules и NFR ещё не определены ([../../product/business-rules.md](../../product/business-rules.md), [../../product/non-functional-requirements.md](../../product/non-functional-requirements.md)) — все BR/NFR определены локально в [requirements.md](requirements.md).
- API-соглашения (аутентификация, формат ошибок) — [../../api/](../../api/).

## Status summary

Все документы в статусе draft; статус решения ADR-001 (секция Status) — proposed. Ключевые открытые вопросы: срок жизни OTP (BR-005, ASSUMPTION), интервал повторной отправки (TBD), политика паролей (TBD) — полный список в Open Questions документов [requirements.md](requirements.md) и [technical.md](technical.md).
