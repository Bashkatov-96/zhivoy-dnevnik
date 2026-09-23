/* Инструкция Живого дневника — главы и слайды.
   Все строки ниже — наш статический текст, пользовательских данных нет.
   Ссылка на главу: #start, #mysl, #emo, #son, #den, #karta, #podpiska.
   Кнопка «Открыть бота» несёт метку главы: ?start=g_<глава>, по ней бот
   запоминает, какая инструкция привела человека (acquisition.start_payload). */
(() => {
  "use strict";

  const BOT = "https://t.me/livebooks_bot";

  /* ── Мелкие строители экранов ── */
  const moon = (k, size = 70) => {
    const rx = (40 * Math.abs(1 - 2 * k)).toFixed(2);
    return `<svg viewBox="0 0 88 88" width="${size}" height="${size}" aria-hidden="true"><circle cx="44" cy="44" r="40" fill="#fff" opacity=".12"/><path fill="url(#moonG)" d="M44 4A40 40 0 0 1 44 84A${rx} 40 0 0 ${k > 0.5 ? 1 : 0} 44 4Z"/></svg>`;
  };
  const chat = (items) =>
    `<div class="tgbar"><span class="av"><svg><use href="#emblem"/></svg></span><span><b>Живой дневник</b><small>бот</small></span></div>` +
    `<div class="body chat">${items.join("")}</div>`;
  const app = (items) =>
    `<div class="tgbar app"><span class="x">Закрыть</span><span><b>Живой дневник</b><small>мини-приложение</small></span><span class="x">···</span></div>` +
    `<div class="body">${items.join("")}</div>`;
  const bot = (html) => `<div class="msg bot">${html}</div>`;
  const me = (html) => `<div class="msg me">${html}</div>`;
  const kb = (btns, two) =>
    `<div class="kb${two ? " two" : ""}">${btns.map((b) => (b[0] === "!" ? `<span class="hot">${b.slice(1)}</span>` : `<span>${b}</span>`)).join("")}</div>`;
  const head = (small, big) => `<div class="m-h"><small>${small}</small><b>${big}</b></div>`;
  const card = (html) => `<div class="m-card">${html}</div>`;
  const row = (c, ic, title, sub) =>
    `<div class="m-card row" style="--c:${c}"><span class="ic">${ic}</span><span class="tx"><b>${title}</b><span class="mut">${sub}</span></span><span class="chev">›</span></div>`;

  /* ── Главы ── */
  const CHAPTERS = [
    {
      id: "start", name: "Старт", a: "#5B8DEF", bg: "#EEF4FF",
      slides: [
        {
          h: "Дневник, который <em>уже в твоём Telegram</em>",
          p: "Ничего не нужно скачивать и не нужен пароль. Открываешь бота, нажимаешь «Старт» и знакомишься: три коротких вопроса, чтобы бот говорил с тобой по-человечески.",
          tags: [["free", "Бесплатно"], ["", "1 минута"]],
          screen: chat([
            bot('<span class="mut">Шаг 1/3</span><br>Привет! Я твой личный дневник эмоций.<br><br>Как тебя зовут?'),
            me("Аня"),
            bot('<span class="mut">Шаг 2/3</span><br>Сколько тебе лет?'),
          ]),
        },
        {
          h: "Главное меню: <em>всё в четырёх кнопках</em>",
          p: "«Новая запись» открывает мысль, эмоцию или сон. «Дневник» хранит всё, что ты написала. «Как это работает» подскажет, если что-то забудется.",
          tags: [["", "Можно просто писать сообщением"]],
          screen: chat([
            bot("Добрый вечер, Аня 🌙<br>Что сейчас хочется записать?"),
            kb(["!✍️ Новая запись"]),
            kb(["📖 Дневник", "💡 Как это работает"], true),
            kb(["⚙️ Настройки"]),
          ]),
        },
        {
          h: "Два места — <em>одна память</em>",
          p: "Чат с ботом — это тетрадь: пишешь как есть. Мини-приложение — карта: неделя, летопись, сонник и портрет. Оно открывается кнопкой «Карта» у поля ввода.",
          tags: [["", "Запись одна и та же в чате и в приложении"]],
          screen: app([
            head("Обсерватория", "Твоё небо"),
            row("#5B8DEF", '<svg><use href="#emblem"/></svg>', "Личная карта", "Пять зеркал о тебе"),
            row("#F0A93C", "📜", "Летопись мыслей", "Тома по месяцам"),
            row("#A66BFF", "🌙", "Сонник", "Твои ночи"),
            row("#E8788F", "★", "Достижения", "Значки за регулярность"),
          ]),
        },
        { cta: true, h: "Нажми «Старт» — <em>это первый шаг</em>", p: "Дальше бот сам предложит сделать первую запись. После первой мысли или эмоции включатся 3 дня подписки в подарок." },
      ],
    },
    {
      id: "mysl", name: "Мысль", a: "#F0A93C", bg: "#FBF4E8",
      slides: [
        {
          h: "Пишешь как в заметки — <em>получаешь книгу о себе</em>",
          p: "Одной строкой или сплошным потоком, в чате или через «+» в приложении. Бот сам даёт записи заголовок главы и ставит её в нужный день.",
          tags: [["free", "Писать — бесплатно всегда"]],
          screen: chat([
            me("Опять весь вечер прокручивала разговор с начальником. Надо было сказать, что я не успеваю"),
            bot('<span class="ttl">📜 Глава: «Несказанное вслух»</span><span class="mut">ключевое слово · границы</span>'),
            kb(["!Что это значит?"]),
          ]),
        },
        {
          h: "«Что это значит?» — <em>взгляд со стороны</em>",
          p: "Одна кнопка под записью. Бот показывает, что стоит за мыслью и с какими прошлыми днями она перекликается. Без диагнозов, обычно одно наблюдение и один вопрос.",
          tags: [["free", "5 раз в день бесплатно"], ["paid", "10 — с подпиской"]],
          screen: chat([
            me("Надо было сказать, что я не успеваю"),
            bot("«Не успеваю» уже третий раз за неделю звучит рядом с работой. Во вторник было похожее: хотелось отказаться, но ты промолчала.<br><br><b>Что изменилось бы, если сказать это вслух?</b>"),
          ]),
          note: "пример ответа",
        },
        {
          h: "Летопись: <em>тома, главы, дни</em>",
          p: "Месяц за месяцем складывается летопись. У каждой главы видно, сколько дней в ней прожито. Через месяц можно перечитать себя, а не вспоминать.",
          tags: [["paid", "Летопись в приложении — с Компаса"]],
          screen: app([
            head("Летопись твоих мыслей", "Тома"),
            card('<b>Том IX · Сентябрь</b><span class="mut">месяц несказанного · 23 записи · 14 дней</span>'),
            card('<b>Том VIII · Август</b><span class="mut">месяц долгих прогулок · 41 запись · 27 дней</span>'),
            card('<b>Том X · Октябрь</b><span class="mut">глава не начата</span>'),
          ]),
        },
        { cta: true, h: "Напиши одну строку: <em>что сейчас крутится в голове?</em>", p: "Первая мысль сразу включит 3 дня подписки в подарок: попробуешь отклики, итоги дня и разбор сна." },
      ],
    },
    {
      id: "emo", name: "Эмоция", a: "#3FBF7F", bg: "#E9F7F0",
      slides: [
        {
          h: "Назвать чувство <em>за сорок секунд</em>",
          p: "Когда внутри непонятный ком, слова подбирать трудно. Здесь не надо: короткие шаги, по одному вопросу на экран. Начать можно так: «Новая запись» → «Эмоция».",
          tags: [["free", "Бесплатно"], ["", "До трёх эмоций"]],
          screen: app([
            head("Шаг 1 из 5", "Что ты чувствуешь?"),
            `<div class="chips"><span class="on">Тревога</span><span>Радость</span><span class="on">Усталость</span><span>Злость</span><span>Нежность</span><span>Грусть</span></div>`,
            `<div class="drop" aria-hidden="true"></div>`,
          ]),
        },
        {
          h: "Сила и тело — <em>словами, не цифрами</em>",
          p: "Отмечаешь, насколько это сильно и где отзывается в теле. Капля наверху смешивает цвета того, что ты чувствуешь, и растёт вместе с силой.",
          tags: [["", "Шаг про тело можно пропустить"]],
          screen: app([
            head("Шаг 3 из 5", "Насколько сильно?"),
            `<div class="scale"><span>1 · едва теплится</span><span>2 · есть, но тихо</span><span class="on">3 · ощутимо, занимает внимание</span><span>4 · трудно не замечать</span><span>5 · захватывает полностью</span></div>`,
          ]),
        },
        {
          h: "Капля падает <em>в твою неделю</em>",
          p: "Запись сохранена. Под ней одно спокойное наблюдение без оценок. Через несколько дней видно, что повторяется: время, люди, темы.",
          tags: [["paid", "Отклик бота — с подпиской"]],
          screen: app([
            head("Запись сохранена", "Тревога · усталость"),
            card("Третий вечер подряд тревога приходит после девяти. Днём её почти нет.<br><br><b>Что обычно происходит около девяти?</b>"),
            `<div class="week" aria-hidden="true"><i class="dim" style="height:30%"></i><i style="height:62%"></i><i class="dim" style="height:40%"></i><i style="height:78%"></i><i style="height:70%"></i><i class="dim" style="height:24%"></i><i style="height:55%"></i></div>`,
            `<div class="days"><span>пн</span><span>вт</span><span>ср</span><span>чт</span><span>пт</span><span>сб</span><span>вс</span></div>`,
          ]),
          note: "пример наблюдения",
        },
        { cta: true, h: "Отметь, <em>что чувствуешь прямо сейчас</em>", p: "В боте: «✍️ Новая запись» → «Эмоция». Сорок секунд, и неделя начнёт складываться в картину." },
      ],
    },
    {
      id: "son", name: "Сон", a: "#A66BFF", bg: "#F1ECFD",
      slides: [
        {
          h: "Запиши сон, <em>пока он не ускользнул</em>",
          p: "Утром, до ленты и чатов. Целиком или одним кадром: бот сохранит сон в летопись ночей и соберёт его образы.",
          tags: [["free", "1 сон в день — бесплатно"]],
          screen: chat([
            me("Снилась комната за шкафом, о которой никто не знал. Там тихо и светло"),
            bot('<span class="ttl">🌙 Сон сохранён</span>Том «Сентябрь» · седьмая ночь<br><span class="mut">образы: тайная комната · свет · тишина</span>'),
            kb(["!Разобрать сон"]),
          ]),
        },
        {
          h: "Не «к деньгам», <em>а про тебя</em>",
          p: "Карточка сна: образы, атмосфера и один вопрос. Сон можно прочитать пятью взглядами: Юнг, Фрейд, Миллер, народный сонник и современный взгляд. Это приглашение подумать, а не приговор.",
          tags: [["paid", "Разбор: Момент 1, Компас 3, Глубина 7 в неделю"]],
          screen: app([
            head("Карточка сна", "Комната за шкафом"),
            `<div class="chips"><span class="on">тайная комната</span><span>свет</span><span>тишина</span><span>шкаф</span></div>`,
            card('<span class="mut">Юнг</span><br>Неизвестная комната — часть себя, которую ты ещё не обжила.'),
            card("<b>Где в твоих днях не хватает места, куда никто не заходит?</b>"),
          ]),
          note: "пример разбора",
        },
        {
          h: "Эхо дневника: <em>сон ↔ день</em>",
          p: "Бот смотрит записи последних дней. Если ночь перекликается с днём, он покажет эту нить цитатами. Если связи нет, честно промолчит.",
          tags: [["paid", "Сонник в приложении — с Компаса"]],
          screen: app([
            head("Эхо дневника", "Сон нашёл вторник"),
            `<div class="echo">${card('<span class="mut">сон · ночь на четверг</span><br>«Там тихо и светло, никто не знает про эту комнату»')}<div class="link">↕ перекликается</div>${card('<span class="mut">мысль · вторник</span><br>«Хочется места, где никто не дёргает»')}</div>`,
          ]),
          note: "пример",
        },
        {
          h: "Твои ночи — <em>тома с Луной</em>",
          p: "Сны лежат томами по месяцам. Луна тома полнеет с каждой записанной ночью: двенадцать ночей дают полнолуние.",
          tags: [["", "Видно, что снится чаще"]],
          screen: app([
            head("Сонник", "Твои ночи"),
            `<div class="m-card row" style="--c:#A66BFF"><span class="ic" style="background:#2b2350">${moon(0.58, 30)}</span><span class="tx"><b>Том IX · Сентябрь</b><span class="mut">растущая · 7 ночей</span></span></div>`,
            `<div class="m-card row" style="--c:#A66BFF"><span class="ic" style="background:#2b2350">${moon(1, 30)}</span><span class="tx"><b>Том VIII · Август</b><span class="mut">полнолуние · 12 ночей</span></span></div>`,
            `<div class="m-card row" style="--c:#A66BFF"><span class="ic" style="background:#2b2350">${moon(0.25, 30)}</span><span class="tx"><b>Том VII · Июль</b><span class="mut">растущий серп · 3 ночи</span></span></div>`,
          ]),
        },
        { cta: true, h: "Что тебе снилось <em>этой ночью?</em>", p: "Напиши сон боту одной строкой. Совет: сначала запиши одну мысль, тогда включатся 3 дня подписки и сон можно будет разобрать." },
      ],
    },
    {
      id: "den", name: "Утро и вечер", a: "#7B8FF5", bg: "#EFF2FE",
      slides: [
        {
          h: "Три вопроса утром — <em>про ночь</em>",
          p: "Бот сам выбирает спокойный момент и зовёт записать ночь: когда уснула, когда проснулась, просыпалась ли. Длительность сна он посчитает сам.",
          tags: [["free", "Бесплатно"]],
          screen: chat([
            bot('<span class="ttl">🌅 Между сном и днём</span>Ночь ещё рядом. Три коротких ответа, и её можно отпустить до завтра.'),
            kb(["!Записать ночь"]),
            bot('🛏 Когда уснула? <span class="mut">· 1/3</span><br><span class="mut">Цифрами (23:30) или словами</span>'),
            me("около полуночи"),
          ]),
        },
        {
          h: "Вечером — <em>письмо с итогами дня</em>",
          p: "Бот собирает все записи дня: что повторялось, когда стало легче. В конце один вопрос на ночь, а не список советов.",
          tags: [["paid", "С тарифа Компас"]],
          screen: chat([
            bot('<span class="ttl">✉️ Вечернее письмо</span>Сегодня «не успеваю» мелькнуло дважды: утром про работу и вечером про дом. Легче стало днём, после прогулки без телефона.<br><br><b>Что из сегодняшнего можно было не брать на себя?</b>'),
            kb(["Спросить про письмо"]),
          ]),
          note: "пример письма",
        },
        {
          h: "Письмо недели: <em>что повторялось</em>",
          p: "Раз в неделю приходит письмо о семи днях: темы, настроение, что изменилось. Под ним можно задать вопрос, и бот ответит по твоим же записям.",
          tags: [["paid", "С тарифа Компас"]],
          screen: app([
            head("Неделя 15–21 сентября", "Несказанное"),
            `<div class="bars-mini"><div><span>работа</span><s style="--w:82%"></s></div><div><span>дом</span><s style="--w:54%"></s></div><div><span>усталость</span><s style="--w:66%"></s></div><div><span>прогулки</span><s style="--w:30%"></s></div></div>`,
            card("<b>Главное за неделю</b>Труднее всего было в дни, когда ты молчала о сроках. Легче — после прогулок."),
          ]),
          note: "пример",
        },
        { cta: true, h: "Пусть дневник <em>сам напомнит о себе</em>", p: "Сделай первую запись, и завтра утром бот тихо спросит про ночь." },
      ],
    },
    {
      id: "karta", name: "Личная карта", a: "#5B8DEF", bg: "#EEF4FF",
      slides: [
        {
          h: "Утро начинается <em>не с ленты, а с неба</em>",
          p: "Открываешь приложение и сначала видишь свой день: Луну в настоящей фазе, мысль дня и семь столбиков твоей недели.",
          tags: [["", "Кнопка «Карта» у поля ввода"]],
          screen: app([
            `<div class="sky">${moon(0.72)}<small>растущая Луна · среда</small><p>«Замечать — уже половина пути»</p></div>`,
            `<div class="week" aria-hidden="true"><i style="height:44%"></i><i style="height:70%"></i><i class="dim" style="height:28%"></i><i style="height:58%"></i><i class="dim" style="height:18%"></i><i class="dim" style="height:14%"></i><i class="dim" style="height:10%"></i></div>`,
            `<div class="days"><span>пн</span><span>вт</span><span>ср</span><span>чт</span><span>пт</span><span>сб</span><span>вс</span></div>`,
          ]),
        },
        {
          h: "Пять зеркал — <em>портрет без ярлыков</em>",
          p: "Короткие тесты по 5–10 вопросов: тревога, эмоции, мышление и ещё два. Результаты складываются в общий портрет, и бот лучше понимает, как с тобой говорить.",
          tags: [["paid", "Тесты — с тарифа Момент"]],
          screen: app([
            head("Зеркало · 4 из 8", "Когда планы рушатся, я…"),
            `<div class="scale"><span>сразу ищу новый вариант</span><span class="on">сначала злюсь, потом собираюсь</span><span>долго не могу отпустить</span><span>зависит от того, кто рядом</span></div>`,
          ]),
          note: "пример вопроса",
        },
        {
          h: "Значки <em>за то, что возвращаешься</em>",
          p: "Серии дней, первые шаги в новых разделах, пройденные зеркала. Значки открываются сами, их нельзя купить.",
          tags: [["paid", "С тарифа Компас"]],
          screen: app([
            head("Достижения", "Серия · 6 дней"),
            `<div class="badges"><div class="badge"><span class="md">🌱</span>Первая запись</div><div class="badge"><span class="md">🌙</span>Семь ночей</div><div class="badge"><span class="md">🔥</span>Неделя подряд</div><div class="badge"><span class="md">🪞</span>Все зеркала</div><div class="badge lock"><span class="md">📚</span>Том закрыт</div><div class="badge lock"><span class="md">✨</span>30 дней</div></div>`,
          ]),
        },
        { cta: true, h: "Открой свою <em>карту дня</em>", p: "В боте нажми синюю кнопку «Карта» у поля ввода. Гайд и тарифы там открыты без подписки, остальные разделы открываются с тарифом." },
      ],
    },
    {
      id: "podpiska", name: "Подписка", a: "#5B8DEF", bg: "#EEF4FF",
      slides: [
        {
          h: "Писать — <em>бесплатно всегда</em>",
          p: "Мысли, эмоции, сны и летопись в чате не требуют оплаты. Подписка нужна, когда хочется больше: отклик бота, письма, разделы приложения.",
          tags: [["free", "Без карты и пробных списаний"]],
          screen: app([
            head("Бесплатно", "Всегда в чате"),
            row("#3FBF7F", "✍️", "Мысли и эмоции", "Без ограничений"),
            row("#A66BFF", "🌙", "Сон", "Один в день"),
            row("#F0A93C", "💡", "«Что это значит?»", "5 раз в день"),
            row("#3FB2C4", "💬", "Поддержка", "Отвечает человек"),
          ]),
        },
        {
          h: "Три дня — <em>в подарок</em>",
          p: "После первой мысли или записи эмоции включается тариф «Момент» на 3 дня. Ничего не списывается: подарок не требует оплаты и привязки карты.",
          tags: [["free", "Один раз на аккаунт"]],
          screen: chat([
            me("Кажется, я просто очень устала"),
            bot('<span class="ttl">🎁 Три дня Момента — в подарок</span>Попробуй отклики на записи и разбор сна. Потом решишь сама, нужно ли продолжать.'),
          ]),
          note: "пример сообщения",
        },
        {
          h: "Три тарифа <em>на семь дней</em>",
          p: "Оплата звёздами Telegram, прямо в боте или в приложении. Подписка включается сразу после оплаты.",
          tags: [["", "Звёзды Telegram"]],
          screen: app([
            head("Подписка", "На 7 дней"),
            `<div class="plans">${card('<div class="plan"><span><b>Момент</b><span class="mut">Отклики, тесты карты, 1 разбор сна</span></span><span class="pr">299 ₽</span></div>')}${'<div class="m-card plan best"><span><b>Компас</b><span class="mut">Все разделы, письма, голос, 3 разбора</span></span><span class="pr">599 ₽</span></div>'}${card('<div class="plan"><span><b>Глубина</b><span class="mut">Всё из Компаса и свободный диалог</span></span><span class="pr">799 ₽</span></div>')}</div>`,
          ]),
        },
        {
          h: "Честно: <em>чего здесь нет</em>",
          p: "Нет диагнозов, гаданий и психолога в личке. Записи не публикуются, их не видят другие люди. Данные хранятся на сервере в России. Если сейчас очень тяжело, позвони на телефон доверия 8-800-2000-122: бесплатно и круглосуточно.",
          tags: [["", "Не замена терапии"]],
          screen: app([
            head("Поддержка", "Написать человеку"),
            card("Выбираешь тему, пишешь своими словами. Ответ придёт в чат с ботом, обычно в течение дня."),
            card('<span class="mut">Мы видим только текст обращения. Записи дневника к нему не прикладываются.</span>'),
          ]),
        },
        { cta: true, h: "Начни бесплатно — <em>реши потом</em>", p: "Сначала попиши несколько дней. Подписка нужна, только если захочется глубже." },
      ],
    },
  ];

  /* ── Живые экраны ──
     Подсвеченная кнопка в телефоне нажимается: бот «печатает» и отвечает
     следующим сообщением, как в настоящем чате. Ключ — «глава-номер
     слайда» (с нуля); финал главы отвечает на «Старт». Чипы эмоций
     переключаются. Так макет перестаёт быть картинкой. */
  const DEMOS = {
    "start-1": [bot("Что записать?"), kb(["💭 Мысль", "🎭 Эмоция", "🌙 Сон"], false)],
    "mysl-0": [bot("Похоже, дело не в начальнике, а в том, что «не успеваю» так и осталось несказанным.<br><br><b>Что было бы, если сказать это завтра одной фразой?</b>")],
    "son-0": [bot('<span class="ttl">🔮 Отклик на сон</span>Тайная комната — часть себя, которую ты ещё не обжила. Тишина там не пугает, а зовёт.<br><span class="mut">ключи · отклик · нити</span>')],
    "den-0": [bot('Во сколько проснулась? <span class="mut">2/3</span>'), me("в 7:40")],
    cta: [bot("Рад знакомству! Как тебя зовут?")],
  };

  /* ── Состояние и DOM ── */
  const $ = (id) => document.getElementById(id);
  const stage = $("stage");
  const bars = $("bars");
  const chips = $("chapters");
  const prevBtn = $("prev");
  const nextBtn = $("next");
  const hint = $("hint");
  const ctaTop = $("ctaTop");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ci = 0;
  let si = 0;

  chips.innerHTML = CHAPTERS.map(
    (c) => `<a class="chip" href="#${c.id}" data-ch="${c.id}" style="--c:${c.a}"><i></i>${c.name}</a>`
  ).join("");

  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function slideHtml(ch, s, n, total) {
    const eyebrow = `<p class="eyebrow">${ch.name} <b>· ${n} из ${total}</b></p>`;
    if (s.cta) {
      const next = CHAPTERS[(CHAPTERS.indexOf(ch) + 1) % CHAPTERS.length];
      const nextLabel = next.id === "start" ? "К началу инструкции" : `Дальше: ${next.name} →`;
      return `<article class="slide cta-slide">
        <div class="copy">
          ${eyebrow}
          <h1>${s.h}</h1>
          <p class="lead">${s.p}</p>
          <div class="cta-row">
            <a class="btn-bot" href="${BOT}?start=g_${ch.id}" target="_blank" rel="noopener">Открыть бота ${arrow}</a>
            <a class="btn-next" href="#${next.id}">${nextLabel}</a>
          </div>
          <p class="fine">@livebooks_bot · записи бесплатно</p>
        </div>
        <div class="device"><div class="screen" style="--sa:${ch.a};--sbg:${ch.bg}"><span class="island"></span><div class="sbar"><span>9:41</span><i></i></div>${chat([
          bot("Привет! Я твой личный дневник эмоций."),
          kb(["!Старт"]),
        ])}</div></div>
      </article>`;
    }
    const tags = (s.tags || []).map(([k, t]) => `<li class="${k}">${t}</li>`).join("");
    const note = s.note ? `<p class="fine">На экране ${s.note}. У тебя будет свой.</p>` : "";
    return `<article class="slide">
      <div class="copy">
        ${eyebrow}
        <h1>${s.h}</h1>
        <p class="lead">${s.p}</p>
        ${tags ? `<ul class="tags">${tags}</ul>` : ""}
        ${note}
      </div>
      <div class="device"><div class="screen" style="--sa:${ch.a};--sbg:${ch.bg}"><span class="island"></span><div class="sbar"><span>9:41</span><i></i></div>${s.screen}</div></div>
    </article>`;
  }

  function render(animate = true) {
    const ch = CHAPTERS[ci];
    const s = ch.slides[si];
    const total = ch.slides.length;
    document.documentElement.style.setProperty("--bg", ch.bg);
    document.documentElement.style.setProperty("--a", ch.a);
    if (themeMeta) themeMeta.setAttribute("content", ch.bg);
    stage.innerHTML = slideHtml(ch, s, si + 1, total);
    stage.scrollTop = 0;
    const el = stage.firstElementChild;
    if (animate && !reduce) el.classList.add("enter");
    wireScreen(el, s.cta ? DEMOS.cta : DEMOS[ch.id + "-" + si]);

    bars.innerHTML = ch.slides.map((_, i) => `<span class="${i < si ? "done" : i === si ? "now" : ""}"></span>`).join("");
    chips.querySelectorAll(".chip").forEach((c) => {
      const on = c.dataset.ch === ch.id;
      c.setAttribute("aria-current", on ? "true" : "false");
      if (on) c.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    });
    ctaTop.href = `${BOT}?start=g_${ch.id}`;
    prevBtn.disabled = ci === 0 && si === 0;
    const last = ci === CHAPTERS.length - 1 && si === total - 1;
    nextBtn.disabled = last;
    hint.textContent = s.cta ? "Глава пройдена" : si === 0 ? "Листай или нажми →" : `${ch.name} · ${si + 1} из ${total}`;
  }

  function wireScreen(slide, demo) {
    const body = slide.querySelector(".body");
    if (body && body.classList.contains("chat")) body.scrollTop = body.scrollHeight;
    slide.querySelectorAll(".chips span").forEach((c) => {
      c.setAttribute("role", "button");
      c.addEventListener("click", () => c.classList.toggle("on"));
    });
    const hot = slide.querySelector(".kb .hot");
    if (!hot || !demo || !body) return;
    hot.classList.add("tap-me");
    hot.setAttribute("role", "button");
    hot.setAttribute("tabindex", "0");
    let used = false;
    const play = () => {
      if (used) return;
      used = true;
      hot.classList.remove("tap-me");
      const tipEl = slide.querySelector(".tap-tip");
      if (tipEl) tipEl.remove();
      hot.classList.add("pressed");
      const typing = document.createElement("div");
      typing.className = "msg bot typing";
      typing.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        typing.remove();
        demo.forEach((html, i) => setTimeout(() => {
          body.insertAdjacentHTML("beforeend", html);
          const last = body.lastElementChild;
          if (last && !reduce) last.classList.add("pop");
          body.scrollTo({ top: body.scrollHeight, behavior: reduce ? "auto" : "smooth" });
        }, i * 380));
      }, reduce ? 0 : 750);
    };
    hot.addEventListener("click", play);
    hot.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
    const tip = slide.querySelector(".device");
    if (tip) tip.insertAdjacentHTML("beforeend", '<span class="tap-tip">нажми на кнопку в телефоне</span>');
  }

  function go(dir) {
    const ch = CHAPTERS[ci];
    if (dir > 0) {
      if (si < ch.slides.length - 1) si++;
      else if (ci < CHAPTERS.length - 1) { ci++; si = 0; }
      else return;
    } else {
      if (si > 0) si--;
      else if (ci > 0) { ci--; si = CHAPTERS[ci].slides.length - 1; }
      else return;
    }
    syncHash();
    render();
  }

  // Якорь: #son — начало главы, #son-3 — третий слайд главы.
  function syncHash() {
    const id = CHAPTERS[ci].id + (si ? `-${si + 1}` : "");
    if (location.hash.slice(1) !== id) history.replaceState(null, "", `#${id}`);
  }
  function fromHash() {
    const m = /^([a-z]+)(?:-(\d+))?$/.exec(location.hash.slice(1));
    const idx = m ? CHAPTERS.findIndex((c) => c.id === m[1]) : -1;
    if (idx < 0) return false;
    ci = idx;
    si = Math.min(Math.max((Number(m[2]) || 1) - 1, 0), CHAPTERS[idx].slides.length - 1);
    return true;
  }

  window.addEventListener("hashchange", () => { if (fromHash()) render(); });
  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
  });

  // Свайп по сцене, как в историях: влево — дальше, вправо — назад.
  let sx = 0, sy = 0, st = 0;
  stage.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY; st = Date.now();
  }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 700) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  fromHash();
  syncHash();
  render();
})();
