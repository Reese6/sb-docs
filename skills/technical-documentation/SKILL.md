---
name: technical-documentation
description: Техническое решение feature (technical.md) — HOW; компоненты, data flow, изменения данных, миграции, деплой на основе утверждённых требований и кода в services/. Использовать, когда product.md и requirements.md готовы (ui.md/api.md — если есть) и нужно описать реализацию. Не использовать для формализации требований (requirements), контракта API, поведения интерфейса или фиксации архитектурного решения (ADR).
---

# Skill: technical-documentation

Создаёт и изменяет `docs/features/<feature-name>/technical.md` — техническое решение feature.

Документ отвечает на HOW: как реализовать утверждённые требования. Новые требования в нём не появляются — только реализация существующих. Ключевой принцип:

```text
requirements = source of truth для требуемого поведения

services source code = source of truth для текущей реализации
```

Не путать эти два понятия. Если код противоречит утверждённому требованию — явно отметить расхождение в документации, а не «исправлять» молча в пользу кода.

## Когда использовать

- `product.md` и `requirements.md` feature готовы (`ui.md`/`api.md` — если есть), нужно описать техническое решение.
- Пользователь просит добавить или изменить техническое решение существующей feature.
- Orchestrator запускает стадию technical после UI/API.

## Когда не использовать

| Задача | Правильный skill |
|--------|------------------|
| Описать проблему, пользователей, сценарии, scope | `skills/product-documentation` |
| Формализовать требования (FR/BR/NFR) | `skills/requirements` |
| Описать поведение интерфейса | `skills/ui-requirements` |
| Описать контракт API | `skills/api-requirements` |
| Зафиксировать архитектурное решение | `skills/architecture-decisions` |
| Проверить существующую документацию | `skills/documentation-review` |
| Сверить документацию с кодом: покрытие требований, дрейф, противоречия | `skills/spec-verification` |

## Процесс

Шаги 1–2 — обязательная подготовка. Описывать техническое решение только после их завершения; спецификация «из головы», без прочтения требований и проверки `services/`, запрещена.

### Шаг 1. Прочитать контекст

До любых правок прочитать:

1. [rules/ai-guardrails.md](../../rules/ai-guardrails.md) — обязательный документ защиты от галлюцинаций; также [rules/writing.md](../../rules/writing.md), [rules/linking.md](../../rules/linking.md), [rules/terminology.md](../../rules/terminology.md).
2. Стандарт ID и frontmatter: [schemas/README.md](../../schemas/README.md).
3. `product.md` и `requirements.md` данной feature — целиком. Это входные документы skill. Если какой-то из них отсутствует — остановиться и направить пользователя в `skills/product-documentation` или `skills/requirements`; техническое решение без постановки и требований не описывается.
4. `ui.md` и `api.md` данной feature, если есть, — целиком: решение обязано реализовывать описанный контракт и поведение интерфейса, а не переопределять их.
5. Существующий `technical.md` feature (если есть) — целиком.
6. Существующие архитектурные решения: глобальные ADR в [docs/architecture/adr/](../../docs/architecture/adr/README.md) и ADR уровня feature в `docs/features/<feature-name>/decisions/`. Решение, противоречащее принятому ADR, — либо следовать ADR, либо инициировать новый через `skills/architecture-decisions`; молча отклоняться нельзя.
7. Архитектурный контекст: [docs/architecture/overview.md](../../docs/architecture/overview.md), [docs/architecture/components.md](../../docs/architecture/components.md), [docs/architecture/data-model.md](../../docs/architecture/data-model.md), [docs/architecture/integrations.md](../../docs/architecture/integrations.md) — имена компонентов и сущностей брать оттуда.

### Шаг 2. Изучить текущую реализацию в services/

По [services/README.md](../../services/README.md):

- Проверить `services/`: подключён ли код сервисов, затронутых feature (пути — из [docs/architecture/components.md](../../docs/architecture/components.md)).
- Код подключён — изучить соответствующие сервисы и описать Current implementation **только** из кода и существующей документации; пересказ кода построчно не нужен — только поведение, значимое для решения.
- Код не подключён — в Current implementation записать «TBD: код сервиса X не подключён в services/» и предложить пользователю подключить (clone или symlink); не сочинять текущую реализацию по памяти или «по аналогии».
- Код — источник только текущей реализации, не продуктовых требований: поведение, найденное в коде, но отсутствующее в `requirements.md`, — не требование, а факт реализации; значимый факт — вопрос в Open questions.

