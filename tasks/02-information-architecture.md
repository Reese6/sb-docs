# 02. Информационная архитектура документации

> Источник: INIT.md, ЭТАП 2. Приоритет: P0.
> Зависит от: 01.

## Цель

Создать базовую структуру `docs/` с разделением на глобальный контекст и feature-документацию.

## Шаги

1. Разделить документацию минимум на:
   - глобальный product context (`docs/product/`);
   - features (`docs/features/`);
   - architecture (`docs/architecture/`);
   - API (`docs/api/`).
2. Создать файлы глобального контекста:
   - `docs/product/overview.md`
   - `docs/product/vision.md`
   - `docs/product/glossary.md`
   - `docs/product/personas.md`
   - `docs/product/business-rules.md`
   - `docs/product/non-functional-requirements.md`
3. Создать `docs/features/README.md` с описанием структуры feature.
4. Создать `docs/architecture/`: `overview.md`, `system-context.md`, `components.md`, `integrations.md`, `data-model.md`, `adr/README.md`.
5. Создать `docs/api/`: `overview.md`, `authentication.md`, `conventions.md`, `errors.md`, `services/`.

## Ключевое правило

**Глобальные правила продукта не должны копироваться в каждую feature.** Feature должна ссылаться на глобальный контекст.

## Структура feature

```text
docs/features/<feature-name>/
├── README.md
├── product.md
├── requirements.md
├── ui.md
├── api.md
├── technical.md
└── decisions/
```

- Не каждый файл обязан существовать для каждой feature.
- Например, backend-only feature может не иметь `ui.md`.

## Результат (deliverables)

- Полная структура `docs/` (product, features, architecture, api).
- Документированное правило ссылок на глобальный контекст (в `docs/features/README.md`).

## Критерии готовности

- Все четыре раздела `docs/` созданы и заполнены (не пустые заглушки: назначение каждого файла описано).
- Правило «не копировать глобальный контекст» зафиксировано.
- Структура feature описана вместе с правилом опциональности файлов.
