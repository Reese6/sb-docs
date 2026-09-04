---
title: <Название фичи> — API
type: api
status: draft
feature: <feature-name>
version: 0.1
owners:
  - backend
related:
  - ../product.md
  - ../requirements.md
---

# <Название фичи> — API

<!-- AI: индекс контракта API feature — docs/features/<feature-name>/api/README.md.
Здесь только сводка: назначение, связанные требования, таблица методов и
Traceability. Содержание метода — в отдельном файле api/<method>-<имя>.md
из templates/api-method.md; сюда его не копировать.
Файл создаётся первым, до первого файла метода.
Глобальные соглашения НЕ копировать, только ссылаться:
аутентификация — docs/api/authentication.md;
пагинация, фильтрация, сортировка, идемпотентность, лимиты частоты вызовов,
безопасность, форматы данных — docs/api/conventions.md;
формат ошибок и общие коды — docs/api/errors.md;
побочные эффекты, публикуемые события, кэширование — technical.md feature. -->

## Purpose

<!-- AI: 1–2 предложения: какую часть требований покрывает API feature. -->

## Related requirements

<!-- AI: FR/BR/NFR, которые реализует API. Только ID со ссылкой на ../requirements.md —
без копий формулировок. -->

## Методы

<!-- AI: таблица всех методов feature, строка на файл:
| Метод | Файл | API ID | Назначение |
| POST /v1/otp/request | [post-otp-request.md](post-otp-request.md) | API-001 | Запрос кода |
Порядок строк — порядок появления методов. Метод помечен deprecated — строка
остаётся, в «Назначение» добавляется «deprecated».
Ни одного метода ещё не описано — «TBD: методы не описаны».
Строка без существующего файла даёт битую ссылку: строку добавлять вместе с файлом. -->

## Traceability

<!-- AI: таблица связей:
| API ID | Требование | Метод | Файл |
Строка на каждый API-XXX всех файлов api/, включая deprecated; минимум одна связь
с FR/BR/NFR. Затем обновить колонку «Покрыто» в Traceability ../requirements.md. -->
