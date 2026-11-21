// words.js: sentence types and sentences for grades 3-4.
// Format and rules: specs/006-sentence-purpose/contracts/sentence-entry.md
// Approved by the owner on 2026-11-21 (T021). New sentences need owner approval before release.
// Only sentences with one clear type are listed; arguable ones are left out on purpose.
globalThis.SENTENCE_TYPES = [
  { id: "statement",   label: "съобщително",   reason: "Съобщава нещо.",                   marks: ["."] },
  { id: "question",    label: "въпросително",  reason: "Пита за нещо.",                    marks: ["?"] },
  { id: "request",     label: "подбудително",  reason: "Подканва някого да направи нещо.", marks: ["!", "."] },
  { id: "exclamation", label: "възклицателно", reason: "Изразява силно чувство.",          marks: ["!"] }
];

globalThis.SENTENCE_ENTRIES = [
  // Statements
  { text: "Днес отиваме на излет в планината.", type: "statement" },
  { text: "Баба пече вкусна питка.", type: "statement" },
  { text: "Котката спи на дивана.", type: "statement" },
  { text: "Слънцето грее високо в небето.", type: "statement" },
  { text: "Утре имаме час по математика.", type: "statement" },
  { text: "Брат ми чете интересна книга.", type: "statement" },
  { text: "През есента листата падат от дърветата.", type: "statement" },
  { text: "В двора цъфтят жълти нарциси.", type: "statement" },
  { text: "Мама приготвя вечеря в кухнята.", type: "statement" },
  { text: "Децата играят на площадката.", type: "statement" },
  { text: "През зимата в планината вали много сняг.", type: "statement" },
  { text: "Реката тече покрай нашето село.", type: "statement" },

  // Questions
  { text: "Кога започва първият час?", type: "question" },
  { text: "Къде е моята чанта?", type: "question" },
  { text: "Ще дойдеш ли на рождения ми ден?", type: "question" },
  { text: "Как се казва твоят приятел?", type: "question" },
  { text: "Колко ябълки има в кошницата?", type: "question" },
  { text: "Защо небето е синьо?", type: "question" },
  { text: "Имаш ли домашен любимец?", type: "question" },
  { text: "Кой е написал тази приказка?", type: "question" },
  { text: "Обичаш ли сладолед?", type: "question" },
  { text: "Какво ще ядем за обяд?", type: "question" },
  { text: "Харесва ли ти новото училище?", type: "question" },
  { text: "Откъде идва дъждът?", type: "question" },

  // Requests (commands and "Моля, ...")
  { text: "Моля, седни на мястото си.", type: "request" },
  { text: "Затвори вратата, моля!", type: "request" },
  { text: "Подай ми молива, моля.", type: "request" },
  { text: "Измий си ръцете преди вечеря!", type: "request" },
  { text: "Прочети текста на глас.", type: "request" },
  { text: "Отвори тетрадките си на страница десет.", type: "request" },
  { text: "Моля, говорете по-тихо.", type: "request" },
  { text: "Донеси ми чаша вода, моля.", type: "request" },
  { text: "Не тичайте по коридора!", type: "request" },
  { text: "Подредете играчките в кутията.", type: "request" },
  { text: "Моля, изчакай своя ред.", type: "request" },
  { text: "Помогни на малкия си брат, моля.", type: "request" },

  // Exclamations ("Колко ...!", "Какъв/Каква/Какво ...!")
  { text: "Колко е красиво навън!", type: "exclamation" },
  { text: "Какъв чудесен ден!", type: "exclamation" },
  { text: "Колко голяма е тази дъга!", type: "exclamation" },
  { text: "Какъв вкусен сладолед!", type: "exclamation" },
  { text: "Каква хубава рокля имаш!", type: "exclamation" },
  { text: "Колко се радвам на пролетта!", type: "exclamation" },
  { text: "Какво голямо кученце!", type: "exclamation" },
  { text: "Колко бързо расте това дърво!", type: "exclamation" },
  { text: "Каква чудесна изненада!", type: "exclamation" },
  { text: "Колко е шумно в залата!", type: "exclamation" },
  { text: "Какъв прекрасен подарък!", type: "exclamation" },
  { text: "Колко сладки са тези ягоди!", type: "exclamation" }
];
