export type Volume = {
  id: number;
  title: string;
  urdu: string;
  strapline: string;
  pages: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  pdf: string;
  cover: string;
  topics: string[];
};

export const volumes: Volume[] = [
  {
    id: 1,
    title: "100 Words That Open the Ghazal",
    urdu: "دل اور محبت",
    strapline: "Build a listener's vocabulary through love, longing, beauty, fate and mysticism.",
    pages: 32,
    duration: "4 weeks",
    level: "Beginner",
    color: "#a63c4a",
    pdf: "/pdfs/volume-01-100-words.pdf",
    cover: "/covers/volume-01.png",
    topics: ["100 words", "Izafat", "Listening"],
  },
  {
    id: 2,
    title: "Grammar and Couplets",
    urdu: "لفظ سے مصرع تک",
    strapline: "Read relationships, verbs and poetic turns through twenty guided classical couplets.",
    pages: 50,
    duration: "5 weeks",
    level: "Beginner",
    color: "#2f7f78",
    pdf: "/pdfs/volume-02-grammar-and-couplets.pdf",
    cover: "/covers/volume-02.png",
    topics: ["Grammar", "20 couplets", "Rekhta"],
  },
  {
    id: 3,
    title: "Learn to Read the Script",
    urdu: "لفظ سے خط تک",
    strapline: "Learn the Urdu alphabet through familiar poetry words, joining patterns and guided reading.",
    pages: 35,
    duration: "4 weeks",
    level: "Beginner",
    color: "#d16a32",
    pdf: "/pdfs/volume-03-read-the-script.pdf",
    cover: "/covers/volume-03.png",
    topics: ["Nastaliq", "Letter families", "Tracing"],
  },
  {
    id: 4,
    title: "The Art of Urdu Poetry",
    urdu: "شعر کی بناوٹ",
    strapline: "Hear radif, qafiyah and metre, then explore twelve engines of poetic meaning.",
    pages: 41,
    duration: "5 weeks",
    level: "Intermediate",
    color: "#4866a1",
    pdf: "/pdfs/volume-04-art-of-urdu-poetry.pdf",
    cover: "/covers/volume-04.png",
    topics: ["Ghazal", "Metre", "Workshops"],
  },
  {
    id: 5,
    title: "Beyond the Ghazal",
    urdu: "نظم اور دوسری اصناف",
    strapline: "Meet the nazm, rubai, qasida, marsiya and the movement of a whole poem.",
    pages: 31,
    duration: "4 weeks",
    level: "Intermediate",
    color: "#7a4f91",
    pdf: "/pdfs/volume-05-beyond-the-ghazal.pdf",
    cover: "/covers/volume-05.png",
    topics: ["Poetic forms", "Image chains", "Modernity"],
  },
  {
    id: 6,
    title: "The Living Lexicon",
    urdu: "زندہ لغت",
    strapline: "Expand into a practical vocabulary of speech, journey, body, wound, garden and sky.",
    pages: 59,
    duration: "8 weeks",
    level: "Intermediate",
    color: "#9b742f",
    pdf: "/pdfs/volume-06-living-lexicon.pdf",
    cover: "/covers/volume-06.png",
    topics: ["Lexicon", "Compounds", "Poetic range"],
  },
  {
    id: 7,
    title: "A Thematic Anthology",
    urdu: "موضوعاتی انتخاب",
    strapline: "Read love, separation, selfhood and devotion through a repeatable six-lens method.",
    pages: 37,
    duration: "5 weeks",
    level: "Advanced",
    color: "#2c6f59",
    pdf: "/pdfs/volume-07-thematic-anthology.pdf",
    cover: "/covers/volume-07.png",
    topics: ["Eight themes", "Close reading", "Anthology"],
  },
  {
    id: 8,
    title: "Poets and Qawwali",
    urdu: "شاعر اور قوالی",
    strapline: "Recognise eight poetic voices and cross from the written line into Sufi performance.",
    pages: 35,
    duration: "5 weeks",
    level: "Advanced",
    color: "#b64d2e",
    pdf: "/pdfs/volume-08-poets-and-qawwali.pdf",
    cover: "/covers/volume-08.png",
    topics: ["Poet portraits", "Qawwali", "Voice"],
  },
  {
    id: 9,
    title: "The Listening Companion",
    urdu: "سننے کا ہنر",
    strapline: "Train seven kinds of attention across recitation, tarannum, ghazal, qawwali and cinema.",
    pages: 37,
    duration: "6 weeks",
    level: "Advanced",
    color: "#356b8f",
    pdf: "/pdfs/volume-09-listening-companion.pdf",
    cover: "/covers/volume-09.png",
    topics: ["Seven-ear method", "Pronunciation", "18 labs"],
  },
  {
    id: 10,
    title: "The Annotated Anthology",
    urdu: "شعر سے ملاقات",
    strapline: "Bring the full practice together in twenty-four guided encounters with listening pathways.",
    pages: 37,
    duration: "8 weeks",
    level: "Advanced",
    color: "#893a5d",
    pdf: "/pdfs/volume-10-annotated-anthology.pdf",
    cover: "/covers/volume-10.png",
    topics: ["24 encounters", "YouTube", "Notebook"],
  },
];

