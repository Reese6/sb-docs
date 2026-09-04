---
description: Заполняет requirements.md feature — FR, BR, NFR со стабильными ID и Traceability. Третий шаг пайплайна документации feature.
---

# Команда /feature-requirements

Выполни skill `.gigacode/skills/requirements/SKILL.md` целиком: прочитай файл и пройди его секции по порядку — «Вход и стоп-условия», «Прочитать», «Правила», «Шаги», «Чеклист».

Аргументы: {{args}}

Первое слово аргументов — имя feature в kebab-case, остальное — запрос пользователя.
Имя не указано или директории `docs/features/<feature-name>/` нет — остановись и ответь: «Укажи имя feature: /feature-requirements <feature-name> <запрос>».

Отчёт — по секции «Отчёт» из SKILL.md; последнюю строку замени на «Следующая команда: /feature-model <feature-name>», если feature вводит или меняет сущности; иначе — «Следующая команда: /feature-ui <feature-name>» при наличии интерфейса, иначе «Следующая команда: /feature-api <feature-name>».
