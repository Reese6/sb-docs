# 13. Skill `documentation-orchestrator`

> Источник: INIT.md, ЭТАП 13. Приоритет: P3. Создаётся ПОСЛЕДНИМ среди основных skills — его нельзя качественно проектировать, пока не определено поведение всех специализированных skills.
> Зависит от: 06, 07, 08, 09, 10, 11, 12.

## Цель

Создать `skills/documentation-orchestrator/SKILL.md` — координатор специализированных skills. Он не пишет всю документацию самостоятельно.

## Поведение skill

1. Понять намерение пользователя.
2. Определить затрагиваемую feature.
3. Определить необходимые типы документации.
4. Определить существующие документы.
5. Определить зависимости.
6. Выбрать последовательность специализированных skills.
7. После изменений запустить documentation review.

## Базовый pipeline

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

## Ключевое правило

Pipeline не должен запускать ненужные stages. Например, изменение текста кнопки не должно автоматически создавать ADR и technical specification.

## Результат (deliverables)

- `skills/documentation-orchestrator/SKILL.md`

## Критерии готовности

- Все 7 шагов оркестрации описаны.
- Pipeline включён с правилом пропуска ненужных stages.
- Review обязателен после изменений.
- Skill ссылается на 7 специализированных skills, не дублируя их логику.
