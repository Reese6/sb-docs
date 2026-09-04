---
description: Промоутит approved-документы feature в глобальные — сущности в data-model, сервисные API в api/services, change proposal при approved-цели.
---

# Команда /feature-apply

Выполни skill `.gigacode/skills/feature-apply/SKILL.md` целиком: прочитай файл и пройди его секции по порядку — «Вход и стоп-условия», «Прочитать», «Правила», «Шаги», «Чеклист».

Аргументы: {{args}}

Первое слово аргументов — имя feature в kebab-case, остальное — запрос пользователя.
Имя не указано или директории `docs/features/<feature-name>/` нет — остановись и ответь: «Укажи имя feature: /feature-apply <feature-name>».
Индексы и файлы `model/` и `api/` не в статусе `approved` — остановись и ответь: «Промоут только из approved-документов; статус ставит человек».

Отчёт — по секции «Отчёт» из SKILL.md; последнюю строку замени на «Следующая команда: /change-apply <change-name> после решения человека по proposal, иначе /feature-review <feature-name>».
