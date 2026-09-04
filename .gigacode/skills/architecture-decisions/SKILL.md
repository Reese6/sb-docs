---
name: architecture-decisions
description: Создаёт и изменяет ADR — контекст, решение, альтернативы, последствия; глобальные в docs/architecture/adr/, feature-специфичные в docs/features/<name>/decisions/. Триггеры — «оформи ADR», «зафиксируй архитектурное решение», «альтернативы», «supersede», кандидат на ADR из technical.md. Вход — требования и существующие ADR. Не для реализации (technical-documentation), требований (requirements) и рядовых решений — им место в Alternatives technical.md.
---

# Skill: architecture-decisions

## Когда использовать

Создать или изменить ADR — запись важного архитектурного решения и его WHY: почему именно так, какие альтернативы рассмотрены, чего это стоит. Реализация (HOW) остаётся в `technical.md`. Поводы: существенный выбор сделан или предстоит; `technical-documentation` пометил кандидата в Alternatives; решение пересматривается (supersede); просят оформить или обновить ADR. Остальные документы — другие skills (AGENTS.md, «Как определить нужный skill»).

## Вход и стоп-условия

| Проверка | Если не выполнено |
|----------|-------------------|
| Прочитаны существующие ADR своей области и связанные требования | Стоп: ADR «из головы» не создаётся. Сначала «Прочитать». |
| Решение проходит хотя бы один весомый критерий: существенно влияет на архитектуру; сложно изменить; есть несколько разумных альтернатив; создаёт важные ограничения; важно будущим разработчикам | Стоп. Ответ: «ADR не нужен: решению место в Alternatives technical.md или в комментарии к коду». |
| Изменяемый ADR не `accepted`, либо это пересмотр через новый ADR (supersede) | Стоп. Ответ: «Принятый ADR неизменяем — пересмотр оформляется новым ADR». |

## Прочитать

1. Обязательно: существующие ADR — глобальные в [docs/architecture/adr/](../../../docs/architecture/adr/README.md), для feature — `docs/features/<feature>/decisions/`; требования, обосновывающие решение — `requirements.md` feature и/или [business-rules.md](../../../docs/product/business-rules.md), [non-functional-requirements.md](../../../docs/product/non-functional-requirements.md); [schemas/README.md](../../../schemas/README.md) — ID и статусы ADR. Правила — по AGENTS.md.
2. Если есть: `technical.md` feature — контекст решения и уже рассмотренные альтернативы.
3. Архитектурный контекст: [overview.md](../../../docs/architecture/overview.md), [components.md](../../../docs/architecture/components.md), [data-model/](../../../docs/architecture/data-model/README.md), [integrations.md](../../../docs/architecture/integrations.md) — имена компонентов и сущностей брать оттуда.

## Правила

Общие — AGENTS.md, `rules/ai-guardrails.md`. Ядро: текст документа, `title` и H1 — русский (заголовки секций — дословно по шаблону; ID, статусы, `TBD`/`ASSUMPTION` — английские); факт — без пометки, только из требований, кода, `docs/architecture/` или слов человека; неизвестное — `TBD: <что неизвестно>`; предположение — `ASSUMPTION: <текст>. Requires confirmation.`; существующие ID не менять и не переиспользовать.

