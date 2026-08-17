Ты работаешь как senior product analyst, solution architect и AI documentation engineer.

Необходимо с нуля создать репозиторий для ведения продуктовой, функциональной, UI, API и технической документации команды разработки в формате Markdown.

Документация в дальнейшем будет создаваться и поддерживаться преимущественно AI-агентами через Claude Code, Codex CLI и совместимые Agent Skills.

Главная цель проекта — не просто хранить Markdown-файлы, а создать формализованную систему ведения требований:

**Product Context → Product Documentation → Requirements → UI/API → Technical Specification → Review**

Документация должна одновременно:

* хорошо читаться людьми;
* быть удобной для AI;
* храниться в Git;
* иметь предсказуемую структуру;
* обеспечивать traceability между требованиями;
* минимизировать дублирование;
* запрещать AI придумывать неизвестные требования;
* масштабироваться на большую команду и большое количество сервисов.

---

# 1. Общие правила работы

Работай поэтапно.

Не пытайся создать весь проект одной большой генерацией.

Для каждого этапа:

1. Сначала проанализируй текущее состояние репозитория.
2. Определи, какие файлы необходимо создать или изменить.
3. Выполни изменения.
4. Проверь созданную структуру и содержимое.
5. Исправь найденные проблемы.
6. Кратко зафиксируй результат этапа.
7. Только после завершения текущего этапа переходи к следующему.

Если проект уже содержит файлы:

* не удаляй существующие файлы без необходимости;
* не перезаписывай пользовательские данные;
* адаптируй структуру проекта к существующему состоянию;
* сначала изучи существующую документацию.

Не задавай вопросы по мелким архитектурным решениям. Принимай разумные решения самостоятельно и документируй их.

Если информации недостаточно для продуктового требования:

* не придумывай факт;
* используй `TBD`;
* либо явно помечай `ASSUMPTION`;
* assumption не должен автоматически становиться утверждённым требованием.

Все документы должны быть в Markdown, если для конкретной технической задачи нет объективной причины использовать YAML/JSON.

---

# 2. Целевая структура проекта

В результате должна получиться примерно следующая структура:

```text
product-docs/
├── README.md
├── AGENTS.md
├── CONTRIBUTING.md
├── .gitignore
│
├── docs/
│   ├── product/
│   │   ├── overview.md
│   │   ├── vision.md
│   │   ├── glossary.md
│   │   ├── personas.md
│   │   ├── business-rules.md
│   │   └── non-functional-requirements.md
│   │
│   ├── features/
│   │   └── README.md
│   │
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── system-context.md
│   │   ├── components.md
│   │   ├── integrations.md
│   │   ├── data-model.md
│   │   └── adr/
│   │       └── README.md
│   │
│   └── api/
│       ├── overview.md
│       ├── authentication.md
│       ├── conventions.md
│       ├── errors.md
│       └── services/
│
├── templates/
│   ├── feature.md
│   ├── product.md
│   ├── requirements.md
│   ├── ui.md
│   ├── api.md
│   ├── technical.md
│   └── adr.md
│
├── skills/
│   ├── documentation-orchestrator/
│   │   └── SKILL.md
│   ├── product-documentation/
│   │   └── SKILL.md
│   ├── requirements/
│   │   └── SKILL.md
│   ├── ui-requirements/
│   │   └── SKILL.md
│   ├── api-requirements/
│   │   └── SKILL.md
│   ├── technical-documentation/
│   │   └── SKILL.md
│   ├── architecture-decisions/
│   │   └── SKILL.md
│   └── documentation-review/
│       └── SKILL.md
│
├── rules/
│   ├── writing.md
│   ├── requirements.md
│   ├── terminology.md
│   ├── markdown.md
│   ├── linking.md
│   └── ai-guardrails.md
│
├── schemas/
│   ├── requirement.schema.yaml
│   ├── feature.schema.yaml
│   └── metadata.schema.yaml
│
└── services/
    └── README.md
```

Это ориентир, а не догма. Если в процессе реализации найдёшь более логичное разбиение — можешь улучшить структуру, но объясни решение.

---

# ЭТАП 0. Анализ и планирование

Перед созданием файлов:

1. Изучи текущую директорию.
2. Найди:

   * существующий `README.md`;
   * `AGENTS.md`;
   * `.claude/`;
   * существующие skills;
   * существующие docs;
   * Git-конфигурацию.
3. Определи, является ли директория пустым проектом или существующим репозиторием.
4. Составь внутренний план изменений.
5. Проверь, нет ли конфликтов с существующими файлами.

