---
name: product-documentation
description: Создание и изменение продуктовой документации feature (product.md) — проблема, цель, пользователи, сценарии, scope. Использовать, когда нужно описать или изменить описание функции на уровне WHAT + WHY. Не использовать для формализации требований (FR/BR/NFR), UI, API или технического решения.
---

# Skill: product-documentation

Создаёт и изменяет `docs/features/<feature-name>/product.md` — человекочитаемую продуктовую документацию feature.

Product documentation отвечает на **WHAT + WHY**: какая проблема существует, зачем её решать, кто пользователи, какие сценарии, что входит и не входит в scope. Она не отвечает на HOW.

## Когда использовать

- Пользователь просит описать новую функцию/feature на продуктовом уровне.
- Пользователь просит изменить проблему, цель, сценарии, scope существующей feature.
- Orchestrator запускает стадию product documentation для новой feature.

## Когда не использовать

| Задача | Правильный skill |
|--------|------------------|
| Формализовать FR/BR/NFR, acceptance criteria | `skills/requirements` |
| Описать поведение интерфейса | `skills/ui-requirements` |
| Описать контракт API | `skills/api-requirements` |
| Описать техническое решение | `skills/technical-documentation` |
| Зафиксировать архитектурное решение | `skills/architecture-decisions` |
| Проверить существующую документацию | `skills/documentation-review` |

## Процесс

### Шаг 1. Прочитать контекст

До любых правок прочитать:

1. [rules/ai-guardrails.md](../../rules/ai-guardrails.md) — обязательный документ защиты от галлюцинаций; также [rules/writing.md](../../rules/writing.md), [rules/linking.md](../../rules/linking.md), [rules/terminology.md](../../rules/terminology.md).
2. Глобальный продуктовый контекст `docs/product/`:
   - [overview.md](../../docs/product/overview.md), [vision.md](../../docs/product/vision.md);
   - [glossary.md](../../docs/product/glossary.md) — единственный источник терминов;
   - [personas.md](../../docs/product/personas.md) — пользователи продукта;
   - [business-rules.md](../../docs/product/business-rules.md), [non-functional-requirements.md](../../docs/product/non-functional-requirements.md).
3. Существующую feature целиком: все файлы `docs/features/<feature-name>/`, если директория есть. При изменении `product.md` — прочитать его полностью до правок.
4. Связанные требования: `requirements.md` данной feature (если есть) и глобальные BR/NFR, на которые feature ссылается. Изменение `product.md` может менять смысл существующих FR — такой impact фиксировать в Open questions, а не молча переписывать требования.

### Шаг 2. Определить проблему

- Сформулировать проблему пользователя/бизнеса, которая существует сейчас. Факты, не решения.
- Данные (метрики, обращения) приводить только подтверждённые; нет данных — `TBD`.
- Если постановка пользователя описывает решение («добавь кнопку X»), восстановить проблему за ним; если проблема неизвестна — `TBD: какую проблему решает <X>` и спросить пользователя.

### Шаг 3. Определить пользователей

- Указать, какие personas из [docs/product/personas.md](../../docs/product/personas.md) затронуты; ссылаться, не переописывать.
- Явно указать, каких personas feature не касается.
- Отсутствующую в `personas.md` роль не изобретать: пометить `TBD` и предложить дополнить `personas.md` отдельно.

### Шаг 4. Описать сценарии

- Формат: «Пользователь <делает X>, чтобы <получить Y>». Каждый сценарий — путь к цели.
- Без последовательности кликов и экранов — это уровень `ui.md`.
- Включить негативные и граничные сценарии, если они продуктово значимы.

### Шаг 5. Определить scope / out-of-scope

- Scope: что входит в первую поставку; каждый пункт затем формализуется в `requirements.md`.
- Out of scope: явно перечислить близкие вещи, которые могут показаться частью feature, но отложены или отвергнуты.
- Границу scope не расширять самостоятельно: не подтверждённое пользователем — в Out of scope или Open questions.

### Шаг 6. Не добавлять техническую реализацию

- В `product.md` запрещены детали реализации: технологии, таблицы БД, очереди, структура API, названия библиотек (признаки нарушения — [rules/writing.md](../../rules/writing.md)).
- Известное техническое ограничение, влияющее на продукт, — одной строкой в Constraints со ссылкой на источник; детали — уровень `technical.md`.

### Шаг 7. Не придумывать продуктовые решения

- Каждое утверждение — `FACT` (со следом к source of truth), `ASSUMPTION` (с `Requires confirmation.`) или `TBD` — по [rules/ai-guardrails.md](../../rules/ai-guardrails.md).
- Не изобретать: бизнес-правила, лимиты, метрики, целевые значения, приоритеты, решения «по здравому смыслу».
- Пустая секция с `TBD` лучше правдоподобно заполненной.

### Шаг 8. Создать или изменить product.md

- Новый документ создавать строго по [templates/product.md](../../templates/product.md), включая все секции и YAML frontmatter.
- Неприменимые секции помечать «Not applicable: <причина>», не удалять и не заполнять заглушками.
- Frontmatter — по стандарту [schemas/README.md](../../schemas/README.md): `type: product`, новый документ — `status: draft`; `approved` выставляет только человек.
- Ссылаться на глобальный контекст, не копировать его ([rules/linking.md](../../rules/linking.md), [docs/features/README.md](../../docs/features/README.md)): термины — glossary, пользователи — personas, глобальные правила — `BR-XXX`/`NFR-XXX` по ссылке.
- При изменении существующего документа — правило минимального изменения и повышение `version`/`status` по [CONTRIBUTING.md](../../CONTRIBUTING.md) и [schemas/README.md](../../schemas/README.md).
- Если директории feature нет — создать `docs/features/<feature-name>/` (kebab-case) и `README.md` feature; структура — [docs/features/README.md](../../docs/features/README.md).

### Шаг 9. Проверить результат

Перед завершением пройти чеклист:

- [ ] Все секции шаблона присутствуют; неприменимые помечены «Not applicable: <причина>»; незаполнимые содержат `TBD`, а не выдуманный текст.
- [ ] Документ отвечает только на WHAT + WHY; деталей реализации нет.
- [ ] Ни один `ASSUMPTION` не записан как факт; у каждого есть `Requires confirmation.`
- [ ] Термины соответствуют [glossary.md](../../docs/product/glossary.md); новые термины не введены молча.
- [ ] Пользователи ссылаются на [personas.md](../../docs/product/personas.md).
- [ ] Глобальный контекст не скопирован — только ссылки.
- [ ] Frontmatter валиден по [schemas/README.md](../../schemas/README.md).
- [ ] Success criteria измеримы или помечены `TBD` (запрещённые слова — [rules/writing.md](../../rules/writing.md)).
- [ ] Open questions собраны; impact на существующие требования зафиксирован.

Завершая работу, сообщить пользователю: созданные/изменённые файлы, список `ASSUMPTION` (ждут подтверждения) и `TBD` (ждут ответа), рекомендуемый следующий шаг (обычно `skills/requirements`, затем `skills/documentation-review`).
