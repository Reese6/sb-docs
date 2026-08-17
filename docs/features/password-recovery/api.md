---
title: Password recovery — API
type: api
status: draft
feature: password-recovery
version: 0.1
owners:
  - backend
related:
  - product.md
  - requirements.md
---

# Password recovery — API

## Purpose

Контракт API восстановления пароля: запрос OTP, подтверждение кода, установка нового пароля.

## Related requirements

FR-001, FR-002, FR-003, FR-004, FR-005, BR-001, BR-002, BR-003, BR-004 — см. [requirements.md](requirements.md).

## Endpoint

### POST /auth/password-recovery

- API-001 (→ FR-001, FR-002, BR-001): создаёт сессию восстановления для учётной записи с указанным email и инициирует отправку OTP. При уже активной сессии новая не создаётся (BR-001).
- API-004 (→ FR-005, BR-002): повторный вызов при активной сессии выполняет повторную отправку OTP, если интервал повторной отправки истёк; иначе возвращается ошибка с указанием времени до следующей попытки.
- API-005 (→ BR-004): ответ одинаков для существующего и несуществующего email; факт существования учётной записи не раскрывается ни статусом, ни телом, ни временем ответа.

### POST /auth/password-recovery/confirm

- API-002 (→ FR-003, BR-003): проверяет OTP для активной сессии восстановления. Неверные вводы учитываются; при превышении допустимого числа сессия завершается (BR-003). При успехе возвращает одноразовый `reset_token`.

### POST /auth/password-recovery/reset

- API-003 (→ FR-004): устанавливает новый пароль по действующему `reset_token` и завершает сессию восстановления.

## Authentication

Не требуется: все endpoints доступны анонимно (пользователь не может войти). Общая схема аутентификации — [../../api/authentication.md](../../api/authentication.md).

## Authorization

Not applicable: endpoints анонимные, ролевых ограничений нет.

## Request

### POST /auth/password-recovery

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| email | string | да | Email учётной записи |

### POST /auth/password-recovery/confirm

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| email | string | да | Email из запроса восстановления |
| otp | string | да | Введённый пользователем OTP |

### POST /auth/password-recovery/reset

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| reset_token | string | да | Токен из ответа confirm |
| new_password | string | да | Новый пароль |

## Validation

- `email`: непустой, формат email.
- `otp`: непустой. TBD: длина и алфавит OTP (см. requirements.md).
- `new_password`: соответствие политике паролей. TBD: политика паролей (см. requirements.md).

Клиентская валидация — [ui.md](ui.md); расхождений нет.

## Response

- `POST /auth/password-recovery` — 202, тело пустое (API-005: одинаково для любого email).
- `POST /auth/password-recovery/confirm` — 200, тело: `reset_token` (string, одноразовый).
- `POST /auth/password-recovery/reset` — 204, тело пустое.

## Errors

Формат ошибок — [../../api/errors.md](../../api/errors.md) (формат ещё не определён). Коды ошибок: TBD, ниже — условия возникновения.

- confirm: неверный OTP; просроченный OTP; активная сессия восстановления отсутствует; превышено число попыток (сессия завершена, BR-003).
- password-recovery (повторный вызов): интервал повторной отправки не истёк (BR-002).
- reset: недействительный или уже использованный `reset_token`; пароль не соответствует политике.

## Pagination

Not applicable: списочных endpoints нет.

## Filtering

Not applicable: списочных endpoints нет.

## Sorting

Not applicable: списочных endpoints нет.

## Idempotency

Повторный вызов `POST /auth/password-recovery` при активной сессии не создаёт новую сессию (BR-001) — семантика повторной отправки описана в API-004. `reset_token` одноразовый: повторный вызов reset с тем же токеном отклоняется.

## Rate limits

TBD: лимиты частоты вызовов не подтверждены. Интервал повторной отправки OTP — BR-002.

## Security

- API-005 (→ BR-004): защита от перечисления пользователей.
- Защита от перебора OTP — ограничение попыток (BR-003).
- Открытое значение OTP не логируется (NFR-002, см. [requirements.md](requirements.md)).

## Side effects

- `POST /auth/password-recovery`: создание сессии восстановления, отправка email с OTP.
- `POST /auth/password-recovery/reset`: смена пароля учётной записи, завершение сессии восстановления.

## Events

TBD: публикуемые события не определены.

## Examples

Запрос восстановления:

```json
{
  "email": "user@example.com"
}
```

Подтверждение кода:

```json
{
  "email": "user@example.com",
  "otp": "483920"
}
```

Ответ confirm:

```json
{
  "reset_token": "test-reset-token-001"
}
```

Установка нового пароля:

```json
{
  "reset_token": "test-reset-token-001",
  "new_password": "test-NewPassword-1"
}
```

## Traceability

| API ID | Требование | Endpoint |
|--------|------------|----------|
| API-001 | FR-001, FR-002, BR-001 | POST /auth/password-recovery |
| API-002 | FR-003, BR-003 | POST /auth/password-recovery/confirm |
| API-003 | FR-004 | POST /auth/password-recovery/reset |
| API-004 | FR-005, BR-002 | POST /auth/password-recovery |
| API-005 | BR-004 | POST /auth/password-recovery |