export const words = [
  { roman: "ishq", urdu: "عشق", meaning: "intense, transformative love", hook: "A love stronger and more fated than ordinary mohabbat.", phrase: "ishq ka safar", phraseMeaning: "the journey of love" },
  { roman: "mohabbat", urdu: "محبت", meaning: "love, affection", hook: "The broad everyday-poetic word for loving attachment.", phrase: "mohabbat ki khushboo", phraseMeaning: "the fragrance of love" },
  { roman: "dil", urdu: "دل", meaning: "heart; inner seat of emotion", hook: "Pairs endlessly with dard, gham, khwaab and sukoon.", phrase: "dil beqaraar hai", phraseMeaning: "the heart is restless" },
  { roman: "wafa", urdu: "وفا", meaning: "faithfulness, loyalty", hook: "Its dramatic opposite is bewafa: without faithfulness.", phrase: "wafa ka vaada", phraseMeaning: "a promise of fidelity" },
  { roman: "hijr", urdu: "ہجر", meaning: "separation from the beloved", hook: "The classical opposite is visaal, or union.", phrase: "shab-e-hijr", phraseMeaning: "night of separation" },
  { roman: "yaad", urdu: "یاد", meaning: "memory; missing someone", hook: "A noun and an action: yaad karna means to remember.", phrase: "teri yaad", phraseMeaning: "your memory / missing you" },
  { roman: "justuju", urdu: "جستجو", meaning: "search, quest, seeking", hook: "Desire becomes justuju when it makes you search.", phrase: "justuju-e-ishq", phraseMeaning: "the quest for love" },
  { roman: "gham", urdu: "غم", meaning: "sorrow, grief", hook: "One of the ghazal's central emotional weights.", phrase: "gham-e-dil", phraseMeaning: "sorrow of the heart" },
  { roman: "nazar", urdu: "نظر", meaning: "sight, glance, viewpoint", hook: "A glance can meet, bless, protect or harm; context decides.", phrase: "teri nazar", phraseMeaning: "your gaze" },
  { roman: "khudi", urdu: "خودی", meaning: "cultivated selfhood", hook: "In Iqbal, not mere ego but moral-spiritual agency.", phrase: "khudi ko kar buland", phraseMeaning: "raise the self" },
  { roman: "aavaaz", urdu: "آواز", meaning: "voice, sound", hook: "Ask whose voice is carrying the line and how.", phrase: "aavaaz-e-dil", phraseMeaning: "the voice of the heart" },
  { roman: "sama", urdu: "سماع", meaning: "attentive sacred listening", hook: "Listening as a spiritual and embodied practice.", phrase: "mehfil-e-sama", phraseMeaning: "a gathering for sacred listening" },
];

