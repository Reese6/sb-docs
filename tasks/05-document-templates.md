# 05. Шаблоны документов

> Источник: INIT.md, ЭТАП 5. Приоритет: P0.
> Зависит от: 04.

## Цель

Создать содержательные Markdown-шаблоны в `templates/`. Не пустые заголовки: для каждого раздела — короткие комментарии-инструкции, объясняющие AI, какую информацию сюда помещать.

## Файлы

- `templates/feature.md` (README feature)
- `templates/product.md`
- `templates/requirements.md`
- `templates/ui.md`
- `templates/api.md`
- `templates/technical.md`
- `templates/adr.md`

## Минимальные структуры

### product.md — WHAT + WHY, без деталей реализации

```text
Problem
Goal
Users
User scenarios
Expected behaviour
Business value
Success criteria
Scope
Out of scope
Dependencies
Constraints
Open questions
```

### requirements.md

```text
Context
Functional Requirements
Business Rules
Non-functional Requirements
Constraints
Acceptance Criteria
Dependencies
Open Questions
Traceability
```

### ui.md — поведение интерфейса, а не только внешний вид

```text
Purpose
Related requirements
Entry points
Screens
Components
Component states
Actions
Validation
Loading states
Empty states
Error states
Navigation
Responsive behaviour
Accessibility
Analytics events
Traceability
```

### api.md — не все секции обязательны для каждого endpoint

```text
Purpose
Related requirements
Endpoint
Authentication
Authorization
Request
Validation
Response
Errors
Pagination
Filtering
Sorting
Idempotency
Rate limits
Security
Side effects
Events
Examples
Traceability
```

### technical.md — отвечает на HOW

```text
Context
Related requirements
Current implementation
Proposed solution
Components
Data flow
Services involved
Data model changes
API changes
Events
Caching
Transactions
Error handling
Security
Observability
Performance
Backward compatibility
Migration
Deployment
Testing considerations
Alternatives
Risks
Open questions
```

### adr.md — стандартная структура ADR

```text
Title
Status
Context
Decision
Alternatives
Consequences
Related requirements
Related ADR
```

## Требования

- Каждый шаблон включает YAML frontmatter из задачи 04.
- В каждом разделе — комментарий-инструкция для AI (что писать, чего не писать).
- Соблюдать разделение уровней: product = WHAT+WHY, technical = HOW.

## Критерии готовности

- 7 шаблонов созданы, все секции из минимальных структур присутствуют.
- Нет пустых шаблонов из одних заголовков — везде есть инструкции.
- Frontmatter согласован со схемами из `schemas/`.