На этом этапе ничего существенного не удаляй.

---

# ЭТАП 1. Инициализация проекта

Создай базовый каркас проекта.

Необходимо:

* инициализировать Git, если репозиторий ещё не инициализирован;
* создать `.gitignore`;
* создать основные директории;
* создать главный `README.md`;
* создать `CONTRIBUTING.md`;
* создать `AGENTS.md`.

В `README.md` объясни:

* назначение проекта;
* архитектуру документации;
* жизненный цикл документации;
* какие типы документов существуют;
* где находится source of truth;
* как добавить новую feature;
* как AI должен работать с документацией;
* что находится в `services/`.

`services/` используется для локального подключения репозиториев сервисов, исходный код которых AI может анализировать.

Содержимое подключённых сервисов не должно попадать в данный Git-репозиторий.

Настрой `.gitignore` соответствующим образом.

---

# ЭТАП 2. Информационная архитектура документации

Создай базовую структуру `docs/`.

Раздели документацию минимум на:

* глобальный product context;
* features;
* architecture;
* API.

Определи правило:

**Глобальные правила продукта не должны копироваться в каждую feature.**

Feature должна ссылаться на глобальный контекст.

Для каждой feature предполагается структура:

```text
docs/features/<feature-name>/
├── README.md
├── product.md
├── requirements.md
├── ui.md
├── api.md
├── technical.md
└── decisions/
```

Не каждый файл обязан существовать для каждой feature.

Например backend-only feature может не иметь `ui.md`.

---

# ЭТАП 3. Стандарт метаданных и идентификаторов

Разработай единый стандарт идентификаторов.

Минимум:

```text
FR-XXX   Functional Requirement
BR-XXX   Business Rule
NFR-XXX  Non-functional Requirement
UI-XXX   UI Requirement
API-XXX  API Requirement
ADR-XXX  Architecture Decision
```

Определи:

* формат;
* правила создания;
* правила удаления;
* правила изменения;
* запрет на переиспользование удалённых ID;
* правила cross-reference.

Пример:

```text
UI-004 → FR-012
API-007 → FR-012
ADR-003 → NFR-002
```

Разработай YAML frontmatter для документов.

Пример:

```yaml
---
title: Password recovery
type: requirements
status: draft
feature: password-recovery
version: 1.0
owners:
  - product
related:
  - product.md
  - ui.md
  - api.md
  - technical.md
---
```

Предусмотри статусы:

```text
draft
review
approved
deprecated
```

Создай соответствующие schemas в `schemas/`.

Схемы должны быть достаточно простыми, чтобы AI мог стабильно их соблюдать.

---

# ЭТАП 4. Глобальные правила AI

Создай каталог `rules/`.

Особое внимание удели `ai-guardrails.md`.

Зафиксируй принцип:

```text
FACT
ASSUMPTION
TBD
```

AI запрещено превращать предположение в факт.

Если информация неизвестна:

```text
TBD: время жизни OTP-кода.
```

или:

```text
ASSUMPTION: срок жизни OTP составляет 5 минут.
Requires confirmation.
```

Также введи правила:

* не придумывать требования;
* не придумывать API;
* не придумывать бизнес-правила;
* не придумывать ограничения;
* не дублировать одно требование между несколькими файлами;
* использовать cross-reference;
* сохранять существующие requirement IDs;
* перед изменением документа анализировать связанные документы;
* при изменении требования искать связанные UI/API/technical требования;
* использовать единый glossary;
* избегать AI-стиля и чрезмерно абстрактных формулировок;
* писать документацию простым профессиональным языком;
* разделять WHAT/WHY и HOW.

Создай также:

```text
rules/writing.md
rules/requirements.md
rules/terminology.md
rules/markdown.md
rules/linking.md
```

---

# ЭТАП 5. Шаблоны документов

Создай содержательные Markdown templates.

Не делай пустые шаблоны только из заголовков. Для каждого раздела добавь короткие комментарии-инструкции, объясняющие AI, какую информацию сюда помещать.

## `product.md`

Минимальная структура:

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

Product documentation должна описывать преимущественно:

**WHAT + WHY**

и не содержать лишних деталей реализации.

---

## `requirements.md`

Минимум:

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

---

## `ui.md`

Минимум:

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

UI specification должна описывать поведение интерфейса, а не только внешний вид.

---

## `api.md`

Минимум:

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

Не все секции обязательны для каждого endpoint.

---

## `technical.md`

Минимум:

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

Technical documentation отвечает преимущественно на:

**HOW**

---

## `adr.md`