export const quizQuestions = [
  {
    question: "Which word names separation from the beloved?",
    options: ["visaal", "hijr", "jamaal", "wafa"],
    answer: 1,
    note: "Hijr is separation; visaal is union.",
  },
  {
    question: "In gham-e-dil, what work does the small -e- sound perform?",
    options: ["It makes a plural", "It marks a question", "It joins 'sorrow' to 'heart'", "It negates the phrase"],
    answer: 2,
    note: "Izafat links two images: gham-e-dil, sorrow of the heart.",
  },
  {
    question: "Which pair belongs to the structure of a ghazal?",
    options: ["radif and qafiyah", "scene and chapter", "chorus and bridge", "act and stanza"],
    answer: 0,
    note: "Qafiyah is the rhyme pattern; radif is the returning refrain.",
  },
  {
    question: "Urdu script normally runs...",
    options: ["left to right", "top to bottom", "right to left", "in alternating lines"],
    answer: 2,
    note: "Urdu runs right to left, while numbers still run left to right.",
  },
  {
    question: "Which word carries the ache of an unfulfilled desire?",
    options: ["hasrat", "aavaaz", "sukoon", "jamaal"],
    answer: 0,
    note: "A tamanna may still come true; hasrat often carries the ache of not having.",
  },
  {
    question: "What is the most useful first pass when listening to a ghazal?",
    options: ["Translate every verb", "Catch one known image and the emotional temperature", "Pause after every word", "Read subtitles first"],
    answer: 1,
    note: "The guides prioritise recognition and emotional context before complete translation.",
  },
];

export const scriptFamilies = [
  { name: "One body, changing dots", letters: "ب پ ت ٹ ث", roman: "be · pe · te · ṭe · se", clue: "Keep the bowl. Dots, or the small ṭ marker, choose the letter.", words: ["بہار", "پیار", "تنہا", "ثواب"] },
  { name: "The curved cup", letters: "ج چ ح خ", roman: "jeem · che · ḥe · khe", clue: "Keep the cup; move or multiply the dot.", words: ["جان", "چاند", "حال", "خواب"] },
  { name: "The nine breakers", letters: "ا د ڈ ذ ر ڑ ز ژ و", roman: "alif · daal · re · waao", clue: "These accept a join from the right but do not connect forward.", words: ["آج", "درد", "راز", "وفا"] },
  { name: "Teeth and dots", letters: "س ش", roman: "seen · sheen", clue: "Seen has three teeth; sheen crowns the same path with three dots.", words: ["سفر", "شب", "شعر", "سکون"] },
  { name: "Broad emphatics", letters: "ص ض ط ظ", roman: "suaad · zuaad · to'e · zo'e", clue: "Recognition matters more than forcing an Arabic pronunciation.", words: ["صدا", "ضرور", "طلب", "ظلم"] },
  { name: "The inward throat", letters: "ع غ", roman: "ain · ghain", clue: "The same inward body; ghain carries a dot above.", words: ["عشق", "عمر", "غم", "غزل"] },
  { name: "Loops, bowls and tall strokes", letters: "ف ق ک گ ل", roman: "fe · qaf · kaf · gaf · laam", clue: "Nastaliq compresses these strokes; let a familiar whole word lead your eye.", words: ["فراق", "قسمت", "کیا", "گل"] },
  { name: "The anchors", letters: "م ن ں", roman: "meem · noon · noon ghunna", clue: "Meem makes a rounded knot; noon takes a dot, while final noon ghunna nasalises the vowel.", words: ["محبت", "نظر", "کہاں", "نام"] },
  { name: "Breath and aspiration", letters: "ہ ھ", roman: "gol he · do-chashmi he", clue: "Gol he can sound h or carry a final vowel; do-chashmi he changes the consonant before it.", words: ["ہم", "پھر", "تھا", "خواب"] },
  { name: "Ye, hamza and the final glide", letters: "ی ے ء", roman: "chhoti ye · baṛi ye · hamza", clue: "Chhoti ye carries y or ee, baṛi ye often closes with e, and hamza separates vowels.", words: ["یاد", "میرے", "آئینہ", "کہیے"] },
];

