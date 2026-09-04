---
description: Заполняет product.md feature — проблема, пользователи, сценарии, метрики. Второй шаг пайплайна документации feature.
---

# Команда /feature-product

Выполни skill `.gigacode/skills/product-documentation/SKILL.md` целиком: прочитай файл и пройди его секции по порядку — «Вход и стоп-условия», «Прочитать», «Правила», «Шаги», «Чеклист».

Аргументы: {{args}}

Первое слово аргументов — имя feature в kebab-case, остальное — запрос пользователя.
Имя не указано или директории `docs/features/<feature-name>/` нет — остановись и ответь: «Укажи имя feature: /feature-product <feature-name> <запрос>».

Отчёт — по секции «Отчёт» из SKILL.md; последнюю строку замени на «Следующая команда: /feature-requirements <feature-name>».
