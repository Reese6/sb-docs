# Конфигурация GigaCode CLI

Справка для авторов правил, skills и команд. Агент этот файл не читает.

## Что где лежит

| Директория | Что это | Как попадает в контекст |
|------------|---------|-------------------------|
| `rules/` | базовые правила проекта | подключаются из `GIGACODE.md` через `@`-импорт, всегда в контексте |
| `skills/` | пошаговые процедуры, `<name>/SKILL.md` | агент выбирает по `description`, затем читает тело |
| `commands/` | команды человека, `/<имя файла без .md>` | тело файла подставляется как промпт |

Любой `.md` в `commands/` становится командой — README и черновики туда не класть.
Справка по skills — [skills/README.md](skills/README.md).

## Формат команды

Frontmatter — только `description`: одна строка, видна в `/help`, модель её не видит. Последовательность «двоеточие-пробел» внутри значения ломает YAML.

Плейсхолдеры в теле, порядок подстановки — `@{path}`, затем `!{cmd}`, затем `{{args}}`:

| Плейсхолдер | Что делает |
|-------------|------------|
| `{{args}}` | аргументы команды с shell-экранированием; без него аргументы дописываются в конец промпта |
| `@{path}` | вставляет содержимое файла в промпт |
| `!{cmd}` | выполняет команду после подтверждения человека и вставляет её вывод |

## Требования валидатора

[scripts/validate-docs.mjs](../scripts/validate-docs.mjs) обходит все `.md` репозитория. Frontmatter он проверяет только в `docs/`, структуру — везде. Файл команды обязан:

- иметь ровно один H1;
- не содержать code fence без языка и незакрытых fence;
- использовать `-` как маркер списка, не `*`;
- заканчиваться переводом строки.

Путь к `SKILL.md` писать в backticks от корня репозитория, не markdown-ссылкой: ссылку валидатор разрешает относительно `commands/`, а агенту нужен путь относительно рабочей директории.

## Скелет тела

Команда — тонкая обёртка на 10–20 строк. Процедура живёт в `SKILL.md`, здесь только разбор аргументов и следующий шаг. Стоп-условия skill не дублировать.

```markdown
---
description: <что делает команда одной строкой>
---

# Команда /feature-<x>

Выполни skill `.gigacode/skills/<skill>/SKILL.md` целиком: прочитай файл и пройди его секции по порядку — «Вход и стоп-условия», «Прочитать», «Правила», «Шаги», «Чеклист».

Аргументы: {{args}}

Первое слово аргументов — имя feature в kebab-case, остальное — запрос пользователя.
Имя не указано или директории `docs/features/<feature-name>/` нет — остановись и ответь: «Укажи имя feature: /feature-<x> <feature-name> <запрос>».

Отчёт — по секции «Отчёт» из SKILL.md; последнюю строку замени на «Следующая команда: /feature-<next> <feature-name>».
```

## Команды пайплайна feature

| Команда | Skill | Следующая |
|---------|-------|-----------|
| `/feature-create` | `feature-scaffold` | `/feature-product` |
| `/feature-product` | `product-documentation` | `/feature-requirements` |
| `/feature-requirements` | `requirements` | `/feature-model`, иначе `/feature-ui` или `/feature-api` |
| `/feature-model` | `data-model` | `/feature-model` для следующей сущности, затем `/feature-ui` или `/feature-api` |
| `/feature-ui` | `ui-requirements` | `/feature-api` |
| `/feature-api` | `api-requirements` | `/feature-api` для следующего метода, затем `/feature-technical` |
| `/feature-technical` | `technical-documentation` | `/feature-review` |
| `/feature-review` | `documentation-review` | команда документа с находкой, иначе `/feature-apply` |
| `/feature-apply` | `feature-apply` | `/change-apply` после решения человека по proposal, иначе `/feature-review` |

Один вызов — один документ; для `/feature-model` и `/feature-api` — одна сущность и один метод, файл на каждый в `model/` и `api/`; для `/change-apply` — один proposal. Автоматический маршрут по всем стадиям — skill `documentation-orchestrator`.

## Команды change proposal

| Команда | Skill | Следующая |
|---------|-------|-----------|
| `/change-propose` | `change-management`, режим propose | решение человека в `## Status`, затем `/change-apply` |
| `/change-apply` | `change-management`, режимы apply и rejected | команда документа с находкой review, иначе решение человека о `approved` |