export const encounters = [
  {
    poet: "Meer Taqi Meer",
    title: "The beloved as presence",
    urdu: "پتّا پتّا بوٹا بوٹا حال ہمارا جانے ہے",
    roman: "patta patta boota boota haal hamaara jaane hai",
    sense: "Every leaf and every plant knows my condition.",
    key: "Nature knows what the beloved does not acknowledge.",
    listen: "https://www.youtube.com/watch?v=dBSSYXj6PlY",
  },
  {
    poet: "Mirza Ghalib",
    title: "Desire without exhaustion",
    urdu: "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے",
    roman: "hazaaron khwaahishen aisi ki har khwaahish pe dam nikle",
    sense: "Thousands of desires, each intense enough to take my breath.",
    key: "Fulfilment cannot cure desire because desire multiplies faster than experience.",
    listen: "https://www.youtube.com/watch?v=1UGntT1CZXw",
  },
  {
    poet: "Momin Khan Momin",
    title: "Intimacy and secrecy",
    urdu: "تم میرے پاس ہوتے ہو گویا جب کوئی دوسرا نہیں ہوتا",
    roman: "tum mere paas hote ho goya jab koi doosra nahin hota",
    sense: "You seem to be beside me when no one else is present.",
    key: "Goya suspends certainty: memory, imagination, inward presence, or confession?",
    listen: "https://www.youtube.com/watch?v=5qEj2Un_Bss",
  },
  {
    poet: "Bahadur Shah Zafar",
    title: "Exile within desire",
    urdu: "لگتا نہیں ہے دل مرا اجڑے دیار میں",
    roman: "lagta nahin hai dil mera ujre dayaar mein",
    sense: "My heart cannot settle in this ravaged land.",
    key: "Dil lagna means both taking interest and finding belonging; exile breaks both.",
    listen: "https://www.youtube.com/watch?v=rTRAl7vrVvY",
  },
  {
    poet: "Faiz Ahmed Faiz",
    title: "Public speech",
    urdu: "بول کہ لب آزاد ہیں تیرے",
    roman: "bol ki lab aazaad hain tere",
    sense: "Speak, for your lips are free.",
    key: "Imperative grammar turns lyric voice into an ethical summons.",
    listen: "https://www.youtube.com/watch?v=v22ah78e9ME",
  },
];

export type ListeningTrack = {
  title: string;
  artist: string;
  videoId: string;
  focus: string;
  startSeconds?: number;
};

export const listeningTracks: ListeningTrack[] = [
  {
    title: "Gulon Mein Rang Bhare",
    artist: "Mehdi Hassan · Faiz Ahmed Faiz",
    videoId: "Ds8nabK0vE8",
    focus: "Track how the spring image carries private longing and public renewal.",
  },
  {
    title: "Chupke Chupke Raat Din",
    artist: "Ghulam Ali · Hasrat Mohani",
    videoId: "sqCtPjEEYiA",
    focus: "Listen for soft repetition, held vowels, and the pressure of yaad hai.",
  },
];

export type ListeningLink = {
  title: string;
  category: "Classical" | "Modern & cinema" | "Qawwali & Sufi" | "Compare" | "Study labs";
  videoId: string;
  artist: string;
  focus: string;
  level?: number;
  startSeconds?: number;
};