### Шаг 3. Не путать два source of truth

- Требуемое поведение — только из `requirements.md` (и `ui.md`/`api.md`); текущая реализация — только из кода в `services/`. Смешение уровней — ошибка документа.
- Код противоречит утверждённому требованию — зафиксировать расхождение явно в Current implementation: какой ID нарушен, что делает код. Не «исправлять» молча: не переписывать требование под код и не описывать код так, будто он уже соответствует требованию.
- Непонятно, что правильно — код или требование, — конфликт пометить `TBD` или вопросом в Open questions; решает человек.

### Шаг 4. Определить охват решения

- Из `requirements.md`, `ui.md`, `api.md` выбрать FR/BR/NFR/UI/API, которые реализует решение, — перечислить в Related requirements только ID со ссылками; формулировки не копировать.
- Новые требования в `technical.md` не появляются: обнаруженный пробел требований — предложить пользователю дополнить `requirements.md` через `skills/requirements`, не фиксировать требование в техническом документе.
- Каждое требование из охвата обязано быть реализуемо описанным решением; нереализуемое или не покрытое решением — пробел, зафиксировать `TBD` или вопрос в Open questions.

### Шаг 5. Описать решение — покрыть аспекты шаблона

Для решения проверить каждый аспект; неприменимый — пометить в соответствующей секции «Not applicable: <причина>», не молчать:

| Аспект | Что зафиксировать |
|--------|-------------------|
| Proposed solution | Суть подхода в нескольких абзацах: достаточно детально для реализации, без пересказа кода построчно. |
| Components | Затронутые компоненты и что в каждом меняется; имена — из [docs/architecture/components.md](../../docs/architecture/components.md). |
| Data flow | Поток данных/вызовов по шагам сценария: Mermaid sequenceDiagram или нумерованный список. |
| Services involved | Сервисы с ролью в решении и путём в `services/`, если подключён. |
| Data model changes | Новые/изменённые таблицы, поля, индексы; согласовать с [docs/architecture/data-model.md](../../docs/architecture/data-model.md). |
| API changes | Внешние endpoints — ссылкой на `api.md`; внутренние API — здесь; ломающие изменения выделять явно. |
| Events | Новые/изменённые события: топик, схема, producer/consumer. |
| Caching | Что кэшируется, где, время жизни, инвалидация. |
| Transactions | Границы транзакций, консистентность между сервисами (saga, outbox), поведение при частичном сбое. |
| Error handling | Повторы, тайм-ауты, fallback, идемпотентность обработчиков; пользовательские ошибки — уровень `ui.md`/`api.md`. |
| Security | Хранение секретов, шифрование, доступы; ссылаться на NFR по безопасности. |
| Observability | Логи, метрики, алерты, трейсинг: что добавить, чтобы решение было наблюдаемым. |
| Performance | Ожидаемая нагрузка, узкие места, соответствие NFR по производительности. |
| Backward compatibility | Совместимость со старыми клиентами/данными/контрактами; что сломается и как мигрируем без простоя. |
| Migration | Шаги миграции данных/конфигурации: порядок, обратимость, откат. |
| Deployment | Порядок выката, фиче-флаги, канареечный выкат, зависимости деплоя. |
| Testing considerations | Техническая стратегия тестирования: интеграционные сценарии, моки, нагрузочное; acceptance criteria — в `requirements.md`. |
| Alternatives | Рассмотренные альтернативы и почему отклонены (кратко). |
| Risks | Технические риски и меры снижения. |

### Шаг 6. Не выдумывать реализацию