Используй стандартную структуру ADR:

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

---

# ЭТАП 6. Skill `product-documentation`

Создай:

```text
skills/product-documentation/SKILL.md
```

Это специализированный skill для создания и изменения человекочитаемой продуктовой документации.

Возьми за концептуальный ориентир подходы из skills:

* `prd-development`
* `breakdown-feature-prd`

Но не создавай runtime dependency на эти skills.

Наш repository должен иметь собственный стандарт.

Skill должен:

1. Сначала читать:

   * `docs/product/`;
   * glossary;
   * существующую feature;
   * связанные требования.
2. Определять проблему.
3. Определять пользователей.
4. Описывать сценарии.
5. Определять scope/out-of-scope.
6. Не добавлять техническую реализацию без необходимости.
7. Не придумывать неизвестные продуктовые решения.
8. Создавать `product.md` согласно template.
9. Проверять результат перед завершением.

---

# ЭТАП 7. Skill `requirements`

Создай:

```text
skills/requirements/SKILL.md
```

Это один из наиболее важных skills.

Он должен преобразовывать продуктовую постановку в формальные требования.

Используй как концептуальный reference:

* `user-story`;
* хорошие практики Gherkin;
* requirement engineering.

Skill должен различать:

```text
Functional Requirement
Business Rule
Non-functional Requirement
Constraint
Acceptance Criterion
```

Требования должны быть:

* атомарными;
* однозначными;
* проверяемыми;
* иметь стабильный ID;
* не содержать несколько независимых требований в одном пункте.

Избегать слов:

```text
удобно
быстро
интуитивно
корректно
нормально
оптимально
```

если они не имеют измеримого определения.

Acceptance Criteria должны быть пригодны для последующего использования тестировщиком.

---

# ЭТАП 8. Skill `ui-requirements`

Создай:

```text
skills/ui-requirements/SKILL.md
```

Приоритет skill — описание поведения интерфейса.

Он должен работать от:

```text
product.md
requirements.md
```

и создавать:

```text
ui.md
```

Каждое существенное UI-требование должно иметь ID:

```text
UI-XXX
```

и по возможности ссылку на:

```text
FR-XXX
BR-XXX
NFR-XXX
```

Обязательно описывать состояния компонентов:

```text
default
hover
focus
active
disabled
loading
success
error
empty
```

только когда они применимы.

Учитывать:

* validation;
* responsive;
* accessibility;
* navigation;
* edge cases;
* error states;
* empty states;
* loading.

Не придумывать дизайн-систему, если она отсутствует.

---

# ЭТАП 9. Skill `api-requirements`

Создай:

```text
skills/api-requirements/SKILL.md
```

Используй как conceptual reference:

* `documentation`;
* `api-documentation-generator`.

Skill отвечает за человекочитаемую API specification.

Он не должен автоматически превращать документ в OpenAPI, если это не требуется.

Он должен описывать:

* назначение endpoint;
* request;
* response;
* validation;
* authentication;
* authorization;
* errors;
* idempotency;
* concurrency;
* pagination;
* filtering;
* sorting;
* rate limiting;
* security;
* side effects;
* events.

Каждое существенное API требование получает:

```text
API-XXX
```

API должен иметь traceability к продуктовым требованиям.

---

# ЭТАП 10. Skill `technical-documentation`

Создай:

```text
skills/technical-documentation/SKILL.md
```

Это skill для разработчиков.

Перед созданием технической спецификации он должен:

1. Прочитать product documentation.
2. Прочитать requirements.
3. Прочитать UI/API specification.
4. Проверить `services/`.
5. Если исходный код доступен — изучить соответствующие сервисы.
6. Найти существующие архитектурные решения.
7. Только после этого описывать техническое решение.

Очень важный принцип:

```text
requirements = source of truth для требуемого поведения

services source code = source of truth для текущей реализации
```

Не путать эти два понятия.

Если код противоречит утверждённому требованию, это должно быть явно отмечено.

---

# ЭТАП 11. Skill `architecture-decisions`

Создай:

```text
skills/architecture-decisions/SKILL.md
```

Используй `architecture-decision-records` как концептуальный reference.

Skill должен определять, когда решение заслуживает ADR.

ADR нужен, если решение:

* существенно влияет на архитектуру;
* сложно изменить;
* имеет несколько разумных альтернатив;
* создаёт важные ограничения;
* важно понимать будущим разработчикам.

Не создавать ADR на каждую мелочь.

Поддерживать статусы:

```text
proposed
accepted
deprecated
superseded
rejected
```

