---
name: documentation-review
description: Проверяет документацию без изменений — структура, качество требований, traceability, противоречия, галлюцинации, терминология, TBD/ASSUMPTION; результат — отчёт ERROR/WARNING с четырьмя итоговыми списками. Триггеры — «проверь документацию», «прогони review», «ревью feature», «перед approved», финальная стадия оркестратора и change-management. Вход — документы feature. Не для создания и исправления документов — это пишущие skills.
---

# Skill: documentation-review

## Когда использовать

Проверить документы feature и сформировать отчёт — единственный артефакт skill. Ни один документ не создаётся, не изменяется и не «исправляется», даже очевидная опечатка: каждая находка адресована человеку, устраняет её пишущий skill по его решению. Поводы: после содержательного изменения `requirements.md`, `ui.md`, `api.md`, `technical.md`; перед переводом документа в `approved` (переводит человек); финальная стадия `documentation-orchestrator` и `change-management`; просят проверить. Создание и правка документов — пишущие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| Запрос — проверить, а не исправить | Стоп для правок. Ответ: «Review только формирует отчёт; исправления — пишущий skill по решению человека». |
| Scope определён: по умолчанию одна feature — все файлы `docs/features/<feature>/`, включая `decisions/`; по явному запросу — весь `docs/` или один документ | Спросить пользователя, какую feature проверять. |

## Прочитать

1. Обязательно: все `rules/*.md` (эталон, на который ссылается каждая находка); [schemas/README.md](../../../schemas/README.md) и схемы `schemas/*.yaml`; шаблоны `templates/*.md` — эталон секций; [glossary.md](../../../docs/product/glossary.md) и [roles.md](../../../docs/product/roles.md).
2. Документы scope целиком; при проверке одного документа — связанные документы feature тоже.
3. Глобальные документы, на которые ссылается feature: [business-rules.md](../../../docs/product/business-rules.md), [non-functional-requirements.md](../../../docs/product/non-functional-requirements.md), `docs/api/`, `docs/architecture/` — без них не проверить ссылки и противоречия.

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`.

1. Каждая находка опирается на конкретное правило, схему, шаблон или расхождение между документами; находки не выдумываются.
2. Каждая находка — одна строка: severity, файл, ID (если есть), суть, правило, пишущий skill для устранения.
3. `ERROR` — нарушение правил или схем, битая ссылка, несуществующий или malformed ID, дубль требования, непокрытый FR, висячий acceptance criterion, противоречие, подозрение на галлюцинацию. `WARNING` — качество: неатомарность, неизмеримая формулировка, отклонение от шаблона или glossary, висячее UI/API-требование, рассинхрон Traceability.
4. Не находка: отсутствие опциональных `model.md`, `ui.md`, `api.md`, `technical.md`, `decisions/`; пустая колонка «Покрыто» у feature без этих документов. Документ с `version: 0.1`, `status: draft` и телом каждой секции `TBD` — заготовка skill `feature-scaffold`: его `TBD` идут в отчёт одной строкой, находками не считаются.
5. Подозрение на галлюцинацию — конкретное значение (число, формат, код ошибки, лимит), которого нет ни в одном связанном документе и которое не дал человек. Review помечает подозрение; подтверждает или опровергает человек.
6. Конфликт терминов и расхождение кода с требованием review только фиксирует; решает человек.
7. `TBD` и `ASSUMPTION` — не нарушения, а обязательные списки открытых вопросов в отчёте.
8. `node scripts/validate-docs.mjs` дополняет review механическими проверками (frontmatter, ID, ссылки), но не заменяет его.

## Таблица находок

| Группа | Находка | Severity | Устраняет |
|--------|---------|----------|-----------|
| Structure | Нет обязательного файла `README.md`, `product.md`, `requirements.md` (`schemas/feature.schema.yaml`) | ERROR | product-documentation, requirements |
| Structure | Нет frontmatter или обязательного поля `title`, `type`, `status`, `version`, `owners`; для feature-документов — `feature` (`schemas/metadata.schema.yaml`) | ERROR | пишущий skill документа |
| Structure | `title` или H1 не на русском языке (`schemas/metadata.schema.yaml`, `rules/markdown.md`) | ERROR | пишущий skill документа |
| Structure | Секция шаблона отсутствует или переставлена; содержимое не потеряно | WARNING | пишущий skill документа |
| Structure | Секция отсутствует, содержимое потеряно | ERROR | пишущий skill документа |
| Structure | Пустая секция без `TBD: …` или `Not applicable: <причина>` | WARNING | пишущий skill документа |
| Structure | Поля существующей сущности скопированы в `model.md` вместо ссылки на `docs/architecture/data-model/<entity>.md` | ERROR | data-model |
| Structure | Роль в `api.md` отсутствует в `docs/product/roles.md` | ERROR | api-requirements |
| Structure | `api.md` не по шаблону: метод без блока `## <METHOD> <path>` или без подсекций Роли, Параметры, Request, Response, Errors | WARNING | api-requirements |
| Requirements quality | Неатомарное требование: «и» между независимыми действиями | WARNING | requirements, ui-requirements, api-requirements |
| Requirements quality | Слово из чёрного списка (`rules/writing.md`) без измеримого определения | WARNING | тот же |
| Requirements quality | Формулировка непроверяема тестировщиком | WARNING | тот же |
| Requirements quality | Формулировка требования продублирована вместо ссылки на ID | ERROR | тот же |
| Requirements quality | ID не по стандарту `schemas/README.md` (формат) или дубль номера в одной области | ERROR | тот же |
| Requirements quality | Acceptance criterion без ссылки на FR/BR (висячий); формат Given/When/Then — где применим | ERROR | requirements |
| Traceability | FR не покрыт ни UI, ни API, ни technical, хотя соответствующий документ в feature есть | ERROR | ui-requirements, api-requirements, technical-documentation |
| Traceability | UI/API-требование без ссылки на FR/BR/NFR | WARNING | ui-requirements, api-requirements |
| Traceability | Ссылка на несуществующий ID; битая относительная ссылка; ID другой области без ссылки на файл-источник | ERROR | пишущий skill документа |
| Traceability | Traceability-таблица не совпадает с телом документа | WARNING | пишущий skill документа |
| Traceability | Новая сущность или изменение сущности в `model.md` без связи с FR или BR | WARNING | data-model |
| Contradictions | Одно значение (лимит, срок, формат, статусная модель) описано по-разному в двух документах | ERROR | requirements и зависимые |
| Contradictions | `ui.md`/`api.md` описывают поведение, отсутствующее в `requirements.md` | ERROR | requirements или ui/api — решает человек |
| Contradictions | `technical.md` противоречит approved-требованию | ERROR | technical-documentation |
| Contradictions | Нарушение уровней: HOW в product/requirements («хранить в Redis»), новое требование в `technical.md` | WARNING | product-documentation, requirements, technical-documentation |
| Hallucination | Конкретное значение без источника в связанных документах и без указания человека | ERROR (подозрение) | пишущий skill документа |
| Hallucination | Business rule вне `docs/product/business-rules.md` и `requirements.md` | ERROR | requirements |
| Hallucination | Техническое ограничение без обоснования требованием, ADR или кодом в `services/` | WARNING | technical-documentation |
| Hallucination | `ASSUMPTION`, на который другой документ ссылается как на факт | ERROR | пишущий skill документа |
| Terminology | Термин не по `glossary.md` или в ином значении; синоним вместо канонического (включая помеченные «не использовать») | WARNING | пишущий skill документа |
| Terminology | Значимый термин есть в документах, отсутствует в glossary | WARNING | человек (product owner) |
| TBD/assumptions | `ASSUMPTION` без `Requires confirmation.` | WARNING | пишущий skill документа |

