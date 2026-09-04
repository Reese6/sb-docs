---
name: feature-scaffold
description: Создаёт директорию feature и три заготовки — README.md, product.md, requirements.md — с заполненным frontmatter и телом секций TBD. Триггеры — «новая feature», «заведи feature», «создай директорию feature», стадия scaffold оркестратора. Вход — имя feature в kebab-case и одна фраза описания. Не для содержания документов (product-documentation, requirements), модели данных (data-model), промоута в глобальные документы (feature-apply).
---

# Skill: feature-scaffold

## Когда использовать

Создать `docs/features/<feature-name>/` и три заготовки — `README.md`, `product.md`, `requirements.md`: frontmatter заполнен, тело каждой секции — `TBD`. Единственный skill, создающий директорию feature. Поводы: новая feature перед первым содержательным документом; стадия scaffold оркестратора. Содержание документов не пишет — это `product-documentation` и `requirements`. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| Имя feature задано первым аргументом, kebab-case, латиница | Стоп. Предложить 2–3 варианта имени по описанию; дождаться выбора человека. |
| Директории `docs/features/<feature-name>/` ещё нет | Стоп. Ответ: «Feature `<feature-name>` существует — заполняй документ своей командой, например `/feature-product`». |
| Запрос содержит описание feature для `title` | Не стоп: `title` — `TBD: название feature`, спросить у человека одной строкой. |

## Прочитать

1. Обязательно: [templates/feature.md](../../../templates/feature.md), [templates/product.md](../../../templates/product.md), [templates/requirements.md](../../../templates/requirements.md); [schemas/README.md](../../../schemas/README.md) — frontmatter. Правила — по AGENTS.md.
2. Если есть: [docs/features/README.md](../../../docs/features/README.md) — структура feature и список features.
3. Продуктовый контекст для названия: [docs/product/overview.md](../../../docs/product/overview.md).

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; ID не выдумывать.

1. Имя директории — из аргумента, kebab-case, латиница. Другой формы имени не принимать.
2. `title` — русское название feature из описания человека; H1 файла совпадает с `title`.
3. Тело каждой секции шаблона — `TBD: <что неизвестно>`. Правдоподобный текст вместо `TBD` — нарушение `rules/ai-guardrails.md`.
4. Комментарии `<!-- AI: -->` из шаблонов сохранить: их выполняет skill, который заполняет документ.
5. Плейсхолдеры `FR-XXX`, `BR-XXX`, `NFR-XXX`, `UI-XXX`, `API-XXX` из шаблона в файл не переносить — валидатор считает их malformed ID.
6. В таблице Documents `README.md` — только три созданных файла. Строка на несозданный файл даёт битую ссылку; такие строки удалить.
7. `ui.md`, `api/`, `model/`, `technical.md`, `decisions/` не создавать — их создают свои skills по мере надобности.
8. Секцию «Список features» в `docs/features/README.md` пополнить одной строкой; содержание самого README feature туда не копировать.
9. `related` frontmatter — только уже созданные файлы (`rules/linking.md`).
10. Frontmatter трёх файлов: `type` по шаблону (`feature-readme`, `product`, `requirements`), `status: draft`, `version: 0.1`, `feature: <feature-name>`, `owners` по шаблону.
11. `TBD` в этих заготовках — ожидаемое состояние, не находка review; сказать об этом в отчёте.

## Шаги

1. Проверить имя feature (правило 1). Пусто или не kebab-case: предложить 2–3 варианта и остановиться.
2. Если `docs/features/<feature-name>/` существует: стоп по таблице «Вход и стоп-условия».
3. Создать директорию и `README.md` из [templates/feature.md](../../../templates/feature.md): frontmatter заполнить, таблицу Documents свести к трём созданным файлам, тело секций — `TBD`.
4. Создать `product.md` из [templates/product.md](../../../templates/product.md): frontmatter заполнить, тело каждой секции — `TBD`, комментарии `<!-- AI: -->` сохранить.
5. Создать `requirements.md` из [templates/requirements.md](../../../templates/requirements.md) тем же порядком; ни одного ID в теле.
6. Добавить строку в секцию «Список features» файла [docs/features/README.md](../../../docs/features/README.md) в форме `- [<Название feature>](<feature-name>/README.md) — <одна фраза>`; строку «Features пока нет.» при первой записи удалить.
7. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — секции заполнены правдоподобным текстом, плейсхолдер ID перенесён из шаблона:

```text
## Problem
Пользователи жалуются на долгий вход в систему.

## Functional Requirements
FR-XXX: система ускоряет вход.
```

Правильно:

```text
## Problem
TBD: какую проблему решает feature.

## Functional Requirements
TBD: требования не сформулированы — заполняет skill requirements.
```

## Чеклист

- [ ] Имя директории — kebab-case; директории не существовало до запуска.
- [ ] Созданы ровно три файла: `README.md`, `product.md`, `requirements.md`.
- [ ] Frontmatter каждого полон: `title` на русском, `type`, `status: draft`, `feature`, `version: 0.1`, `owners`.
- [ ] H1 каждого файла совпадает с его `title`.
- [ ] Тело каждой секции — `TBD: <что неизвестно>`; правдоподобного текста нет.
- [ ] Плейсхолдеров `FR-XXX`, `UI-XXX`, `API-XXX` в файлах нет.
- [ ] Таблица Documents ссылается только на созданные файлы.
- [ ] Feature добавлена в «Список features» `docs/features/README.md`.

## Отчёт

```text
Файлы: <созданные пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
Заготовки созданы; TBD в них ожидаемы и находкой review не считаются
Следующий шаг: .gigacode/skills/product-documentation, затем .gigacode/skills/requirements
```
