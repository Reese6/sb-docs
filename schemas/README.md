# Стандарт метаданных и идентификаторов

Source of truth для формата requirement ID и YAML frontmatter. Машиночитаемые схемы — в этой же директории:

- [metadata.schema.yaml](metadata.schema.yaml) — frontmatter документа;
- [requirement.schema.yaml](requirement.schema.yaml) — структура требования;
- [feature.schema.yaml](feature.schema.yaml) — состав feature-директории;
- [change.schema.yaml](change.schema.yaml) — состав change-директории (`docs/changes/`).

## Типы ID

```text
FR-XXX   Functional Requirement       feature requirements.md
BR-XXX   Business Rule                feature requirements.md | docs/product/business-rules.md
NFR-XXX  Non-functional Requirement   feature requirements.md | docs/product/non-functional-requirements.md
UI-XXX   UI Requirement               feature ui.md
API-XXX  API Requirement              feature api.md
ADR-XXX  Architecture Decision        feature decisions/ | docs/architecture/adr/
```

## Формат

- `<TYPE>-<NNN>`: тип заглавными латинскими, дефис, три цифры с ведущими нулями: `FR-001`, `API-042`.
- После `999` — четыре цифры (`FR-1000`); формат с меньшим числом цифр не меняется задним числом.
- Регулярное выражение: `^(FR|BR|NFR|UI|API|ADR)-\d{3,}$`.

## Область уникальности

- **ID уникальны в пределах своей области (scope)**. Областей две категории: каждая feature (`docs/features/<feature-name>/`) — отдельная область для определённых в ней ID; вся остальная документация (`docs/product/`, `docs/architecture/`, `docs/api/`) — единая глобальная область. Так проверяет и `scripts/validate-docs.mjs`.
- Внутри области один номер используется одним требованием за всю историю.
- При ссылке между областями ID указывается со ссылкой на файл-источник при первом упоминании (см. `rules/linking.md`); неоднозначность (`FR-003` из другой feature без ссылки) — ошибка review.

## Жизненный цикл ID

### Создание

1. Найти максимальный существующий номер данного типа в данной области — **включая deprecated**.
2. Взять следующий номер. Пропуски в нумерации допустимы и не заполняются.
3. ID присваивается при первом появлении требования в документе (статус документа значения не имеет).
4. В change proposal (`docs/changes/`) новые требования получают placeholder `<TYPE>-NEW-<n>` (например `FR-NEW-1`), уникальный в пределах proposal. Реальный ID присваивается при применении proposal: первым появлением требования считается его появление в целевом документе.

### Изменение

- Изменение формулировки, статуса или связей требования **не меняет** его ID.
- ID не переименовываются и не «перенумеровываются» при реорганизации документа.
- Если требование делится на два — старый ID остаётся за ближайшим по смыслу (или помечается deprecated), новые части получают новые ID с пометкой происхождения.

### Удаление

- Требование не удаляется физически — помечается `deprecated` с указанием причины и, при наличии, заменяющего ID.
- **Удалённые (deprecated) ID никогда не переиспользуются** для новых требований.
- Ссылки на deprecated ID обновляются на заменяющий ID или помечаются как устаревшие.

## Cross-reference

Связи выражаются от производного требования к источнику:

```text
UI-004 → FR-012
API-007 → FR-012
ADR-003 → NFR-002
```

- В тексте требования: `UI-004 (→ FR-012): ...` или отдельной строкой `Trace: FR-012`.
- Сводно — в секции `Traceability` документа.
- Полные правила ссылок — `rules/linking.md`.

## YAML frontmatter

Обязателен для документов feature и `docs/` (кроме README.md директорий). Пример:

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

### Поля

| Поле | Обязательно | Значения |
|------|-------------|----------|
| `title` | да | название документа, человекочитаемое |
| `type` | да | `product`, `requirements`, `ui`, `api`, `technical`, `adr`, `architecture`, `feature-readme`, `change` |
| `status` | да | `draft`, `review`, `approved`, `deprecated` |
| `feature` | для документов feature | имя директории feature (kebab-case) |
| `version` | да | версия документа, `MAJOR.MINOR` |
| `owners` | да | список ролей/команд: `product`, `backend`, `frontend`, `architecture`, `qa` |
| `related` | нет | связанные файлы (относительные пути) |

### Статусы документов

```text
draft       создан, не проверен
review      на проверке
approved    утверждён; source of truth
deprecated  устарел; требования не действуют, файл хранится для истории
```

- Новый документ — всегда `draft`.
- `approved` выставляет только человек.
- Понижение `approved` → `draft` не делается: изменение утверждённого документа переводит его в `review`.
- `version` увеличивается при содержательных изменениях: MINOR — правки без изменения смысла требований, MAJOR — изменение/добавление требований.

### Статусы ADR

У ADR два независимых статуса:

- **статус документа** — frontmatter `status` (`draft`/`review`/`approved`/`deprecated`), общий жизненный цикл выше;
- **статус решения** — секция `## Status` в теле (`proposed`, `accepted`, `deprecated`, `superseded`, `rejected`).

Ориентировочное соответствие: `proposed` ↔ `draft`/`review`, `accepted` ↔ `approved`, `superseded`/`rejected` ↔ `deprecated`. В сводных таблицах (README feature) указывается статус документа из frontmatter; статус решения — отдельно при необходимости.

### Статусы change proposal

У change proposal (`docs/changes/`, `type: change`) два независимых статуса:

- **статус документа** — frontmatter `status` (`draft`/`review`/`approved`/`deprecated`), общий жизненный цикл выше;
- **статус изменения** — секция `## Status` в теле `proposal.md` (`proposed`, `approved`, `applied`, `rejected`).

Соответствие: `proposed` ↔ `draft`/`review`, `approved` ↔ `approved`, `applied`/`rejected` ↔ `deprecated` (выставляется при архивировании). Статусы `approved` и `rejected` выставляет только человек; `applied` выставляется после внесения всех правок proposal в целевые документы. Полный процесс — `skills/change-management`.
