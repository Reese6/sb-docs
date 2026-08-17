# Features

Документация по фичам продукта. Одна директория = одна feature.

## Структура feature

```text
docs/features/<feature-name>/
├── README.md         # обзор feature, состав и статусы документов
├── product.md        # WHAT + WHY: проблема, цель, сценарии, scope
├── requirements.md   # FR / BR / NFR, acceptance criteria
├── ui.md             # поведение интерфейса (UI-XXX)
├── api.md            # контракт API (API-XXX)
├── technical.md      # HOW: техническое решение
└── decisions/        # ADR уровня feature
```

Имя директории — kebab-case: `password-recovery`, `sms-notifications`.

Шаблоны всех файлов — в `../../templates/`.

## Не каждый файл обязателен

Создаются только нужные документы:

- backend-only feature может не иметь `ui.md`;
- feature без внешнего API может не иметь `api.md`;
- `decisions/` создаётся при первом ADR.

Минимум для любой feature: `README.md`, `product.md`, `requirements.md`.

## Ключевое правило: не копировать глобальный контекст

**Глобальные правила продукта не копируются в feature.** Feature ссылается на глобальный контекст:

- термины — [../product/glossary.md](../product/glossary.md);
- пользователи — [../product/personas.md](../product/personas.md);
- глобальные бизнес-правила — [../product/business-rules.md](../product/business-rules.md) (по `BR-XXX`);
- глобальные NFR — [../product/non-functional-requirements.md](../product/non-functional-requirements.md) (по `NFR-XXX`);
- API-соглашения (аутентификация, ошибки, пагинация) — [../api/](../api/);
- архитектурный контекст — [../architecture/](../architecture/).

Дублирование формулировки правила в feature — ошибка, которую находит documentation review. Правильно: «Применяется BR-003 (см. глобальные business rules)».

## Порядок создания документов

```text
product.md → requirements.md → ui.md / api.md → technical.md → decisions/ (при необходимости) → review
```

Каждый следующий документ ссылается на ID предыдущих (traceability): `UI-004 → FR-012`, `API-007 → FR-012`.

## Список features

- [password-recovery](password-recovery/README.md) — восстановление пароля по email с одноразовым кодом (OTP); демонстрационная feature (reference implementation).
