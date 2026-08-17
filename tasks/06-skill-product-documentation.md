# 06. Skill `product-documentation`

> Источник: INIT.md, ЭТАП 6. Приоритет: P1.
> Зависит от: 05.

## Цель

Создать `skills/product-documentation/SKILL.md` — специализированный skill для создания и изменения человекочитаемой продуктовой документации.

## Концептуальные ориентиры

- `prd-development`
- `breakdown-feature-prd`

Без runtime dependency на эти skills — у репозитория собственный стандарт.

## Поведение skill

1. Сначала читать:
   - `docs/product/`;
   - glossary;
   - существующую feature;
   - связанные требования.
2. Определять проблему.
3. Определять пользователей.
4. Описывать сценарии.
5. Определять scope/out-of-scope.
6. Не добавлять техническую реализацию без необходимости.
7. Не придумывать неизвестные продуктовые решения.
8. Создавать `product.md` согласно `templates/product.md`.
9. Проверять результат перед завершением.

## Требования

- Соблюдать `rules/ai-guardrails.md`: FACT/ASSUMPTION/TBD, запрет выдумывания.
- Product documentation = WHAT + WHY.
- Ссылаться на глобальный контекст, не копировать его.

## Результат (deliverables)

- `skills/product-documentation/SKILL.md`

## Критерии готовности

- SKILL.md описывает все 9 шагов поведения.
- Есть явные ссылки на templates, rules, glossary.
- Нет runtime dependency на внешние skills.
