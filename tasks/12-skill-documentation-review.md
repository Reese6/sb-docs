# 12. Skill `documentation-review`

> Источник: INIT.md, ЭТАП 12. Приоритет: P2. Критически важный skill.
> Зависит от: 11.

## Цель

Создать `skills/documentation-review/SKILL.md`. Задача skill — не писать новую документацию, а проверять существующую.

## Проверки (минимум)

### Structure

- правильное расположение файлов;
- наличие metadata (frontmatter);
- соответствие templates.

### Requirements quality

- atomic;
- unambiguous;
- testable;
- no duplicates.

### Traceability

Строить дерево покрытия, например:

```text
FR-004
├── UI-007
├── API-003
└── technical.md
```

Находить проблемы вида:

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

- неподтверждённые значения;
- внезапно появившиеся business rules;
- необоснованные технические ограничения.

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

## Результат (deliverables)

- `skills/documentation-review/SKILL.md`

## Критерии готовности

- Все 7 групп проверок описаны.
- Формат вывода ERROR/WARNING определён.
- Итоговый список (TBD/assumptions/broken refs/coverage gaps) обязателен в выводе review.
- Skill явно не создаёт и не переписывает документацию.
