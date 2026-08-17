---
name: architecture-decisions
description: Фиксация важного архитектурного решения и его WHY в виде ADR (Architecture Decision Record) — контекст, решение, альтернативы, последствия; глобальные — в docs/architecture/adr/, feature-специфичные — в docs/features/<name>/decisions/. Использовать, когда решение существенно влияет на архитектуру, его сложно изменить, есть несколько разумных альтернатив. Не использовать для описания реализации (technical), формализации требований (requirements) или рядовых решений, которым место в Alternatives technical.md.
---

# Skill: architecture-decisions

Создаёт и изменяет ADR — записи важных архитектурных решений:

- глобальные (несколько features или система целиком) — `docs/architecture/adr/`;
- feature-специфичные — `docs/features/<feature-name>/decisions/` (директория создаётся при первом ADR — [schemas/feature.schema.yaml](../../schemas/feature.schema.yaml)).

ADR отвечает на WHY: почему принято именно это решение, какие альтернативы рассмотрены и чего оно стоит. Реализация решения (HOW) остаётся в `technical.md`.

## Когда использовать

- Существенный архитектурный выбор сделан или предстоит — его нужно зафиксировать с альтернативами и последствиями.
- `skills/technical-documentation` пометил выбор в Alternatives как кандидата на ADR.
- Принятое решение пересматривается — нужен новый ADR, заменяющий старый (supersede).
- Пользователь просит оформить или обновить ADR.

## Когда не использовать

| Задача | Правильный skill |
|--------|------------------|
| Описать проблему, пользователей, сценарии, scope | `skills/product-documentation` |
| Формализовать требования (FR/BR/NFR) | `skills/requirements` |
| Описать поведение интерфейса | `skills/ui-requirements` |
| Описать контракт API | `skills/api-requirements` |
| Описать реализацию решения | `skills/technical-documentation` |
| Проверить существующую документацию | `skills/documentation-review` |

## Процесс

Шаги 1–2 — обязательная подготовка. ADR «из головы», без прочтения существующих ADR и связанных требований, не создаётся.

### Шаг 1. Прочитать контекст

До любых правок прочитать:

1. [rules/ai-guardrails.md](../../rules/ai-guardrails.md) — обязательный документ защиты от галлюцинаций; также [rules/writing.md](../../rules/writing.md), [rules/linking.md](../../rules/linking.md), [rules/terminology.md](../../rules/terminology.md).
2. Стандарт ID и frontmatter: [schemas/README.md](../../schemas/README.md).
3. Существующие ADR: глобальные в [docs/architecture/adr/](../../docs/architecture/adr/README.md) и, для feature-решения, `docs/features/<feature-name>/decisions/`. Новый ADR не должен молча противоречить принятым; конфликт решается через supersede (шаг 6), не игнорированием.
4. Требования, обосновывающие решение: `requirements.md` feature и/или глобальные [docs/product/business-rules.md](../../docs/product/business-rules.md), [docs/product/non-functional-requirements.md](../../docs/product/non-functional-requirements.md) — ADR ссылается на конкретные ID.
5. Архитектурный контекст: [docs/architecture/overview.md](../../docs/architecture/overview.md), [docs/architecture/components.md](../../docs/architecture/components.md), [docs/architecture/data-model.md](../../docs/architecture/data-model.md), [docs/architecture/integrations.md](../../docs/architecture/integrations.md) — имена компонентов и сущностей брать оттуда.
6. `technical.md` feature (если есть) — контекст решения и уже рассмотренные альтернативы.

### Шаг 2. Проверить, заслуживает ли решение ADR

ADR нужен, если решение:

1. существенно влияет на архитектуру;
2. сложно изменить;
3. имеет несколько разумных альтернатив;
4. создаёт важные ограничения;
5. важно понимать будущим разработчикам.

Не создавать ADR на каждую мелочь. Достаточно одного-двух выполненных критериев, если они весомы; если не выполнен ни один — ADR не нужен: решению место в секции Alternatives `technical.md` или в комментарии к коду. В этом случае так и сообщить пользователю, ADR не создавать.

### Шаг 3. Определить scope и размещение

- Решение затрагивает несколько features или систему целиком — глобальный ADR в `docs/architecture/adr/`; frontmatter без поля `feature`.
- Решение живёт в рамках одной feature — `docs/features/<feature-name>/decisions/`; frontmatter с `feature: <feature-name>`. Директории нет — создать (появляется при первом ADR).
- Scope определяет область уникальности ID ([schemas/README.md](../../schemas/README.md)): нумерация глобальных ADR и ADR каждой feature независимы.

### Шаг 4. Присвоить ID и имя файла

