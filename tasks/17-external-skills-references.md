# 17. Интеграция внешних skills

> Источник: INIT.md, ЭТАП 16. Приоритет: P4.
> Зависит от: 16.

## Цель

Добавить в документацию раздел с рекомендуемыми external references — без жёсткой зависимости проекта от сторонних skills.

## Исходные ориентиры

```text
prd-development
user-story
documentation
api-documentation-generator
architecture-decision-records
```

## Шаги

1. Добавить раздел с recommended external references в документацию (README.md или отдельный документ).
2. Если в окружении доступен `npx skills` — дополнительно создать:

   ```text
   docs/ai/external-skills.md
   ```

   с командами установки.

## Ключевое правило

Собственные `SKILL.md` данного проекта остаются source of truth. Никакого runtime dependency от skills.sh.

## Результат (deliverables)

- Раздел external references в документации.
- Опционально: `docs/ai/external-skills.md`.

## Критерии готовности

- Все 5 ориентиров перечислены как концептуальные references.
- Явно зафиксировано: локальные SKILL.md — source of truth.
- Нет runtime dependency на внешние skills.
