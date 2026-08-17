# 08. Skill `ui-requirements`

> Источник: INIT.md, ЭТАП 8. Приоритет: P1.
> Зависит от: 07.

## Цель

Создать `skills/ui-requirements/SKILL.md`. Приоритет skill — описание поведения интерфейса, а не только внешнего вида.

## Поведение skill

Работать от:

```text
product.md
requirements.md
```

Создавать:

```text
ui.md
```

по `templates/ui.md`.

## Идентификаторы и traceability

- Каждое существенное UI-требование получает ID `UI-XXX`.
- По возможности — ссылка на `FR-XXX`, `BR-XXX`, `NFR-XXX`.

## Состояния компонентов

Обязательно описывать (только когда применимы):

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

## Учитывать

- validation;
- responsive;
- accessibility;
- navigation;
- edge cases;
- error states;
- empty states;
- loading.

## Ограничения

- Не придумывать дизайн-систему, если она отсутствует.
- Соблюдать `rules/ai-guardrails.md`: неизвестное — TBD/ASSUMPTION.

## Результат (deliverables)

- `skills/ui-requirements/SKILL.md`

## Критерии готовности

- Входные документы (product.md, requirements.md) и выход (ui.md) зафиксированы.
- Правила ID и traceability описаны.
- Список состояний компонентов и правило «только когда применимы» включены.
- Все 8 аспектов (validation…loading) учтены.
