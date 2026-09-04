---
description: Создаёт директорию feature и три заготовки — README.md, product.md, requirements.md. Первый шаг пайплайна документации feature.
---

# Команда /feature-create

Выполни skill `.gigacode/skills/feature-scaffold/SKILL.md` целиком: прочитай файл и пройди его секции по порядку — «Вход и стоп-условия», «Прочитать», «Правила», «Шаги», «Чеклист».

Аргументы: {{args}}

Первое слово аргументов — имя feature в kebab-case, остальное — описание feature одной фразой.
Имя не указано или не kebab-case — предложи 2–3 варианта имени по описанию и остановись до выбора человека.
Директория `docs/features/<feature-name>/` уже существует — остановись и ответь: «Feature <feature-name> существует — заполняй документ своей командой, например /feature-product».

Отчёт — по секции «Отчёт» из SKILL.md; последнюю строку замени на «Следующая команда: /feature-product <feature-name>».
