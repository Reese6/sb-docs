# 15. Пример feature: password-recovery

> Источник: INIT.md, ЭТАП 15. Приоритет: P4.
> Зависит от: 14.

## Цель

Создать демонстрационную feature `docs/features/password-recovery/` для проверки всей системы. Reference implementation структуры документации — не переусложнять.

## Файлы

```text
docs/features/password-recovery/
├── README.md
├── product.md
├── requirements.md
├── ui.md
├── api.md
├── technical.md
└── decisions/
```

## Пример должен демонстрировать

- FR;
- BR;
- NFR;
- UI;
- API;
- cross-references;
- assumptions;
- TBD;
- traceability.

## Требования

- Все документы — по templates из задачи 05, с YAML frontmatter.
- ID — по стандарту задачи 04.
- Ссылки на глобальный контекст вместо копирования.
- Реалистичные ASSUMPTION (например, срок жизни OTP) и TBD — как образцы применения guardrails.

## Результат (deliverables)

- Полный набор документов feature `password-recovery`.

## Критерии готовности

- Все 9 демонстрируемых элементов присутствуют.
- Документы проходят проверки skill `documentation-review` (структура, traceability, terminology).
- Пример прост и читаем.
