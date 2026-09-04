---
description: Проверяет документы feature и выдаёт отчёт о находках. Документы не правит.
---

# Команда /feature-review

Выполни skill `.gigacode/skills/documentation-review/SKILL.md` целиком: прочитай файл и пройди его секции по порядку — «Вход и стоп-условия», «Прочитать», «Правила», «Таблица находок», «Шаги», «Чеклист».

Аргументы: {{args}}

Первое слово аргументов — имя feature в kebab-case, остальное — уточнение области проверки.
Имя не указано или директории `docs/features/<feature-name>/` нет — остановись и ответь: «Укажи имя feature: /feature-review <feature-name>».
Область по умолчанию — все файлы `docs/features/<feature-name>/`, включая `api/`, `model/`, `decisions/`. Ни один документ не изменять — только отчёт.

Отчёт — по секции «Отчёт» из SKILL.md; последнюю строку замени на «Следующая команда: команда документа с находкой, например /feature-requirements <feature-name>; находок нет — /feature-apply <feature-name>».
