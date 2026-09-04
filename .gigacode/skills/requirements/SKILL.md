---
name: requirements
description: Создаёт и изменяет requirements.md feature — формализует product.md в FR/BR/NFR, constraints и acceptance criteria со стабильными ID. Триггеры — «формализуй требования», «добавь/измени FR, BR, NFR», «acceptance criteria», «пометь требование deprecated». Вход — готовый product.md. Не для проблемы и сценариев (product-documentation), интерфейса (ui-requirements), API (api-requirements), реализации (technical-documentation).
---

# Skill: requirements

## Когда использовать

Создать или изменить `docs/features/<feature>/requirements.md` — превратить `product.md` в атомарные, однозначные, проверяемые требования со стабильными ID, без выбора технологий и без пересказа `product.md`. Поводы: готов `product.md`; добавить, изменить или пометить deprecated требование; стадия requirements оркестратора. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| `product.md` feature существует | Стоп. Ответ: «Сначала product.md — skill `product-documentation`». |
| Документ не `approved`, либо правка MINOR, либо apply утверждённого change proposal | Стоп. Ответ: «Содержательное изменение approved-документа — через `change-management`». |

## Прочитать

1. Обязательно: `product.md` feature целиком; [rules/requirements.md](../../../rules/requirements.md); [schemas/README.md](../../../schemas/README.md) и [requirement.schema.yaml](../../../schemas/requirement.schema.yaml) — ID, frontmatter, структура требования. Остальные `rules/` — по AGENTS.md.
2. Если есть: текущий `requirements.md` целиком, включая deprecated (они занимают номера); `ui.md`, `api/`, `technical.md` — изменение требований их затрагивает.
3. Глобальный контекст: [business-rules.md](../../../docs/product/business-rules.md), [non-functional-requirements.md](../../../docs/product/non-functional-requirements.md), [glossary.md](../../../docs/product/glossary.md) — ссылаться на существующие BR/NFR.

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из `product.md`, `docs/product/` или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; существующие ID не менять и не переиспользовать.

1. Каждый пункт — ровно один тип: FR (что делает система), BR (правило бизнеса, верно даже при выключенной системе), NFR (качество с числом или критерием), Constraint (внешнее ограничение — закон, платформа, legacy; система не может его ни выполнить, ни нарушить; без ID), Acceptance Criterion (проверка FR/BR; без ID).
2. Нет измеримого критерия — это не NFR: найти критерий или поставить `TBD` внутри формулировки.
3. Формат: `FR-001: <кто> может/должен <что> [при каких условиях].` — одно предложение, понятное без соседних.
4. Один пункт — одно требование, проверяемое тестом: «и/или», «а также» между независимыми действиями → отдельные ID.
5. «Быстро», «удобно», «корректно», «интуитивно», «нормально», «оптимально» — только с измеримым определением (`rules/writing.md`).
6. Новый ID = наибольший номер этого типа в feature (включая deprecated) + 1; пропуски не заполнять.
7. Изменение формулировки сохраняет ID; перенумерации нет. Удаление = пометка `deprecated` с причиной и заменяющим ID.
8. Глобальные BR/NFR не копировать — ссылаться по ID на `docs/product/`. Одно требование живёт в одном файле.
9. Acceptance criterion ссылается на FR/BR, пригоден тестировщику без уточнений, без экранов и кнопок (уровень `ui.md`).
10. Негативные сценарии — только из `product.md`; отсутствующие там — предложить в Open Questions, не в FR.
11. Новый документ — `type: requirements`, `status: draft`. Существующий — минимальная правка; `version`: MINOR без изменения смысла, MAJOR при новых или изменённых требованиях; `approved` после правки → `review`.

## Шаги

1. Пройти Scope, сценарии и Expected behaviour `product.md`: пункт scope и сценарий → FR; правило бизнеса → BR; качество → NFR; внешнее ограничение → Constraints. Нельзя формализовать без выдумывания — `TBD` в формулировке или Open Questions.
2. Присвоить ID (правило 6); проверить каждый пункт по правилам 1–5.
3. Для каждого FR/BR написать `AC для FR-001: Given … When … Then …`, включая негативные пути из `product.md`.
4. Собрать все `TBD` и `ASSUMPTION` в Open Questions; заполнить Dependencies и Constraints.
5. Новый документ — из [templates/requirements.md](../../../templates/requirements.md): все секции, неприменимые — `Not applicable: <причина>`; Context — 2–3 предложения со ссылкой на `product.md`; комментарии `<!-- AI: -->` выполнить и удалить.
6. Заполнить Traceability: строка на каждый ID, включая deprecated; источник — сценарий или пункт scope `product.md`, либо BR; колонка «Покрыто» у новой feature пустая — это нормально.
7. Если изменён существующий ID: `grep -rn "FR-007" docs/` → обновить затронутые UI/API/technical или пометить конфликт `TBD`/`ASSUMPTION` → обновить их Traceability. Связанные документы молча не переписывать.
8. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — склейка двух требований, неизмеримое слово, выдуманное число:

```text
FR-005: Пользователь может запросить код по SMS, ввести его, и система должна работать быстро.
BR-002: Повторная отправка OTP — не чаще раза в 60 секунд.
```

Правильно:

```text
FR-005: Пользователь может запросить код подтверждения на свой номер телефона.
FR-006: Пользователь может подтвердить операцию вводом полученного кода.
NFR-003: Код подтверждения доставляется в течение TBD: целевое время доставки.
BR-002: Повторная отправка OTP допускается только после истечения интервала повторной отправки. TBD: длительность интервала.
```

## Чеклист

- [ ] Каждый пункт — один тип; constraints не оформлены как FR, acceptance criteria — не как требования.
- [ ] Каждое требование атомарно, проверяемо, без запрещённых слов.
- [ ] Каждое требование прослеживается к `product.md`, `docs/product/` или словам человека; глобальные BR/NFR — ссылки, не копии.
- [ ] Каждый `ASSUMPTION` — с `Requires confirmation.`; ни один не записан как факт.
- [ ] Каждый acceptance criterion ссылается на FR/BR; у каждого FR/BR есть criterion или `TBD`.
- [ ] Каждая секция шаблона заполнена или помечена `Not applicable: <причина>`; незаполнимое содержит `TBD`, не выдуманный текст.
- [ ] Traceability содержит все ID, включая deprecated.
- [ ] `node scripts/validate-docs.mjs` — exit 0.

## Отчёт

```text
Файлы: <созданные/изменённые пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
FR/BR без acceptance criteria: <ID или none>
Следующий шаг: .gigacode/skills/ui-requirements и/или .gigacode/skills/api-requirements, затем .gigacode/skills/documentation-review
```
