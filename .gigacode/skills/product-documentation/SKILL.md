---
name: product-documentation
description: Создаёт и изменяет product.md feature — проблема, цель, пользователи, сценарии, scope на уровне WHAT + WHY. Триггеры — «опиши feature/функцию», «какую проблему решаем», «сценарии», «scope», «product.md», стадия product documentation. Вход — существующая директория feature и docs/product/. Не для создания директории feature (feature-scaffold), FR/BR/NFR (requirements), интерфейса (ui-requirements), API (api-requirements), реализации (technical-documentation).
---

# Skill: product-documentation

## Когда использовать

Создать или изменить `docs/features/<feature>/product.md` — проблема, цель, пользователи, сценарии, scope (WHAT + WHY, без HOW). Поводы: новая feature на продуктовом уровне; изменение проблемы, цели, сценариев, scope; стадия product documentation оркестратора. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| Директория `docs/features/<feature>/` существует | Стоп. Ответ: «Сначала `/feature-create <feature-name> <описание>`». |
| Запрос описывает проблему, а не готовое решение («добавь кнопку X») | Не стоп: восстановить проблему за решением. Неизвестна — записать `TBD: какую проблему решает <X>` и спросить пользователя. |
| Документ не `approved`, либо правка MINOR, либо apply утверждённого change proposal | Стоп. Ответ: «Содержательное изменение approved-документа — через `change-management`». |

## Прочитать

1. Обязательно: [overview.md](../../../docs/product/overview.md), [vision.md](../../../docs/product/vision.md), [glossary.md](../../../docs/product/glossary.md) — единственный источник терминов, [personas.md](../../../docs/product/personas.md), [business-rules.md](../../../docs/product/business-rules.md), [non-functional-requirements.md](../../../docs/product/non-functional-requirements.md); [schemas/README.md](../../../schemas/README.md) — frontmatter. Правила — по AGENTS.md.
2. Если есть: все файлы `docs/features/<feature>/` целиком, в том числе `requirements.md`; при изменении — текущий `product.md` полностью до правок.
3. Структура feature: [docs/features/README.md](../../../docs/features/README.md).

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из `docs/product/`, подтверждённых данных или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; существующие ID не менять.

1. Problem — проблема пользователя или бизнеса, существующая сейчас: факты, не решения. Метрики и обращения — только подтверждённые, иначе `TBD`.
2. Users — personas из `personas.md` по ссылке, без переописания; незатронутые назвать явно. Роли нет в `personas.md` — `TBD` и предложить дополнить его отдельно.
3. Сценарий — «Пользователь <делает X>, чтобы <получить Y>»: путь к цели без кликов и экранов (уровень `ui.md`). Негативные и граничные — если продуктово значимы.
4. Scope — первая поставка, каждый пункт станет требованием в `requirements.md`. Out of scope — близкие вещи, отложенные или отвергнутые. Неподтверждённое — в Out of scope или Open questions; scope не расширять.
5. Детали реализации — технологии, БД, очереди, структура API, библиотеки — запрещены (`rules/writing.md`). Техническое ограничение, влияющее на продукт, — строка в Constraints со ссылкой на источник.
6. Бизнес-правила, лимиты, метрики, приоритеты, Success criteria и Business value — только из источников и измеримо, не «по здравому смыслу»; нет данных — `TBD`. Пустая секция с `TBD` лучше правдоподобно заполненной; запрещённые слова — `rules/writing.md`.
7. Термины — по `glossary.md`, новый термин не вводить молча. Глобальный контекст не копировать: personas, `BR-XXX`, `NFR-XXX` — по ссылке (`rules/linking.md`).
8. Изменение `product.md` меняет смысл существующих FR — impact в Open questions; `requirements.md` молча не переписывать.
9. Заготовка — `type: product`, `status: draft`; правка минимальная. `version`: MINOR без изменения смысла, MAJOR при изменении scope или сценариев; `approved` после правки → `review`.
10. Уточняющих вопросов — не более пяти, одним списком, затем стоп.

## Шаги

1. Определить проблему, пользователей, сценарии, ожидаемое поведение, scope и out of scope (правила 1–4).
2. Заполнить `product.md` feature: файл создан заготовкой skill `feature-scaffold`, секции — по [templates/product.md](../../../templates/product.md); неприменимые — `Not applicable: <причина>`; комментарии `<!-- AI: -->` выполнить и удалить; в `related` — только существующие файлы.
3. Заполнить Business value, Success criteria, Dependencies, Constraints (правила 5–6).
4. Собрать все `TBD` и `ASSUMPTION` в Open questions, включая impact на существующие FR (правило 8).
5. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — решение вместо проблемы, деталь реализации, выдуманная метрика:

```text
Problem: Нужна кнопка «Отправить код повторно», коды будем хранить в Redis. Сейчас 30 % пользователей не получают код.
```

Правильно:

```text
Problem: Пользователь, не получивший код подтверждения, не может завершить восстановление доступа и обращается в поддержку. TBD: доля обращений по этой причине.
```

## Чеклист

- [ ] Документ отвечает только на WHAT + WHY; деталей реализации нет.
- [ ] Problem — проблема, не решение; данные подтверждены или `TBD`.
- [ ] Users ссылаются на `personas.md`, незатронутые названы; сценарии — путь к цели без кликов.
- [ ] Каждая секция шаблона заполнена или помечена `Not applicable: <причина>`; незаполнимое содержит `TBD`, не выдуманный текст.
- [ ] Scope не расширен: неподтверждённое — в Out of scope или Open questions.
- [ ] Каждый `ASSUMPTION` — с `Requires confirmation.`; ни один не записан как факт.
- [ ] Термины по glossary; глобальный контекст — ссылки, не копии.
- [ ] Success criteria измеримы или `TBD`; impact на существующие FR — в Open questions.

## Отчёт

```text
Файлы: <созданные/изменённые пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
Пункты Scope, не подтверждённые пользователем: <список или none>
Следующий шаг: .gigacode/skills/requirements, затем .gigacode/skills/documentation-review
```
