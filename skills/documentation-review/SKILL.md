---
name: documentation-review
description: Проверка существующей документации без её изменения — structure, requirements quality, traceability, противоречия, hallucination protection, терминология, TBD/assumptions; результат — отчёт с находками ERROR/WARNING и обязательными итоговыми списками. Использовать после содержательного изменения requirements/ui/api/technical, перед переводом документа в approved и как финальную стадию работы над feature. Не использовать для создания или исправления документации — находки устраняют пишущие skills (product-documentation, requirements, ui-requirements, api-requirements, technical-documentation, architecture-decisions).
---

# Skill: documentation-review

Проверяет существующую документацию и формирует отчёт о находках. Это единственный артефакт skill: он **не создаёт, не изменяет и не «исправляет» ни один документ** — даже очевидную опечатку. Каждая находка адресуется человеку и устраняется соответствующим пишущим skill по его решению.

Review покрывает семь групп проверок: Structure, Requirements quality, Traceability, Contradictions, Hallucination protection, Terminology, TBD/assumptions.

## Когда использовать

- После содержательного изменения `requirements.md`, `ui.md`, `api.md` или `technical.md` feature.
- Перед переводом документа в статус `approved` (сам перевод делает человек).
- Как финальная стадия комплексной работы над feature (`skills/documentation-orchestrator`).
- Пользователь просит проверить документацию.

## Когда не использовать

| Задача | Правильный skill |
|--------|------------------|
| Описать проблему, пользователей, сценарии, scope | `skills/product-documentation` |
| Формализовать требования (FR/BR/NFR) | `skills/requirements` |
| Описать поведение интерфейса | `skills/ui-requirements` |
| Описать контракт API | `skills/api-requirements` |
| Описать реализацию решения | `skills/technical-documentation` |
| Зафиксировать архитектурное решение (ADR) | `skills/architecture-decisions` |
| Сверить документацию с кодом в `services/` | `skills/spec-verification` |

Исправление найденных проблем — тоже не задача этого skill: по каждой группе находок рекомендуется пишущий skill из таблицы.

## Процесс

Шаги 1–2 — обязательная подготовка. Шаги 3–9 — семь групп проверок; выполнять все, порядок внутри неважен. Локальная проверка `node scripts/validate-docs.mjs` дополняет review механическими проверками (frontmatter, ID, ссылки), но не заменяет его.

### Шаг 1. Прочитать контекст

До начала проверки прочитать:

1. [rules/ai-guardrails.md](../../rules/ai-guardrails.md) — обязательный документ защиты от галлюцинаций; также [rules/requirements.md](../../rules/requirements.md), [rules/linking.md](../../rules/linking.md), [rules/terminology.md](../../rules/terminology.md), [rules/writing.md](../../rules/writing.md), [rules/markdown.md](../../rules/markdown.md). Правила — эталон, на который ссылается каждая находка.
2. Стандарт ID и frontmatter: [schemas/README.md](../../schemas/README.md), схемы [schemas/metadata.schema.yaml](../../schemas/metadata.schema.yaml), [schemas/requirement.schema.yaml](../../schemas/requirement.schema.yaml), [schemas/feature.schema.yaml](../../schemas/feature.schema.yaml).
3. Шаблоны в [templates/](../../templates/feature.md) — эталон структуры секций каждого типа документа.
4. Glossary: [docs/product/glossary.md](../../docs/product/glossary.md).
5. Запустить `node scripts/validate-docs.mjs` ([scripts/validate-docs.mjs](../../scripts/validate-docs.mjs)) — механические ошибки попадают в отчёт до ручной проверки.

### Шаг 2. Определить scope

- По умолчанию scope — одна feature: все документы `docs/features/<feature-name>/`, включая `decisions/`.
- Глобальные документы, на которые ссылается feature ([docs/product/business-rules.md](../../docs/product/business-rules.md), [docs/product/non-functional-requirements.md](../../docs/product/non-functional-requirements.md), `docs/api/`, `docs/architecture/`), входят в scope чтения — без них не проверить ссылки и противоречия.
- По явному запросу пользователя scope может быть весь `docs/` или отдельный документ; при проверке отдельного документа связанные документы всё равно читаются.

