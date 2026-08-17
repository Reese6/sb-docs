# 07. Skill `requirements`

> Источник: INIT.md, ЭТАП 7. Приоритет: P1. Один из наиболее важных skills.
> Зависит от: 06.

## Цель

Создать `skills/requirements/SKILL.md` — skill, преобразующий продуктовую постановку в формальные требования.

## Концептуальные ориентиры

- `user-story`;
- хорошие практики Gherkin;
- requirement engineering.

## Поведение skill

Различать типы:

```text
Functional Requirement
Business Rule
Non-functional Requirement
Constraint
Acceptance Criterion
```

Требования должны быть:

- атомарными;
- однозначными;
- проверяемыми;
- иметь стабильный ID (FR-XXX, BR-XXX, NFR-XXX по стандарту задачи 04);
- не содержать несколько независимых требований в одном пункте.

Избегать слов без измеримого определения:

```text
удобно
быстро
интуитивно
корректно
нормально
оптимально
```

Acceptance Criteria должны быть пригодны для последующего использования тестировщиком.

## Требования

- Работать от `product.md`, создавать `requirements.md` по `templates/requirements.md`.
- Соблюдать `rules/ai-guardrails.md` и `rules/requirements.md`.
- Заполнять Traceability (связи с product, UI, API).

## Результат (deliverables)

- `skills/requirements/SKILL.md`

## Критерии готовности

- Все 5 типов требований определены с критериями различения.
- Критерии качества требований (атомарность, однозначность, проверяемость, стабильный ID) зафиксированы.
- Чёрный список неизмеримых слов включён.
- Требование к тестопригодности Acceptance Criteria зафиксировано.
