// words.js: sentences to arrange, for grades 3-4.
// Format and rules: specs/007-sentence-builder/contracts/sentence-entry.md
// Approved by the owner on 2026-11-21 (T020). New sentences need owner approval before release,
// with special attention to "only one natural word order" (FR-006).
// Write each sentence exactly as it should look: capital letter, end mark, no commas.
// Add firstIsName: true when the first word is a name (it keeps its capital on the card).
globalThis.BUILDER_SENTENCES = [
  // Questions (the question word, or the question clitic "ли", fixes the order)
  { text: "Къде е моята червена топка?" },
  { text: "Ще ми дадеш ли молива?" },
  { text: "Кой е написал тази интересна книга?" },
  { text: "Как се казва твоят нов учител?" },
  { text: "Чия е тази синя чанта?" },
  { text: "Кои са твоите любими цветя?" },
  { text: "Откъде идва този силен шум?" },
  { text: "Можеш ли да ми помогнеш?" },
  { text: "Искаш ли да играем футбол?" },

  // Exclamations and requests
  { text: "Каква вкусна торта си направила!" },
  { text: "Какви красиви цветя растат в градината!" },
  { text: "Не пипай този горещ чайник!" },
  { text: "Помогни ми да нося торбата!" },
  { text: "Дай ми твоята червена топка!" },

  // Statements (verb chains with "да", "ще", "не" and clitics keep the order)
  { text: "Иван има малко бяло куче.", firstIsName: true },
  { text: "Иван няма да закъснее за училище.", firstIsName: true },
  { text: "Мария иска да стане учителка.", firstIsName: true },
  { text: "Той не обича студената супа." },
  { text: "Тя иска да стане лекарка." },
  { text: "Аз искам да си купя колело." },
  { text: "Мама ще ми купи нови обувки." },
  { text: "Той обича да чете книги." },
  { text: "Дядо ще ми подари голям самолет." },
  { text: "Сестра ми обича да рисува цветя." },
  { text: "Той не може да вдигне тази тежка кутия." },
  { text: "Тя обича да слуша музика." },
  { text: "Искаме да видим новия филм." },
  { text: "Не искам да закъснея." },
  { text: "Той започна да пише писмо." },
  { text: "Малкото ми братче иска да играе." }
];