### Шаг 3. Structure

- Расположение файлов — по [schemas/feature.schema.yaml](../../schemas/feature.schema.yaml): `README.md`, `product.md`, `requirements.md` обязательны; отсутствие обязательного файла — ERROR, отсутствие опционального (`ui.md`, `api.md`, `technical.md`, `decisions/`) — не находка.
- Frontmatter — в каждом документе, валиден по [schemas/metadata.schema.yaml](../../schemas/metadata.schema.yaml): обязательные `title`, `type`, `status`, `version`, `owners`, для feature-документов `feature`. Отсутствие frontmatter или обязательного поля — ERROR.
- Секции и их порядок — по шаблону соответствующего типа из `templates/`; отсутствующая или переставленная секция — WARNING, если содержимое не потеряно, иначе ERROR.
- Пустая секция допустима только как `TBD: ...` или `Not applicable: <причина>` ([rules/markdown.md](../../rules/markdown.md)); пустая без пометки — WARNING.

### Шаг 4. Requirements quality

По [rules/requirements.md](../../rules/requirements.md) для каждого FR/BR/NFR/UI/API:

- **Atomic** — одно требование в одном пункте; «и» между независимыми действиями — признак склейки (WARNING).
- **Unambiguous** — без слов из чёрного списка неизмеримых формулировок ([rules/writing.md](../../rules/writing.md)), употреблённых без измеримого определения (WARNING).
- **Testable** — формулировка проверяема тестировщиком; непроверяемая — WARNING.
- **No duplicates** — одно требование живёт ровно в одном файле ([rules/linking.md](../../rules/linking.md)); продублированная формулировка вместо ссылки на ID — ERROR.
- Формат ID — `^(FR|BR|NFR|UI|API|ADR)-\d{3,}$`; malformed ID или дубль номера в одной области уникальности — ERROR.
- Acceptance Criteria — в формате Given/When/Then, каждый ссылается на FR/BR; AC без связи (висячий критерий) — ERROR.

### Шаг 5. Traceability

Покрытие здесь — только doc↔doc: реализован ли требование в коде, review не проверяет (это `skills/spec-verification`). Построить дерево покрытия по Traceability-таблицам и телам документов:

```text
FR-004
├── UI-007
├── API-003
└── technical.md
```

Находить:

- FR, не покрытый ни UI, ни API, ни technical, когда покрытие ожидается (в feature существует соответствующий `ui.md`/`api.md`/`technical.md`), — ERROR; для feature без этих документов пустая колонка «Покрыто» — не находка, а вход для следующих стадий;
- UI/API-требование без ссылки хотя бы на один FR/BR/NFR — WARNING;
- ссылку на несуществующий ID — ERROR;
- битую относительную Markdown-ссылку — ERROR;
- ссылку на ID из другой области уникальности без ссылки на файл-источник ([schemas/README.md](../../schemas/README.md)) — ERROR;
- рассинхрон Traceability-таблицы с телом документа (ID есть в тексте, отсутствует в таблице, или наоборот) — WARNING.

### Шаг 6. Contradictions

Искать противоречия между `product.md`, `requirements.md`, `ui.md`, `api.md`, `technical.md`:

- одно значение (лимит, срок, формат, статусная модель) описано по-разному в двух документах — ERROR;
- `ui.md`/`api.md` описывают поведение, отсутствующее в requirements, — ERROR (либо галлюцинация, либо пропущенное требование — решает человек);
- `technical.md` противоречит approved-требованию — ERROR; расхождение фиксируется, не «исправляется» в пользу кода или технического решения;
- нарушение уровней ([rules/writing.md](../../rules/writing.md)): HOW в product/requirements (например «хранить в Redis»), новые требования в technical.md — WARNING.

