// ══════════════════════════════════════════════
//  MewIQ  –  questions.js  (v2 – Bilingual)
// ══════════════════════════════════════════════

const QUESTIONS = [

  /* ──── LOGIC (5) ──── */
  {
    id: 1, type: 'logic',
    ar: { q: 'إذا كانت كل القطط حيوانات، وبعض الحيوانات نائمة، فأي من التالي صحيح بالضرورة؟',
          opts: ['كل القطط نائمة', 'بعض القطط ليست حيوانات', 'بعض الحيوانات قد تكون قططاً', 'لا شيء مما سبق'],
          ans: 2 },
    en: { q: 'All cats are animals. Some animals sleep. Which must be true?',
          opts: ['All cats sleep', 'Some cats are not animals', 'Some animals may be cats', 'None of the above'],
          ans: 2 },
    time: 15, points: 10, difficulty: 2
  },
  {
    id: 2, type: 'logic',
    ar: { q: 'سارة أطول من ريم. ريم أطول من نور. من الأقصر؟',
          opts: ['سارة', 'ريم', 'نور', 'لا يمكن التحديد'],
          ans: 2 },
    en: { q: 'Sara is taller than Reem. Reem is taller than Nour. Who is shortest?',
          opts: ['Sara', 'Reem', 'Nour', 'Cannot determine'],
          ans: 2 },
    time: 12, points: 8, difficulty: 1
  },
  {
    id: 3, type: 'logic',
    ar: { q: 'في كل مرة تمطر، تبتل الأرض. الأرض الآن جافة. ماذا نستنتج؟',
          opts: ['مطرت اليوم', 'لم تمطر', 'غداً ستمطر', 'الأرض مبللة دائماً'],
          ans: 1 },
    en: { q: 'Every time it rains, the ground gets wet. The ground is dry now. What can we conclude?',
          opts: ['It rained today', 'It did not rain', 'It will rain tomorrow', 'Ground is always wet'],
          ans: 1 },
    time: 14, points: 10, difficulty: 2
  },
  {
    id: 4, type: 'logic',
    ar: { q: 'عندي 3 صناديق: أحمر، أزرق، أخضر. الهدية ليست في الأحمر ولا الأزرق. أين الهدية؟',
          opts: ['الأحمر', 'الأزرق', 'الأخضر', 'خارج الصناديق'],
          ans: 2 },
    en: { q: 'I have 3 boxes: red, blue, green. The gift is not in red or blue. Where is it?',
          opts: ['Red', 'Blue', 'Green', 'Outside the boxes'],
          ans: 2 },
    time: 10, points: 6, difficulty: 1
  },
  {
    id: 5, type: 'logic',
    ar: { q: 'كل مدير موظف. بعض الموظفين متزوجون. هل كل مدير متزوج؟',
          opts: ['نعم دائماً', 'لا ليس بالضرورة', 'نعم إذا كان كبيراً', 'غير محدد'],
          ans: 1 },
    en: { q: 'All managers are employees. Some employees are married. Are all managers married?',
          opts: ['Yes, always', 'No, not necessarily', 'Yes if senior', 'Undefined'],
          ans: 1 },
    time: 15, points: 12, difficulty: 3
  },

  /* ──── PATTERNS (5) ──── */
  {
    id: 6, type: 'pattern',
    ar: { q: 'ما الرقم التالي في المتتالية؟\n2 – 4 – 8 – 16 – __',
          opts: ['24', '28', '32', '30'],
          ans: 2 },
    en: { q: 'What is the next number?\n2 – 4 – 8 – 16 – __',
          opts: ['24', '28', '32', '30'],
          ans: 2 },
    time: 12, points: 8, difficulty: 1
  },
  {
    id: 7, type: 'pattern',
    ar: { q: 'ما الرقم التالي؟\n1 – 1 – 2 – 3 – 5 – 8 – __',
          opts: ['11', '12', '13', '14'],
          ans: 2 },
    en: { q: 'What comes next?\n1 – 1 – 2 – 3 – 5 – 8 – __',
          opts: ['11', '12', '13', '14'],
          ans: 2 },
    time: 13, points: 10, difficulty: 2
  },
  {
    id: 8, type: 'pattern',
    ar: { q: 'أكمل النمط:\nAZ – BY – CX – __',
          opts: ['DW', 'DV', 'EW', 'DX'],
          ans: 0 },
    en: { q: 'Complete the pattern:\nAZ – BY – CX – __',
          opts: ['DW', 'DV', 'EW', 'DX'],
          ans: 0 },
    time: 14, points: 12, difficulty: 3
  },
  {
    id: 9, type: 'pattern',
    ar: { q: 'ما الرقم التالي؟\n100 – 91 – 83 – 76 – 70 – __',
          opts: ['64', '65', '63', '66'],
          ans: 1 },
    en: { q: 'Next in sequence?\n100 – 91 – 83 – 76 – 70 – __',
          opts: ['64', '65', '63', '66'],
          ans: 1 },
    time: 15, points: 14, difficulty: 4
  },
  {
    id: 10, type: 'pattern',
    ar: { q: 'أيهما لا ينتمي للمجموعة؟\n🔺 🔷 🔴 🔶 🟡',
          opts: ['🔺 المثلث', '🔷 المعين', '🔴 الدائرة', '🟡 الدائرة الصفراء'],
          ans: 2 },
    en: { q: 'Which does NOT belong?\n🔺 🔷 🔴 🔶 🟡',
          opts: ['🔺 Triangle', '🔷 Diamond', '🔴 Circle', '🟡 Yellow circle'],
          ans: 2 },
    time: 12, points: 8, difficulty: 2
  },

  /* ──── MATH (5) ──── */
  {
    id: 11, type: 'math',
    ar: { q: 'إذا كان عمر أحمد ضعف عمر علي، وعلي عمره 12. كم مجموع أعمارهما؟',
          opts: ['24', '36', '30', '48'],
          ans: 1 },
    en: { q: "Ahmed is twice Ali's age. Ali is 12. What is the sum of their ages?",
          opts: ['24', '36', '30', '48'],
          ans: 1 },
    time: 12, points: 10, difficulty: 2
  },
  {
    id: 12, type: 'math',
    ar: { q: 'قطار يسير 60 كم/س. كم يقطع في 45 دقيقة؟',
          opts: ['40 كم', '45 كم', '50 كم', '55 كم'],
          ans: 1 },
    en: { q: 'A train moves at 60 km/h. How far does it go in 45 minutes?',
          opts: ['40 km', '45 km', '50 km', '55 km'],
          ans: 1 },
    time: 14, points: 12, difficulty: 3
  },
  {
    id: 13, type: 'math',
    ar: { q: 'ما هو 15٪ من 240؟',
          opts: ['32', '34', '36', '38'],
          ans: 2 },
    en: { q: 'What is 15% of 240?',
          opts: ['32', '34', '36', '38'],
          ans: 2 },
    time: 12, points: 10, difficulty: 2
  },
  {
    id: 14, type: 'math',
    ar: { q: '3 قطط تأكل 3 أسماك في 3 دقائق. كم تأكل 12 قطة في 12 دقيقة؟',
          opts: ['12', '36', '48', '144'],
          ans: 2 },
    en: { q: '3 cats eat 3 fish in 3 minutes. How many fish do 12 cats eat in 12 minutes?',
          opts: ['12', '36', '48', '144'],
          ans: 2 },
    time: 15, points: 14, difficulty: 4
  },
  {
    id: 15, type: 'math',
    ar: { q: 'مربع طول ضلعه 7 سم. ما مساحته؟',
          opts: ['28', '42', '49', '56'],
          ans: 2 },
    en: { q: 'A square has a side of 7 cm. What is its area?',
          opts: ['28', '42', '49', '56'],
          ans: 2 },
    time: 10, points: 8, difficulty: 1
  },

  /* ──── WORDS (5) ──── */
  {
    id: 16, type: 'word',
    ar: { q: 'ما الكلمة الشاذة التي لا تنتمي للمجموعة؟\nتفاحة – موزة – جزرة – برتقالة',
          opts: ['تفاحة', 'موزة', 'جزرة', 'برتقالة'],
          ans: 2 },
    en: { q: 'Which word does NOT belong?\nApple – Banana – Carrot – Orange',
          opts: ['Apple', 'Banana', 'Carrot', 'Orange'],
          ans: 2 },
    time: 12, points: 8, difficulty: 2
  },
  {
    id: 17, type: 'word',
    ar: { q: '"القلم" بالنسبة لـ"الكتابة" مثل "الفرشاة" بالنسبة لـ …؟',
          opts: ['اللون', 'الرسم', 'الجدار', 'الفنان'],
          ans: 1 },
    en: { q: '"Pen" is to "Writing" as "Brush" is to …?',
          opts: ['Color', 'Painting', 'Wall', 'Artist'],
          ans: 1 },
    time: 13, points: 10, difficulty: 2
  },
  {
    id: 18, type: 'word',
    ar: { q: 'أي كلمة يمكن أن تسبق: "باب" و"كتاب" و"ملاحظة"؟',
          opts: ['دفتر', 'قفل', 'محفظة', 'حقيبة'],
          ans: 0 },
    en: { q: 'Which word can follow: "note", "text", "hand"?\n(word + __)',
          opts: ['book', 'door', 'bag', 'lock'],
          ans: 0 },
    time: 14, points: 12, difficulty: 3
  },
  {
    id: 19, type: 'word',
    ar: { q: 'ما معنى كلمة "مُقتَضَب" في جملة: "أعطاني ردًا مُقتَضَبًا"؟',
          opts: ['مفصّل وطويل', 'قصير وموجز', 'غير مفهوم', 'جارح ومؤلم'],
          ans: 1 },
    en: { q: 'What does "laconic" mean in: "He gave a laconic reply"?',
          opts: ['Detailed and long', 'Brief and concise', 'Incomprehensible', 'Hurtful'],
          ans: 1 },
    time: 14, points: 12, difficulty: 3
  },
  {
    id: 20, type: 'word',
    ar: { q: 'أيّ الكلمتين متضادتان (أضداد)؟',
          opts: ['ظلام / عتمة', 'فرح / حزن', 'سريع / عجول', 'ضخم / كبير'],
          ans: 1 },
    en: { q: 'Which pair are antonyms (opposites)?',
          opts: ['Dark / Gloomy', 'Happy / Sad', 'Fast / Swift', 'Big / Large'],
          ans: 1 },
    time: 10, points: 8, difficulty: 1
  },

  /* ──── MEMORY (5) ──── */
  {
    id: 21, type: 'memory',
    ar: { q: '🐱 🍕 🚗 🌙 ⭐\n\nأيّ الرموز لم يكن في القائمة أعلاه؟',
          opts: ['🐱', '🌟', '🚗', '🌙'],
          ans: 1 },
    en: { q: '🐱 🍕 🚗 🌙 ⭐\n\nWhich symbol was NOT in the list above?',
          opts: ['🐱', '🌟', '🚗', '🌙'],
          ans: 1 },
    time: 13, points: 10, difficulty: 2
  },
  {
    id: 22, type: 'memory',
    ar: { q: 'تذكّر: 7 – 3 – 9 – 1 – 5\n\nما مجموع الرقمين الأول والأخير؟',
          opts: ['10', '12', '14', '8'],
          ans: 1 },
    en: { q: 'Remember: 7 – 3 – 9 – 1 – 5\n\nWhat is the sum of the first and last numbers?',
          opts: ['10', '12', '14', '8'],
          ans: 1 },
    time: 14, points: 12, difficulty: 3
  },
  {
    id: 23, type: 'memory',
    ar: { q: 'قرأتَ: "القطة الأرجوانية نامت على البيانو الأزرق"\n\nما لون القطة؟',
          opts: ['أزرق', 'أصفر', 'أرجواني', 'رمادي'],
          ans: 2 },
    en: { q: 'You read: "The purple cat slept on the blue piano"\n\nWhat colour was the cat?',
          opts: ['Blue', 'Yellow', 'Purple', 'Grey'],
          ans: 2 },
    time: 12, points: 8, difficulty: 1
  },
  {
    id: 24, type: 'memory',
    ar: { q: 'تذكّر الترتيب: 🔴 🟡 🔵 🟢 🟣\n\nأيّ اللون في الموضع الثالث؟',
          opts: ['🔴 أحمر', '🟡 أصفر', '🔵 أزرق', '🟢 أخضر'],
          ans: 2 },
    en: { q: 'Remember order: 🔴 🟡 🔵 🟢 🟣\n\nWhich colour is in the 3rd position?',
          opts: ['🔴 Red', '🟡 Yellow', '🔵 Blue', '🟢 Green'],
          ans: 2 },
    time: 13, points: 10, difficulty: 2
  },
  {
    id: 25, type: 'memory',
    ar: { q: 'تذكّر هذا النمط:\n★ ◆ ★ ◆ ★\n\nكم مرة ظهرت ◆؟',
          opts: ['مرة واحدة', 'مرتان', '3 مرات', '4 مرات'],
          ans: 1 },
    en: { q: 'Remember this pattern:\n★ ◆ ★ ◆ ★\n\nHow many times does ◆ appear?',
          opts: ['Once', 'Twice', '3 times', '4 times'],
          ans: 1 },
    time: 10, points: 8, difficulty: 1
  }
];

const CATEGORIES = {
  logic:   { ar: 'منطق',    en: 'Logic',    icon: '🧠' },
  pattern: { ar: 'أنماط',   en: 'Patterns', icon: '🔢' },
  math:    { ar: 'رياضيات', en: 'Math',     icon: '📐' },
  word:    { ar: 'كلمات',   en: 'Words',    icon: '📝' },
  memory:  { ar: 'ذاكرة',   en: 'Memory',   icon: '💡' }
};
