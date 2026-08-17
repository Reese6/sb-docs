---
title: API authentication
type: api
status: draft
version: 0.1
owners:
  - backend
---

# API authentication

Глобальная схема аутентификации и авторизации API. Feature `api.md` не описывает механизм auth заново — ссылается сюда и указывает только требуемые права для конкретного endpoint.

## Аутентификация

TBD: механизм аутентификации (например, OAuth 2.0 / JWT / mTLS), формат токена, время жизни, обновление.

## Авторизация

TBD: модель прав (roles/scopes/permissions) и способ их проверки.

## Ошибки аутентификации

TBD: коды и формат ответов 401/403 (согласовать с [errors.md](errors.md)).