export const listeningLinks: ListeningLink[] = [
  { title: "Everyday Urdu phrases", category: "Study labs", videoId: "Hbiow4qnWy4", artist: "MA English · beginner Urdu", focus: "Use familiar phrases to train vocabulary, pronunciation and listening confidence.", level: 1 },
  { title: "Pronouns in Urdu", category: "Study labs", videoId: "vH0GjnD3NmI", artist: "MA English · Urdu grammar", focus: "Listen for main, tum, aap, woh and hum before returning to the couplet frame.", level: 2 },
  { title: "Read and write Urdu", category: "Study labs", videoId: "Q1__ccCK9Nw", artist: "Beginner Urdu course", focus: "Use it alongside the Script Lab to reinforce right-to-left reading and joined forms.", level: 3 },
  { title: "Qafiyah, radif, matla and maqta", category: "Study labs", videoId: "xW-Mp73o7k8", artist: "Only for Education · Urdu literature", focus: "Pause at each term, then return to Level 4 to hear it operating inside a ghazal.", level: 4 },
  { title: "Elements of nazm and ghazal", category: "Study labs", videoId: "3dm4YbgkGzY", artist: "Education With Hamza · Urdu literature", focus: "Compare a poem that develops continuously with a ghazal made from autonomous couplets.", level: 5 },
  { title: "Vocabulary through a Faiz ghazal", category: "Study labs", videoId: "_EDpOls7yKc", artist: "Learn Urdu with Sara · Faiz Ahmed Faiz", focus: "Collect one new word, its verb or phrase, then add it to your living lexicon.", level: 6 },
  { title: "Iqbal and khudi", category: "Study labs", videoId: "FGlAmBFteTQ", artist: "Haseeb Ullah Khattak · Iqbal explainer", focus: "Test the idea of cultivated selfhood against the text rather than reducing khudi to ego.", level: 7 },
  { title: "Mir · Patta Patta Boota Boota", category: "Classical", videoId: "dBSSYXj6PlY", artist: "Mir Taqi Mir · recitation", focus: "Hear nature become the witness to private sorrow." },
  { title: "Mir · Dil Ki Veerani", category: "Classical", videoId: "ZDyqw9eG5Ps", artist: "Mir Taqi Mir · recitation", focus: "Notice how the refrain makes loss feel repeatedly inhabited." },
  { title: "Ghalib · Hazaron Khwahishen", category: "Classical", videoId: "1UGntT1CZXw", artist: "Jagjit Singh · Ghalib", focus: "Track desire gathering force from one wish to the next." },
  { title: "Ghalib · Bas Ki Dushwar", category: "Classical", videoId: "t0AJYSAhC8M", artist: "Ghalib · Saregama Ghazal collection", focus: "Begin at the selected moment and hear the poem test the idea of ease.", startSeconds: 3002 },
  { title: "Ghalib · Aadmi Ko Bhi", category: "Classical", videoId: "Ml35CtTspMw", artist: "Mirza Ghalib · spoken poetry", focus: "Listen for the severe distinction between being human and becoming humane." },
  { title: "Momin · Tum Mere Paas", category: "Classical", videoId: "5qEj2Un_Bss", artist: "Momin Khan Momin · ghazal", focus: "Hold goya open: memory, imagination and presence can coexist." },
  { title: "Zafar · Lagta Nahin Hai Dil", category: "Classical", videoId: "rTRAl7vrVvY", artist: "Mohammed Rafi · Bahadur Shah Zafar", focus: "Listen for how exile changes the meaning of dil lagna." },
  { title: "Zafar · Umr-e-Daraz", category: "Classical", videoId: "F2BiggrPqQU", artist: "Bahadur Shah Zafar · recitation", focus: "Notice the compact arithmetic of longing, time and disappointment." },
  { title: "Dagh · Khoob Parda", category: "Classical", videoId: "eTEJFHmdza0", artist: "Dagh Dehlvi · recitation", focus: "Listen for concealment that paradoxically makes the beloved more visible." },
  { title: "Hasrat · Chupke Chupke", category: "Classical", videoId: "sqCtPjEEYiA", artist: "Ghulam Ali · Hasrat Mohani", focus: "Return to the held vowels and the remembered refrain." },
  { title: "Iqbal · Khudi Ko Kar Buland", category: "Classical", videoId: "2qVNCWZA9LY", artist: "Allama Iqbal · recitation", focus: "Hear khudi as cultivated agency rather than simple self-assertion." },
  { title: "Iqbal · Khuda Bande Se", category: "Classical", videoId: "2qVNCWZA9LY", artist: "Allama Iqbal · recitation", focus: "Listen for the dramatic address between human agency and the divine." },
  { title: "Faiz · Gulon Mein Rang Bhare", category: "Modern & cinema", videoId: "Ds8nabK0vE8", artist: "Mehdi Hassan · Faiz Ahmed Faiz", focus: "Hear spring imagery widen from private longing toward renewal." },
  { title: "Faiz · Mujh Se Pehli Si", category: "Modern & cinema", videoId: "wGMnhHMwnM4", artist: "Noor Jehan · Faiz Ahmed Faiz", focus: "Track the turn from beloved to the wider wounds of the world." },
  { title: "Faiz · Bol", category: "Modern & cinema", videoId: "v22ah78e9ME", artist: "Iqbal Bano · Faiz Ahmed Faiz", focus: "Hear command become collective courage through repetition and resolve." },
  { title: "Firaq · Raat Bhi Neend Bhi", category: "Modern & cinema", videoId: "DMWJ7mgmC-Y", artist: "Firaq Gorakhpuri · ghazal", focus: "Follow the suspended atmosphere rather than translating each image too fast." },
  { title: "Kabhi Kabhie Mere Dil Mein", category: "Modern & cinema", videoId: "-W2dagktUp0", artist: "Yash Raj Films · Sahir Ludhianvi", focus: "Compare the poem's intimate address with its screen setting." },
  { title: "Dil Dhoondta Hai", category: "Modern & cinema", videoId: "2RL0XVbs3Us", artist: "Gulzar · Mausam", focus: "Listen for the imagined place and the ache carried by return." },
  { title: "Aaj Rang Hai · Sabri Brothers", category: "Qawwali & Sufi", videoId: "2HVgTblrRI0", artist: "Sabri Brothers · Amir Khusrau", focus: "Track the refrain as it gathers communal energy." },
  { title: "Chaap Tilak", category: "Qawwali & Sufi", videoId: "7SDrjwtfKMk", artist: "Coke Studio Pakistan · Amir Khusrau", focus: "Hear a shared text reshaped through duet, pulse and arrangement." },
  { title: "Bhar Do Jholi Meri", category: "Qawwali & Sufi", videoId: "5V1vwK8tC9c", artist: "Sabri Brothers · Shemaroo", focus: "Notice appeal, response and the expansion of a central plea." },
  { title: "Bullah Ki Jaana", category: "Qawwali & Sufi", videoId: "VzsQ55-LL80", artist: "RABBI · Bulleh Shah", focus: "Listen for identity unmaking its own fixed answers." },
  { title: "Mann Lago Yaar Fakiri Mein", category: "Qawwali & Sufi", videoId: "CB2TCCowHpA", artist: "Abida Parveen · Kabir tradition", focus: "Follow how vocal intensity makes renunciation feel immediate." },
  { title: "Main Sharabi · Aziz Mian", category: "Qawwali & Sufi", videoId: "Y71HvtVvX54", artist: "Aziz Mian · qawwali", focus: "Track the argumentative voice, acceleration and theatrical address." },
  { title: "Chupke Chupke · Two voices", category: "Compare", videoId: "Hn9MgLtpVgM", artist: "Ghulam Ali and Jagjit Singh · comparison", focus: "Compare tempo, vowel weight and the emotional distance of two voices." },
  { title: "Kabhi Kabhie · Poem and screen", category: "Compare", videoId: "-W2dagktUp0", artist: "Sahir Ludhianvi · screen performance", focus: "Read the lyric first, then notice what cinema gives it to see." },
  { title: "Aaj Rang Hai · Performance comparison", category: "Compare", videoId: "mf_E4-jdUvk", artist: "Sabri Brothers · alternate recording", focus: "Compare ensemble energy, pacing and the force of the returning line." },
];

export const externalLinks = [
  { label: "Rekhta", url: "https://www.rekhta.org", description: "Poems, poets, readings and reliable text references" },
  { label: "Ghalib: Hazaaron Khwahishen", url: "https://www.rekhta.org/ghazals/hazaaron-khvaahishen-aisii-ki-har-khvaahish-pe-dam-nikle-mirza-ghalib-ghazals", description: "Read the full ghazal on Rekhta" },
  { label: "Listening pathways", url: "https://www.youtube.com/watch?v=sqCtPjEEYiA", description: "Begin with a selected ghazal recording, then compare it inside the Listening Room" },
];