Если ADR заменяет другой ADR, должна существовать двусторонняя ссылка.

---

# ЭТАП 12. Skill `documentation-review`

Создай:

```text
skills/documentation-review/SKILL.md
```

Это критически важный skill.

Его задача — не писать новую документацию, а проверять существующую.

Проверять минимум:

### Structure

* правильное расположение файлов;
* наличие metadata;
* соответствие templates.

### Requirements quality

* atomic;
* unambiguous;
* testable;
* no duplicates.

### Traceability

Например:

```text
FR-004
├── UI-007
├── API-003
└── technical.md
```

Находить:

```text
ERROR: FR-007 не покрыт ни UI, ни API.

WARNING: API-004 не связан ни с одним FR.

ERROR: UI-002 ссылается на отсутствующий FR-012.
```

### Contradictions

Искать противоречия между:

```text
product
requirements
ui
api
technical
```

### Hallucination protection

Проверять:

* неподтверждённые значения;
* внезапно появившиеся business rules;
* необоснованные технические ограничения.

### Terminology

Проверять соответствие glossary.

### TBD / assumptions

В конце review формировать отдельный список:

```text
Unresolved TBD
Unconfirmed assumptions
Broken references
Coverage gaps
```

---

# ЭТАП 13. Skill `documentation-orchestrator`

Этот skill создавай ПОСЛЕДНИМ среди основных skills.

Путь:

```text
skills/documentation-orchestrator/SKILL.md
```

Он не должен самостоятельно писать всю документацию.

Его основная задача:

1. Понять намерение пользователя.
2. Определить затрагиваемую feature.
3. Определить необходимые типы документации.
4. Определить существующие документы.
5. Определить зависимости.
6. Выбрать последовательность специализированных skills.
7. После изменений запустить documentation review.

Базовый pipeline:

```text
User request
    ↓
Read product context
    ↓
Identify feature
    ↓
Product documentation
    ↓
Requirements
    ↓
┌───────────────┐
│               │
UI             API
│               │
└───────┬───────┘
        ↓
Technical documentation
        ↓
ADR if required
        ↓
Documentation review
```

Pipeline не должен запускать ненужные stages.

Например изменение текста кнопки не должно автоматически создавать ADR и technical specification.

---

# ЭТАП 14. AGENTS.md

После разработки всех skills вернись к `AGENTS.md` и доработай его.

Это должен быть основной entry point для AI-агента.

AI при входе в repository должен понять:

1. Что это за repository.
2. Где находится product context.
3. Где находятся features.
4. Как определить нужный skill.
5. Какие документы необходимо читать перед изменением.
6. Где находятся templates.
7. Где находятся rules.
8. Как обрабатывать `TBD`.
9. Как работать с `ASSUMPTION`.
10. Как обращаться с requirement IDs.
11. Когда анализировать `services/`.
12. Когда запускать documentation review.

Добавь routing table примерно такого смысла:

```text
Создать/изменить описание функции
→ product-documentation

Формализовать требования
→ requirements

Описать интерфейс
→ ui-requirements

Описать API
→ api-requirements

Описать реализацию
→ technical-documentation

Зафиксировать архитектурное решение
→ architecture-decisions

Проверить документацию
→ documentation-review

Комплексная новая feature
→ documentation-orchestrator
```

---

# ЭТАП 15. Пример feature

Создай демонстрационную feature, чтобы проверить всю систему.

Используй нейтральный пример:

```text
docs/features/password-recovery/
```

Создай:

```text
README.md
product.md
requirements.md
ui.md
api.md
technical.md
decisions/
```

Пример должен демонстрировать:

* FR;
* BR;
* NFR;
* UI;
* API;
* cross-references;
* assumptions;
* TBD;
* traceability.

Не переусложняй пример.

Он нужен именно как reference implementation структуры документации.

---

# ЭТАП 16. Интеграция внешних skills

Не делай проект жёстко зависимым от сторонних skills.

Но добавь в документацию раздел с рекомендуемыми external references.

Исходные ориентиры:

```text
prd-development
user-story
documentation
api-documentation-generator
architecture-decision-records
```

Если в окружении доступен `npx skills`, можешь дополнительно добавить отдельный документ:

```text
docs/ai/external-skills.md
```

с командами их установки.

Но собственные `SKILL.md` данного проекта остаются source of truth.

---

# ЭТАП 17. Автоматические проверки

Создай простые локальные проверки документации.

Не нужно строить тяжёлую платформу.

Минимум желательно проверять:

* broken relative Markdown links;
* duplicate requirement IDs;
* malformed IDs;
* отсутствующий YAML frontmatter там, где он обязателен;
* неизвестные document types;
* ссылки на несуществующие FR/UI/API/ADR ID;
* базовую Markdown-структуру.

Если для этого нужен небольшой скрипт, создай:

```text
scripts/
```

Например:

```text
scripts/validate-docs.*
```

Выбери минимальный и переносимый стек.

Не добавляй тяжёлые dependencies без необходимости.

Добавь команду запуска проверки в `README.md`.

---

# ЭТАП 18. Финальная проверка

После завершения всего проекта:

1. Выведи дерево директорий.
2. Проверь каждый `SKILL.md`.
3. Проверь, что между skills нет противоречий.
4. Проверь `AGENTS.md`.
5. Проверь templates.
6. Запусти локальную validation.
7. Проверь demonstration feature.
8. Проверь cross-reference.
9. Найди дублирование правил.
10. Исправь найденные проблемы.

Отдельно проверь сценарий:

```text
Пользователь:
"Добавь возможность восстановления пароля по SMS"
```

Опиши, как `documentation-orchestrator` должен обработать запрос:

```text
product context
→ product
→ requirements
→ ui
→ api
→ technical
→ review
```

---

# Критерии качества итогового проекта

Проект считается готовым, если новый AI-агент, ничего не знающий о проекте, после чтения только:

```text
AGENTS.md
README.md
```

может самостоятельно понять:

* структуру документации;
* где искать информацию;
* что является source of truth;
* какой skill применять;
* какие файлы создавать;
* какие файлы изменять;
* как связывать требования;
* как работать с неизвестной информацией;
* как проверить результат.

---

# Важные архитектурные принципы

Всегда соблюдай:

```text
Product documentation = WHAT + WHY

Requirements = формализованное ожидаемое поведение

UI requirements = поведение пользовательского интерфейса

API requirements = контракт взаимодействия

Technical documentation = HOW

ADR = WHY было принято важное техническое решение
```

Не смешивай эти уровни без необходимости.

---

# Source of truth

Используй следующий приоритет:

```text
1. Approved requirements
2. Approved business rules
3. Approved product documentation
4. Approved ADR
5. Existing technical documentation
6. Current source code
7. Assumptions
```

При этом:

* код описывает текущее состояние реализации;
* requirements описывают требуемое состояние;
* расхождение между ними не должно автоматически исправляться в пользу кода.

---

# Правило минимального изменения

При изменении существующей документации:

1. Найди связанные документы.
2. Определи impact.
3. Изменяй только необходимые части.
4. Не переписывай документ целиком без необходимости.
5. Сохраняй ID требований.
6. Обновляй cross-reference.
7. Запускай review.

---

# Что не нужно делать

Не создавай:

* сложный documentation framework;
* отдельную базу данных;
* собственный DSL;
* web UI;
* сервер;
* генератор сайта документации;
* OpenSpec;
* монорепозиторий сервисов;
* десятки микроскиллов;
* чрезмерно сложные YAML schemas;
* runtime dependency от skills.sh.

На первой версии задача — создать **надёжный Git + Markdown + Agent Skills foundation**.

---

# Порядок приоритетов

Работай именно в таком порядке:

```text
P0
1. Initialization
2. Information architecture
3. Rules
4. Metadata / IDs
5. Templates

P1
6. product-documentation
7. requirements
8. ui-requirements
9. api-requirements
10. technical-documentation

P2
11. architecture-decisions
12. documentation-review

P3
13. documentation-orchestrator

P4
14. AGENTS.md finalization
15. Example feature
16. Validators
17. External skills references
18. Final end-to-end review
```

Причина такого порядка:

`documentation-orchestrator` нельзя качественно проектировать до тех пор, пока не определено поведение всех специализированных skills.

---

# Формат отчёта во время выполнения

После каждого этапа выводи кратко:

```text
## Stage N — <name>

Created:
- ...

Updated:
- ...

Decisions:
- ...

Validation:
- PASS / issues fixed
```

Не выводи содержимое всех созданных файлов в терминал, если это не требуется.

Продолжай работу самостоятельно до завершения всех этапов.

---

# Финальный результат

После завершения выведи:

```text
## Result

Project structure:
...

Skills:
...

Validation:
...

Example feature:
...

Key architectural decisions:
...

Remaining TBD:
...
```

Если `Remaining TBD` отсутствуют:

```text
Remaining TBD: none
```

После этого проект должен быть готов к реальному использованию командой разработки и дальнейшему развитию через Claude Code / Codex CLI.