### Шаг 7. Hallucination protection

Эвристика из [rules/ai-guardrails.md](../../rules/ai-guardrails.md): подозрение на галлюцинацию — конкретное значение (число, формат, код ошибки, лимит), которого нет ни в одном связанном документе и которое не дал человек.

- Неподтверждённое конкретное значение без источника — ERROR (подозрение на галлюцинацию).
- Business rule, внезапно появившееся вне [docs/product/business-rules.md](../../docs/product/business-rules.md) и requirements, — ERROR.
- Техническое ограничение без обоснования требованием, ADR или кодом в `services/` — WARNING.
- `ASSUMPTION`, на который другой документ ссылается как на факт, — ERROR.

Review только помечает подозрения; подтверждает или опровергает их человек.

### Шаг 8. Terminology

По [rules/terminology.md](../../rules/terminology.md) и [docs/product/glossary.md](../../docs/product/glossary.md):

- термин используется не по glossary или в значении, отличном от определения, — WARNING;
- синоним вместо канонического термина (включая помеченные «не использовать») — WARNING;
- значимый термин встречается в документах, но отсутствует в glossary — WARNING.

Конфликт терминов review только фиксирует — решает человек.

### Шаг 9. TBD и assumptions

Собрать по всему scope:

- все `TBD: ...` — с файлом и секцией;
- все `ASSUMPTION: ... Requires confirmation.` — с файлом и секцией; `ASSUMPTION` без `Requires confirmation.` — WARNING.

Это не нарушения, а обязательная часть отчёта: списки открытых вопросов для человека.

### Шаг 10. Сформировать отчёт

Каждая находка — одной строкой, с severity, файлом и ID (если применимо):

- `ERROR` — нарушение правил или схем, битая ссылка, несуществующий или malformed ID, дубль требования, непокрытый FR, висячий acceptance criterion, противоречие, подозрение на галлюцинацию;
- `WARNING` — висячее UI/API-требование, неатомарность, неизмеримая формулировка, отклонение от шаблона или glossary, рассинхрон Traceability-таблицы.

```text
ERROR: FR-007 не покрыт ни UI, ни API.

WARNING: API-004 не связан ни с одним FR.

ERROR: UI-002 ссылается на отсутствующий FR-012.
```

Отчёт всегда завершается четырьмя списками — каждый присутствует, даже если пуст (тогда `none`):

```text
Unresolved TBD
Unconfirmed assumptions
Broken references
Coverage gaps
```

### Шаг 11. Проверить результат

Перед завершением пройти чеклист:

- [ ] Прочитаны rules/, schemas/, templates/ и glossary; scope определён по шагу 2.
- [ ] `node scripts/validate-docs.mjs` выполнен; его находки включены в отчёт.
- [ ] Все семь групп проверок выполнены: Structure, Requirements quality, Traceability, Contradictions, Hallucination protection, Terminology, TBD/assumptions.
- [ ] Дерево покрытия построено для всех FR scope.
- [ ] Каждая находка имеет severity (`ERROR`/`WARNING`), файл и ID, если применимо.
- [ ] Находки не выдуманы: каждая опирается на конкретное правило, схему, шаблон или расхождение между документами.
- [ ] Подозрения на галлюцинацию помечены как подозрения, а не как приговор.
- [ ] Итоговые четыре списка присутствуют (пустые — `none`).
- [ ] Ни один документ не создан, не изменён и не «исправлен» — включая опечатки и очевидные мелочи.
- [ ] По каждой группе находок указан рекомендуемый пишущий skill.

Завершая работу, сообщить пользователю: итог review (количество `ERROR` и `WARNING`, полный список находок), четыре итоговых списка (Unresolved TBD, Unconfirmed assumptions, Broken references, Coverage gaps), подтверждение, что документы не изменялись, и рекомендуемый пишущий skill для устранения каждой группы находок (например, непокрытые FR — `skills/ui-requirements` / `skills/api-requirements`, противоречия в требованиях — `skills/requirements`).