- Числа (нагрузка, тайм-ауты, лимиты, TTL) — только из NFR, кода или указания человека; иначе `TBD`. Предположение — `ASSUMPTION: ... Requires confirmation.` Ни то, ни другое не записывается как факт ([rules/ai-guardrails.md](../../rules/ai-guardrails.md)).
- Имена компонентов, сервисов, таблиц, топиков, метрик — из кода в `services/` или архитектурных документов; не изобретать «правдоподобные» имена.
- Признак нарушения: в документе появилось конкретное значение или имя, которого нет ни в требованиях, ни в коде, ни в `docs/architecture/`, и которое не дал человек.
- Существенный архитектурный выбор (несколько жизнеспособных альтернатив, сложно изменить, создаёт ограничения) — кандидат на ADR: зафиксировать кратко в Alternatives и предложить `skills/architecture-decisions`; не «принимать» такое решение молча внутри `technical.md`.

### Шаг 7. Создать или изменить technical.md

- Новый документ создавать строго по [templates/technical.md](../../templates/technical.md), включая все секции (Context, Related requirements, Current implementation, Proposed solution, Components, Data flow, Services involved, Data model changes, API changes, Events, Caching, Transactions, Error handling, Security, Observability, Performance, Backward compatibility, Migration, Deployment, Testing considerations, Alternatives, Risks, Open questions) и YAML frontmatter.
- Неприменимые секции помечать «Not applicable: <причина>», не удалять.
- Frontmatter — по [schemas/README.md](../../schemas/README.md): `type: technical`, новый документ — `status: draft`; `approved` выставляет только человек.
- При изменении существующего документа — правило минимального изменения и повышение `version`/`status` по [CONTRIBUTING.md](../../CONTRIBUTING.md) и [schemas/README.md](../../schemas/README.md).

### Шаг 8. Обновить Traceability requirements.md

- Собственных ID у `technical.md` нет ([schemas/README.md](../../schemas/README.md) типа для technical не вводит) — документ только ссылается на FR/BR/NFR/UI/API.
- После создания или изменения документа обновить колонку «Покрыто (technical)» в Traceability `requirements.md` данной feature для всех требований из Related requirements.

### Шаг 9. При изменении существующего решения — impact-анализ

По [rules/linking.md](../../rules/linking.md) и [rules/ai-guardrails.md](../../rules/ai-guardrails.md):

1. Найти все документы, ссылающиеся на изменяемые части решения (grep по затронутым ID и именам компонентов).
2. Проверить, не разошлось ли решение с `requirements.md`, `ui.md`, `api.md` и принятыми ADR; конфликт — пометить `TBD`/`ASSUMPTION`, не переписывать связанные документы молча.
3. Обновить Traceability `requirements.md` и cross-references в затронутых документах.

### Шаг 10. Проверить результат

Перед завершением пройти чеклист:

- [ ] Подготовка выполнена полностью: прочитаны `product.md`, `requirements.md`, `ui.md`/`api.md`; проверен `services/`; при подключённом коде изучены затронутые сервисы; найдены существующие ADR — и только после этого описано решение.
- [ ] Все секции шаблона присутствуют; неприменимые помечены «Not applicable: <причина>»; незаполнимые содержат `TBD`, а не выдуманный текст.
- [ ] Требуемое поведение — из `requirements.md`, текущая реализация — из кода: уровни не смешаны.
- [ ] Каждое расхождение кода с утверждёнными требованиями отмечено явно; ни одно не «исправлено» молча.
- [ ] Current implementation основана только на коде и существующей документации; код недоступен — стоит «TBD: код сервиса X не подключён в services/».
- [ ] Новых требований в документе не появилось; Related requirements содержит только ID со ссылками, формулировки не скопированы.
- [ ] Ни одного выдуманного имени, числа или значения; каждое прослеживается к требованиям, коду, `docs/architecture/` или указанию человека.
- [ ] Ни один `ASSUMPTION` не записан как факт; у каждого есть `Requires confirmation.`
- [ ] Решение не противоречит принятым ADR; существенные выборы вынесены в Alternatives с кандидатами на ADR.
- [ ] Колонка «Покрыто (technical)» в Traceability `requirements.md` обновлена.
- [ ] Frontmatter валиден по [schemas/README.md](../../schemas/README.md).

Завершая работу, сообщить пользователю: созданные/изменённые файлы, список `ASSUMPTION` (ждут подтверждения) и `TBD` (ждут ответа, в том числе неподключённые сервисы), обнаруженные расхождения кода и требований, рекомендуемый следующий шаг (обычно `skills/architecture-decisions` при существенном выборе, затем `skills/documentation-review`).