- Найти максимальный существующий номер `ADR-XXX` в своей области — включая deprecated — и взять следующий. Deprecated-номера не переиспользуются, пропуски не заполняются.
- Формат ID: `ADR-XXX` (три цифры с ведущими нулями, после 999 — четыре).
- Имя файла: `adr-XXX-<short-kebab-title>.md`, например `adr-001-event-driven-notifications.md`.

### Шаг 5. Написать ADR по шаблону

- Строго по [templates/adr.md](../../templates/adr.md), включая все секции: Status, Context, Decision, Alternatives, Consequences, Related requirements, Related ADR — и YAML frontmatter (`type: adr`).
- Одно решение — один ADR. Два решения — два ADR.
- Context — факты, не мнения: проблема, силы, ограничения, ссылки на требования.
- Decision — в активной форме: «Мы будем использовать X для Y».
- Alternatives — минимум одна реально рассмотренная альтернатива с причиной отклонения; без альтернатив это не решение, а констатация.
- Consequences — и положительные, и отрицательные, и нейтральные: у каждого решения есть цена; перечислить её честно.
- Не выдумывать ([rules/ai-guardrails.md](../../rules/ai-guardrails.md)): числа, имена компонентов и факты — только из требований, кода, `docs/architecture/` или от человека; иначе `TBD` или `ASSUMPTION: ... Requires confirmation.`
- Различать два статуса: frontmatter `status` — жизненный цикл документа (`draft` у нового; `approved` выставляет только человек), секция Status в теле — жизненный цикл решения (шаг 6, у нового — `proposed`).

### Шаг 6. Жизненный цикл решения

Статусы в секции Status (ровно эти пять):

```text
proposed
accepted
deprecated
superseded
rejected
```

- Новый ADR — `proposed`. Переводы `accepted` / `rejected` делает человек, не skill.
- ADR неизменяем после принятия: `accepted` ADR не редактируется по существу. Пересмотр решения = новый ADR, заменяющий старый.
- При замене — **двусторонняя ссылка**, обе стороны обязательны:
  - в старом ADR: статус `superseded` и в Related ADR строка «superseded by ADR-YYY» со ссылкой на файл;
  - в новом ADR: в Related ADR строка «supersedes ADR-XXX» со ссылкой на файл.
- `deprecated` — решение утратило актуальность без замены; причину указать в Related ADR или Consequences.

### Шаг 7. Traceability и ссылки

- Related requirements — только ID со ссылками на файлы-источники, направление от решения к требованию: `ADR-003 → NFR-002`. Формулировки требований не копировать ([rules/linking.md](../../rules/linking.md)).
- Глобальный ADR — добавить его в «Список ADR» в [docs/architecture/adr/README.md](../../docs/architecture/adr/README.md) (при первом ADR снять там `TBD`).
- Решение затрагивает утверждённый `technical.md` — не переписывать его молча: предложить обновление через `skills/technical-documentation`.

### Шаг 8. Проверить результат

Перед завершением пройти чеклист:

- [ ] Подготовка выполнена: прочитаны существующие ADR своей области и связанные требования; новый ADR не противоречит принятым молча.
- [ ] Решение проверено по 5 критериям шага 2; мелочь на ADR не оформлена.
- [ ] Размещение и область ID соответствуют scope (глобальный vs feature).
- [ ] ID и имя файла — по стандарту: `ADR-XXX`, `adr-XXX-<short-kebab-title>.md`, номер следующий в своей области.
- [ ] Все секции шаблона присутствуют; Alternatives содержит минимум одну альтернативу; Consequences — не только плюсы.
- [ ] Один ADR — одно решение.
- [ ] Статус решения нового ADR — `proposed`; frontmatter — `status: draft`; `accepted`/`approved` не выставлены самовольно.
- [ ] При supersede ссылка двусторонняя: «superseded by» в старом, «supersedes» в новом.
- [ ] Related requirements — только ID со ссылками (`ADR-XXX → NFR-YYY`).
- [ ] Глобальный ADR добавлен в список [docs/architecture/adr/README.md](../../docs/architecture/adr/README.md).
- [ ] Ни одного выдуманного имени, числа или факта; `ASSUMPTION` не записан как факт.
- [ ] Frontmatter валиден по [schemas/README.md](../../schemas/README.md).

Завершая работу, сообщить пользователю: созданные/изменённые файлы, список `ASSUMPTION` (ждут подтверждения) и `TBD` (ждут ответа), какие ADR заменены (supersede), напоминание, что статусы `accepted`/`rejected` выставляет человек, и рекомендуемый следующий шаг (обычно `skills/documentation-review`; при затронутой реализации — `skills/technical-documentation`).