## Шаги

1. Запустить `node scripts/validate-docs.mjs`; его находки — в отчёт первыми.
2. Проверить каждый документ scope по таблице находок; выполнить все семь групп, порядок внутри неважен. Заготовки отметить по правилу 4.
3. Построить дерево покрытия для каждого FR scope по Traceability-таблицам и телам документов:

```text
FR-004
├── UI-007
├── API-003
└── technical.md
```

4. Собрать по всему scope все `TBD: …` и `ASSUMPTION: …` с файлом и секцией.
5. Сформировать отчёт по шаблону «Отчёт»; для каждой группы находок указать пишущий skill.

## Примеры

Неправильно — находка без файла и правила, «исправление» вместо находки:

```text
Требования сформулированы нечётко, я поправил формулировки в requirements.md.
```

Правильно:

```text
ERROR: requirements.md FR-007 — не покрыт ни UI, ни API при наличии ui.md и api.md (rules/linking.md) → ui-requirements / api-requirements
WARNING: ui.md UI-003 — «быстро» без измеримого определения (rules/writing.md) → ui-requirements
```

## Чеклист

- [ ] `validate-docs` выполнен; его находки в отчёте.
- [ ] Все семь групп проверены; дерево покрытия построено для всех FR scope.
- [ ] Каждая находка — severity, файл, ID, правило, пишущий skill.
- [ ] Подозрения на галлюцинацию помечены как подозрения, не как приговор.
- [ ] Итоговые списки присутствуют (пустые — `none`); `TBD` заготовок собраны одной строкой, а не разнесены по находкам.
- [ ] Ни один документ не создан, не изменён и не «исправлен» — включая опечатки.

## Отчёт

```text
Review: <scope>; validate-docs: <OK | N errors>
ERROR: <файл> <ID> — <суть> (<правило>) → <skill>
WARNING: <файл> <ID> — <суть> (<правило>) → <skill>
Итого: <n> ERROR, <m> WARNING

Заготовки (TBD ожидаемы): <файлы или none>
Unresolved TBD: <файл, секция: текст … | none>
Unconfirmed assumptions: <файл, секция: текст … | none>
Broken references: <… | none>
Coverage gaps: <… | none>

Документы не изменялись.
```