1. Размещение: решение затрагивает несколько features или систему целиком — `docs/architecture/adr/`, frontmatter без `feature`; одну feature — `docs/features/<feature>/decisions/` с `feature: <feature-name>` (директорию создать при первом ADR). Нумерация глобальных ADR и ADR каждой feature независима.
2. Новый ID = наибольший `ADR-XXX` в своей области (включая deprecated) + 1; пропуски не заполнять. Формат — три цифры с ведущими нулями, после 999 — четыре.
3. Имя файла `adr-XXX-<short-kebab-title>.md`; H1 — `# ADR-XXX: <Название решения>` (по H1 валидатор определяет ID); frontmatter `title: ADR-XXX <Название решения>` без двоеточия, `type: adr`.
4. Один ADR — одно решение. Два решения — два ADR.
5. Context — факты, не мнения: проблема, силы, ограничения, ссылки на требования. Decision — в активной форме: «Мы будем использовать X для Y».
6. Alternatives — минимум одна реально рассмотренная альтернатива с причиной отклонения. Consequences — положительные, отрицательные и нейтральные: у каждого решения есть цена.
7. Два статуса: frontmatter `status` — документ (`draft` у нового; `approved` ставит человек); секция Status — решение, ровно одно из `proposed`, `accepted`, `deprecated`, `superseded`, `rejected` (`proposed` у нового; `accepted`/`rejected` ставит человек).
8. Принятый ADR неизменяем по существу. Пересмотр = новый ADR с двусторонней ссылкой: в старом — Status `superseded` и строка «superseded by ADR-YYY» в Related ADR со ссылкой на файл; в новом — «supersedes ADR-XXX» в Related ADR со ссылкой. `deprecated` без замены — причина в Related ADR или Consequences.
9. Related requirements — только ID со ссылками на файлы-источники, направление `ADR-003 → NFR-002`; формулировки не копировать.
10. Новый ADR не противоречит принятым молча: конфликт решается через supersede.

## Шаги

1. Проверить решение по критериям (стоп-условия); определить scope и размещение (правило 1).
2. Присвоить ID и имя файла (правила 2–3).
3. Написать ADR из [templates/adr.md](../../../templates/adr.md): все секции (Status, Context, Decision, Alternatives, Consequences, Related requirements, Related ADR); комментарии `<!-- AI: -->` выполнить и удалить.
4. Если supersede: обновить старый ADR по правилу 8.
5. Если ADR глобальный: добавить его в «Список ADR» в [docs/architecture/adr/README.md](../../../docs/architecture/adr/README.md) (при первом ADR снять там `TBD`).
6. Если решение затрагивает утверждённый `technical.md`: не переписывать; предложить обновление через skill `technical-documentation`.
7. Запустить `node scripts/validate-docs.mjs`; добиться exit 0.

## Примеры

Неправильно — констатация без альтернатив, мнение вместо факта, выдуманное число:

```text
Decision: Используем Kafka, потому что это лучшая практика. Пропускная способность — 10 000 сообщений в секунду.
Alternatives: Не рассматривались.
```

Правильно:

```text
Decision: Мы будем публиковать события отправки OTP через брокер сообщений (NFR-001).
Alternatives: Синхронный вызов сервиса уведомлений — отклонён: недоступность уведомлений блокирует восстановление пароля.
Consequences: Плюс — отправка не блокирует сценарий. Минус — отложенная доставка. TBD: допустимая задержка доставки.
```

## Чеклист

- [ ] Решение проверено по критериям; мелочь на ADR не оформлена.
- [ ] Размещение и область ID соответствуют scope; ID следующий в своей области; имя файла и H1 по правилу 3.
- [ ] Один ADR — одно решение; Alternatives содержит минимум одну альтернативу; Consequences — не только плюсы.
- [ ] Статус решения нового ADR — `proposed`, frontmatter `status: draft`; `accepted`/`approved` не выставлены.
- [ ] При supersede ссылка двусторонняя: «superseded by» в старом, «supersedes» в новом.
- [ ] Related requirements — только ID со ссылками.
- [ ] Глобальный ADR добавлен в список `docs/architecture/adr/README.md`.
- [ ] Ни одного выдуманного имени, числа или факта; каждый `ASSUMPTION` — с `Requires confirmation.`

## Отчёт

```text
Файлы: <созданные/изменённые пути>
ASSUMPTION (ждут подтверждения): <список или none>
TBD (ждут ответа): <список или none>
Заменённые ADR (supersede): <ADR-XXX → ADR-YYY или none>; статусы accepted/rejected выставляет человек
Следующий шаг: .gigacode/skills/documentation-review; при затронутой реализации — .gigacode/skills/technical-documentation
```
