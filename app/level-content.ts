export type LevelCard = {
  term: string;
  urdu?: string;
  meaning: string;
  note: string;
};

export type LevelActivity = {
  kind: "Notice" | "Write" | "Listen" | "Compare" | "Trace";
  title: string;
  prompt: string;
  hint: string;
};

export type LevelQuestion = {
  question: string;
  options: string[];
  answer: number;
  note: string;
};

export type LevelContent = {
  id: number;
  theme: string;
  description: string;
  outcomes: string[];
  lessons: { title: string; focus: string; minutes: number }[];
  cards: LevelCard[];
  activities: LevelActivity[];
  featured: {
    label: string;
    urdu: string;
    roman: string;
    sense: string;
    insight: string;
  };
  quiz: LevelQuestion[];
  videoId?: string;
  videoTitle?: string;
  videoAttribution?: string;
};

const baseLevelContent: LevelContent[] = [
  {
    id: 1,
    theme: "Build the first listening vocabulary",
    description: "Enter ten recurring poetic worlds through 100 high-value words, useful phrases, izafat and a first listening shelf.",
    outcomes: ["Recognise core love, separation and sorrow words", "Hear izafat joining two images", "Catch one known image in a sung ghazal"],
    lessons: [
      { title: "The heart and its attachments", focus: "ishq, mohabbat, dil and wafa", minutes: 18 },
      { title: "Separation and the search", focus: "hijr, yaad, hasrat and justuju", minutes: 20 },
      { title: "The worlds of the ghazal", focus: "beauty, wine, night, garden and fate", minutes: 22 },
      { title: "Izafat and first listening", focus: "hear small links inside memorable phrases", minutes: 17 },
    ],
    cards: [
      { term: "ishq", urdu: "عشق", meaning: "intense, transformative love", note: "Stronger and more fated than ordinary affection." },
      { term: "hijr", urdu: "ہجر", meaning: "separation from the beloved", note: "Its classical opposite is visaal, or union." },
      { term: "gham-e-dil", urdu: "غمِ دل", meaning: "sorrow of the heart", note: "The small -e- sound joins two images through izafat." },
      { term: "nazar", urdu: "نظر", meaning: "sight, glance or viewpoint", note: "A glance may meet, bless, protect or wound." },
    ],
    activities: [
      { kind: "Notice", title: "Build an image chain", prompt: "Choose dil, gham or raat and connect it to two other words you know.", hint: "Try dil-e-naadaan or shab-e-hijr." },
      { kind: "Listen", title: "Catch one returning word", prompt: "Play a ghazal once without subtitles and write the first familiar word you hear.", hint: "Recognition comes before complete translation." },
      { kind: "Write", title: "Make a memory hook", prompt: "Write one personal association for ishq, hijr, yaad or wafa.", hint: "A concrete image will stay longer than a dictionary gloss." },
    ],
    featured: { label: "Phrase laboratory", urdu: "شبِ ہجر", roman: "shab-e-hijr", sense: "the night of separation", insight: "Izafat turns two vocabulary items into one compressed emotional scene." },
    quiz: [
      { question: "Which word names separation from the beloved?", options: ["visaal", "hijr", "jamaal", "wafa"], answer: 1, note: "Hijr is separation; visaal is union." },
      { question: "What does izafat do in gham-e-dil?", options: ["Makes a plural", "Joins sorrow to heart", "Marks a question", "Negates the phrase"], answer: 1, note: "The -e- sound links the two images." },
      { question: "What should you seek on a first listening?", options: ["A perfect translation", "Every verb ending", "One known image", "The poet's biography"], answer: 2, note: "One recognised image gives the ear a foothold." },
      { question: "Which pair names separation and union?", options: ["hijr and visaal", "dil and nazar", "gham and wafa", "raat and gul"], answer: 0, note: "Hijr and visaal form one of the ghazal's central oppositions." },
      { question: "Which phrase means the night of separation?", options: ["aavaaz-e-dil", "shab-e-hijr", "rang-e-gul", "dard ka safar"], answer: 1, note: "Shab-e-hijr compresses night and separation through izafat." },
    ],
    videoId: "Ds8nabK0vE8",
    videoTitle: "Gulon Mein Rang Bhare",
    videoAttribution: "Mehdi Hassan · Faiz Ahmed Faiz",
  },
  {
    id: 2,
    theme: "Read the grammar inside a couplet",
    description: "Use a three-pass method to recognise relationships, verbs, negation and poetic turns in twenty guided classical couplets.",
    outcomes: ["Find speaker, addressee and possession", "Recognise high-value verb signals", "Follow a thought as it turns"],
    lessons: [
      { title: "Pronouns and presence", focus: "main, tu, tum, woh and the verb to be", minutes: 20 },
      { title: "Relationship glue", focus: "ka, ki, ke, se, ko, mein and par", minutes: 22 },
      { title: "Verbs without panic", focus: "hua, gaya, raha, diya and liya", minutes: 24 },
      { title: "Negation and the turn", focus: "nahin, bhi, hi, magar and lekin", minutes: 20 },
    ],
    cards: [
      { term: "main / tu / woh", urdu: "میں / تو / وہ", meaning: "I / intimate you / he, she, that", note: "First locate who speaks and who is addressed." },
      { term: "ka / ki / ke", urdu: "کا / کی / کے", meaning: "of; belonging to", note: "The ending agrees with the thing possessed." },
      { term: "nahin / bhi / hi", urdu: "نہیں / بھی / ہی", meaning: "not / also / precisely", note: "Small words often carry the emotional pressure." },
      { term: "magar", urdu: "مگر", meaning: "but, however", note: "A turn word can reverse the entire couplet." },
    ],
    activities: [
      { kind: "Notice", title: "Decode the frame", prompt: "In a couplet, mark speaker, addressee, main verb and one connector.", hint: "Relationships matter before English word order." },
      { kind: "Compare", title: "Move the emphasis", prompt: "Compare tum bhi, tum hi and tum nahin. What changes emotionally?", hint: "Translate the force, not only the dictionary words." },
      { kind: "Write", title: "Turn the thought", prompt: "Write two short clauses joined by magar.", hint: "Let the second clause revise the first." },
    ],
    featured: { label: "Grammar in feeling", urdu: "تم میرے پاس ہوتے ہو گویا", roman: "tum mere paas hote ho goya", sense: "You seem to be beside me, as though...", insight: "Goya suspends certainty and makes presence feel imagined, remembered and real at once." },
    quiz: [
      { question: "What should you identify before forcing English word order?", options: ["The rhyme only", "Relationships", "The publication date", "Every vowel mark"], answer: 1, note: "Speaker, addressee and grammatical relationships reveal the frame." },
      { question: "Which word most clearly signals a turn?", options: ["magar", "dil", "raat", "gul"], answer: 0, note: "Magar means but or however." },
      { question: "Which set marks possession?", options: ["main, tu, woh", "ka, ki, ke", "aaj, kal, ab", "kya, kyun, kab"], answer: 1, note: "Ka, ki and ke connect a possessor to what is possessed." },
      { question: "Which pronoun can be intimate, devotional or disrespectful by context?", options: ["aap", "tu", "ham", "woh"], answer: 1, note: "Tu is close and singular; context determines its emotional register." },
      { question: "What does nahin contribute?", options: ["Possession", "Negation", "Past tense only", "Rhyme"], answer: 1, note: "Nahin negates a statement and often carries strong poetic pressure." },
    ],
    videoId: "sqCtPjEEYiA",
    videoTitle: "Chupke Chupke Raat Din",
    videoAttribution: "Ghulam Ali · Hasrat Mohani",
  },
  {
    id: 3,
    theme: "Make the script familiar",
    description: "Learn Urdu as ten visual families, then read the pen-line through familiar poetry words, joining patterns and short couplets.",
    outcomes: ["Recognise letters by body and dots", "Spot letters that break the join", "Read whole familiar word-shapes right to left"],
    lessons: [
      { title: "Changing dots", focus: "ب پ ت ٹ ث and ج چ ح خ", minutes: 20 },
      { title: "The nine breakers", focus: "letters that do not connect forward", minutes: 20 },
      { title: "Read the pen-line", focus: "initial, medial, final and isolated forms", minutes: 25 },
      { title: "100 familiar words", focus: "recognition sets and script-first couplets", minutes: 25 },
    ],
    cards: [
      { term: "One body, changing dots", urdu: "ب پ ت ٹ ث", meaning: "be, pe, te, tte, se", note: "Keep the bowl; dots or the small marker choose the letter." },
      { term: "The curved cup", urdu: "ج چ ح خ", meaning: "jeem, che, he, khe", note: "Keep the cup and inspect the dots." },
      { term: "The nine breakers", urdu: "ا د ڈ ذ ر ڑ ز ژ و", meaning: "letters that stop the forward join", note: "They can connect from the right but not onward to the left." },
      { term: "Teeth and dots", urdu: "س ش", meaning: "seen and sheen", note: "Sheen crowns seen's three teeth with three dots." },
    ],
    activities: [
      { kind: "Trace", title: "Trace one family", prompt: "Open the Script Lab and trace the same body three times before changing its dots.", hint: "Follow the direction of the pen, not printed boxes." },
      { kind: "Notice", title: "Find the breaker", prompt: "In درد, راز and وفا, identify where the connected line stops.", hint: "Look just after د, ر or و." },
      { kind: "Compare", title: "Read before naming", prompt: "Choose عشق, خواب or غزل. Recognise the whole word, then name its letters.", hint: "Familiar shape is a legitimate reading strategy." },
    ],
    featured: { label: "Word anatomy", urdu: "خواب", roman: "khwaab", sense: "dream", insight: "The curved خ opens the word, while و breaks the join before the final shape." },
    quiz: [
      { question: "Urdu script normally runs...", options: ["left to right", "right to left", "top to bottom", "in alternating lines"], answer: 1, note: "Urdu runs right to left; numbers retain their own direction." },
      { question: "What mainly distinguishes ب, پ and ت?", options: ["Word order", "Dots", "Colour", "Vowel length"], answer: 1, note: "They share a body and differ through dot patterns." },
      { question: "What do the nine breakers do?", options: ["Begin every poem", "Stop the forward join", "Mark plurals", "Create metre"], answer: 1, note: "They accept a join from the right but do not connect onward." },
      { question: "Which pair shares one body distinguished by dots?", options: ["س and ش", "ا and و", "د and ل", "ر and م"], answer: 0, note: "Sheen adds three dots above the body of seen." },
      { question: "What is the strongest early reading strategy?", options: ["Name every letter first", "Recognise familiar whole-word shapes", "Ignore joins", "Read left to right"], answer: 1, note: "Whole familiar forms let reading begin before perfect letter-by-letter decoding." },
    ],
  },
  {
    id: 4,
    theme: "Hear how a ghazal is built",
    description: "Move from reading Urdu to reading poetry through ghazal structure, metre by ear, twelve poetic devices and twenty workshops.",
    outcomes: ["Spot radif and qafiyah", "Distinguish matla and maqta", "Name sound and image devices in a sher"],
    lessons: [
      { title: "A constellation, not a story", focus: "the autonomy and resonance of each sher", minutes: 20 },
      { title: "Radif and qafiyah", focus: "repetition with surprise", minutes: 24 },
      { title: "Matla, maqta and metre", focus: "openings, signatures, pulse and return", minutes: 24 },
      { title: "Twelve engines of meaning", focus: "sound, ambiguity, paradox, symbol and address", minutes: 28 },
    ],
    cards: [
      { term: "sher", urdu: "شعر", meaning: "a self-contained couplet", note: "Its two lines are called misras." },
      { term: "radif", urdu: "ردیف", meaning: "the exact returning refrain", note: "Listen for what repeats unchanged." },
      { term: "qafiyah", urdu: "قافیہ", meaning: "the rhyme immediately before the refrain", note: "It creates expectation while each sher changes direction." },
      { term: "matla / maqta", urdu: "مطلع / مقطع", meaning: "opening couplet / signature couplet", note: "The maqta often brings the poet's pen name into play." },
    ],
    activities: [
      { kind: "Notice", title: "Spot the return", prompt: "Underline the unchanged ending in three couplets, then circle the rhyme before it.", hint: "Refrain is exact; rhyme varies within a sound family." },
      { kind: "Listen", title: "Tap the pulse", prompt: "Recite one sher five times and tap where the line naturally carries weight.", hint: "Metre can enter through the ear before technical scansion." },
      { kind: "Compare", title: "Track a symbol", prompt: "Compare garden, flame, cage or tavern in two different couplets.", hint: "A symbol is a field of possibilities, not a fixed code." },
    ],
    featured: { label: "Structure at work", urdu: "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے", roman: "hazaaron khwaahishen aisi ki har khwaahish pe dam nikle", sense: "Thousands of desires, each intense enough to take my breath.", insight: "Repetition of khwaahish makes desire feel self-renewing and impossible to exhaust." },
    quiz: [
      { question: "What is the exact returning phrase in a ghazal called?", options: ["qafiyah", "radif", "matla", "behr"], answer: 1, note: "Radif is the unchanged refrain." },
      { question: "What usually sits immediately before the radif?", options: ["qafiyah", "title", "translation", "takhallus only"], answer: 0, note: "Qafiyah is the rhyming element before the refrain." },
      { question: "How should a ghazal first be understood?", options: ["As one continuous plot", "As unrelated prose", "As a constellation of shers", "As a stage play"], answer: 2, note: "Each sher stands alone while echoing the larger ghazal." },
      { question: "What is a matla?", options: ["The opening couplet", "The poet's biography", "A prose footnote", "The final rhyme only"], answer: 0, note: "The matla establishes the rhyme and refrain pattern in both lines." },
      { question: "Why learn metre by ear?", options: ["To avoid sound", "To feel weight, pulse and return", "To translate nouns", "To remove variation"], answer: 1, note: "Repeated recitation lets rhythmic structure become audible before formal scansion." },
    ],
    videoId: "1UGntT1CZXw",
    videoTitle: "Hazaron Khwahishen Aisi",
    videoAttribution: "Jagjit Singh · Mirza Ghalib",
  },
  {
    id: 5,
    theme: "Follow the movement of a whole poem",
    description: "Step beyond the autonomous sher into nazm, rubai, qasida, marsiya and other forms whose meaning develops over time.",
    outcomes: ["Choose a reading posture for the form", "Map a poem's movement with verbs", "Follow an image as it changes"],
    lessons: [
      { title: "A gallery of forms", focus: "nazm, rubai, qasida, marsiya, geet and free verse", minutes: 24 },
      { title: "The seven-pass method", focus: "sound, scene, movement, image, voice, history and return", minutes: 25 },
      { title: "Movement maps", focus: "describe what each section does with active verbs", minutes: 22 },
      { title: "Image chains and modernity", focus: "how symbols learn across a complete poem", minutes: 26 },
    ],
    cards: [
      { term: "nazm", urdu: "نظم", meaning: "a poem with sustained development", note: "Read for movement across the whole composition." },
      { term: "rubai", urdu: "رباعی", meaning: "a four-line form", note: "Compact structure often leads toward a turn or crystallisation." },
      { term: "marsiya", urdu: "مرثیہ", meaning: "elegiac poetry", note: "Its public memory and grief require a historical listening posture." },
      { term: "movement map", meaning: "a sequence of what the poem does", note: "Use verbs: invokes, remembers, widens, questions, returns." },
    ],
    activities: [
      { kind: "Write", title: "Map the movement", prompt: "Give each section of a poem one active verb.", hint: "Avoid topic labels; name the action of thought." },
      { kind: "Notice", title: "Follow one image", prompt: "Track how garden, road, flame or homeland changes from first appearance to last.", hint: "Record each shift in emotional or political pressure." },
      { kind: "Compare", title: "Change the posture", prompt: "Read a rubai and a nazm. What must your attention do differently?", hint: "One compresses; the other can develop and revise." },
    ],
    featured: { label: "Whole-poem lens", urdu: "بول کہ لب آزاد ہیں تیرے", roman: "bol ki lab aazaad hain tere", sense: "Speak, for your lips are free.", insight: "The imperative begins as lyric address and expands into a collective ethical summons." },
    quiz: [
      { question: "Which form most strongly invites sustained development?", options: ["nazm", "single sher", "radif", "qafiyah"], answer: 0, note: "A nazm develops meaning across the whole poem." },
      { question: "What belongs in a movement map?", options: ["Only nouns", "Active verbs", "Page numbers only", "A rhyme dictionary"], answer: 1, note: "Verbs show how the poem's thinking moves." },
      { question: "What does an image chain track?", options: ["Printing errors", "A symbol's changing work", "Only the title", "Every pronoun"], answer: 1, note: "The same image can gather and revise meaning across a poem." },
      { question: "A rubai is organised around how many lines?", options: ["Two", "Four", "Eight", "Twelve"], answer: 1, note: "A rubai is a compact four-line form." },
      { question: "Which form is closely associated with elegy and public memory?", options: ["marsiya", "radif", "matla", "tarannum"], answer: 0, note: "Marsiya joins grief, remembrance and historical witness." },
    ],
    videoId: "hVIQ3t_2O88",
    videoTitle: "Nazm and ghazal",
    videoAttribution: "Urdu literature explainer",
  },
  {
    id: 6,
    theme: "Expand a living poetic lexicon",
    description: "Add 150 words across fifteen semantic fields, then make them useful through expressions, near-neighbours and poetry encounters.",
    outcomes: ["Group vocabulary by poetic world", "Choose between near-neighbour shades", "Recognise compounds as living expressions"],
    lessons: [
      { title: "Voice, word and story", focus: "aavaaz, lafz, naghma, qissa and related expression", minutes: 22 },
      { title: "Body, wound and dissolution", focus: "the physical lexicon of lyric pressure", minutes: 24 },
      { title: "Garden, sky and journey", focus: "weather, water, road, light and enclosure", minutes: 24 },
      { title: "Self, society and justice", focus: "Sufi, philosophical and modern public language", minutes: 26 },
    ],
    cards: [
      { term: "aavaaz", urdu: "آواز", meaning: "voice or sound", note: "Ask whose voice carries the line and how." },
      { term: "zakhm", urdu: "زخم", meaning: "wound", note: "It can be bodily, emotional, historical or all three." },
      { term: "qaafila", urdu: "قافلہ", meaning: "caravan", note: "A collective figure for journey, history and belonging." },
      { term: "insaaf", urdu: "انصاف", meaning: "justice", note: "A central public word in modern Urdu poetry." },
    ],
    activities: [
      { kind: "Compare", title: "Choose the shade", prompt: "Compare gham, dard and zakhm. Which is state, sensation or figure?", hint: "Near-neighbours overlap without becoming identical." },
      { kind: "Write", title: "Make words live", prompt: "Build one expression with aavaaz, safar, zakhm or insaaf.", hint: "Try an izafat compound or a verb phrase." },
      { kind: "Notice", title: "Sort a poetic world", prompt: "Place ten new words under body, garden, journey, time or society.", hint: "Semantic families make recall quicker." },
    ],
    featured: { label: "Lexicon in motion", urdu: "آوازِ دل", roman: "aavaaz-e-dil", sense: "the voice of the heart", insight: "A familiar izafat structure lets a new word connect to an older poetic world." },
    quiz: [
      { question: "Which word means justice?", options: ["insaaf", "qaafila", "zakhm", "naghma"], answer: 0, note: "Insaaf carries social, ethical and political force." },
      { question: "Why learn words in semantic fields?", options: ["To avoid poetry", "To strengthen association and recall", "To remove ambiguity", "To replace context"], answer: 1, note: "Connected worlds help vocabulary become usable." },
      { question: "What is the point of a near-neighbour exercise?", options: ["Prove all synonyms are equal", "Choose the right shade", "Count syllables only", "Memorise spelling order"], answer: 1, note: "Poetic precision often lives in differences between close words." },
      { question: "Which word means wound?", options: ["zakhm", "naghma", "qaafila", "aavaaz"], answer: 0, note: "Zakhm can carry bodily, emotional and historical meanings." },
      { question: "Which image most naturally belongs to the journey field?", options: ["qaafila", "lab", "zulf", "aaina"], answer: 0, note: "A qaafila is a caravan and a collective figure of movement." },
    ],
  },
  {
    id: 7,
    theme: "Read through six lenses",
    description: "Practice close reading across eight thematic rooms: love, separation, self, devotion, exile, mortality, nature and justice.",
    outcomes: ["Apply a repeatable six-lens reading", "Compare one theme across poets", "Map echoes across a complete ghazal"],
    lessons: [
      { title: "The six-lens method", focus: "sound, scene, syntax, image, ambiguity and your reading", minutes: 24 },
      { title: "Love, separation and masks", focus: "the first three thematic rooms", minutes: 25 },
      { title: "Devotion, exile and time", focus: "unseen presence, home, mortality and memory", minutes: 25 },
      { title: "Nature, justice and synthesis", focus: "inner weather, public hope and ghazal echoes", minutes: 28 },
    ],
    cards: [
      { term: "Sound lens", meaning: "hear return, pause and texture", note: "Begin with what the line does in the mouth and ear." },
      { term: "Scene lens", meaning: "picture speaker, place and action", note: "Even abstraction often implies a dramatic situation." },
      { term: "Syntax lens", meaning: "find relationships and the turn", note: "Rescue meaning before imposing English order." },
      { term: "Ambiguity lens", meaning: "keep more than one live reading", note: "Do not solve productive uncertainty too quickly." },
    ],
    activities: [
      { kind: "Notice", title: "Six-lens close read", prompt: "Give one sentence each to sound, scene, syntax, image, ambiguity and your reading.", hint: "Keep the first five observations before making a verdict." },
      { kind: "Compare", title: "One theme, two poets", prompt: "Compare how Meer and Ghalib stage love, self or mortality.", hint: "Notice temperament as well as vocabulary." },
      { kind: "Write", title: "Map a ghazal's echoes", prompt: "List the image or question each sher returns to without forcing a plot.", hint: "Echo and argument can coexist without narrative continuity." },
    ],
    featured: { label: "Love as recognition", urdu: "پتّا پتّا بوٹا بوٹا حال ہمارا جانے ہے", roman: "patta patta boota boota haal hamaara jaane hai", sense: "Every leaf and every plant knows my condition.", insight: "Nature recognises the speaker's condition while the beloved remains pointedly absent." },
    quiz: [
      { question: "Which lens asks who speaks, where and to whom?", options: ["Scene", "Sound", "History only", "Metre only"], answer: 0, note: "The scene lens establishes the dramatic situation." },
      { question: "What should you do with productive ambiguity?", options: ["Erase it", "Keep multiple readings alive", "Replace it with biography", "Ignore the words"], answer: 1, note: "Ambiguity is often one of the poem's engines." },
      { question: "The anthology is organised into how many thematic rooms?", options: ["Four", "Six", "Eight", "Ten"], answer: 2, note: "The volume develops eight thematic rooms." },
      { question: "Which lens focuses on word relationships and the turn?", options: ["Syntax", "Scene", "Sound", "Aftertaste"], answer: 0, note: "The syntax lens tracks grammar, relationship and movement of thought." },
      { question: "What is a useful way to compare poets?", options: ["Force identical meanings", "Track temperament and treatment of one theme", "Ignore diction", "Read titles only"], answer: 1, note: "A shared theme reveals differences in voice, image and pressure." },
    ],
    videoId: "dBSSYXj6PlY",
    videoTitle: "Patta Patta Boota Boota",
    videoAttribution: "Mir Taqi Mir · recitation",
  },
  {
    id: 8,
    theme: "Recognise poets and enter the mehfil",
    description: "Learn the fingerprints of eight poets, then follow how written poetry changes inside qawwali performance and sacred listening.",
    outcomes: ["Identify a poet by recurring fingerprints", "Hear how repetition builds intensity", "Recognise major qawwali forms and terms"],
    lessons: [
      { title: "Eight poetic voices", focus: "Meer, Ghalib, Momin, Dagh, Zafar, Iqbal, Hasrat and Faiz", minutes: 28 },
      { title: "The seven-fingerprint method", focus: "diction, image, movement, tone, address, pressure and aftertaste", minutes: 24 },
      { title: "How qawwali builds meaning", focus: "establishment, repetition, acceleration, girah and return", minutes: 26 },
      { title: "Twelve guided encounters", focus: "hamd, qaul, naat, manqabat, rang and shared traditions", minutes: 30 },
    ],
    cards: [
      { term: "Meer", urdu: "میر", meaning: "intimacy, wounded simplicity, a world that feels sentient", note: "His plainness often opens into devastating depth." },
      { term: "Ghalib", urdu: "غالب", meaning: "conceptual wit, paradox and self-interrogation", note: "The line frequently thinks against itself." },
      { term: "Iqbal", urdu: "اقبال", meaning: "height, agency, destiny and cultivated selfhood", note: "Khudi is moral-spiritual action, not mere ego." },
      { term: "Faiz", urdu: "فیض", meaning: "lyric beauty widened into public witness", note: "Beloved, garden and dawn gain historical pressure." },
    ],
    activities: [
      { kind: "Compare", title: "Blind voice test", prompt: "Hide the poet's name and identify two fingerprints in the text.", hint: "Make a claim from diction and movement, then reveal." },
      { kind: "Listen", title: "Mark the intensification", prompt: "During a qawwali, note where repetition stops repeating and starts transforming.", hint: "Listen for speed, volume, ensemble response and inserted verse." },
      { kind: "Write", title: "Mehfil notebook", prompt: "Record text, voice, ensemble, return and your bodily response.", hint: "Qawwali meaning is performed, not merely carried by lyrics." },
    ],
    featured: { label: "Qawwali threshold", urdu: "محفلِ سماع", roman: "mehfil-e-sama", sense: "a gathering for sacred listening", insight: "Sama names attentive listening as an embodied and spiritual practice, not background sound." },
    quiz: [
      { question: "Which poet is strongly associated with paradox and conceptual wit?", options: ["Meer", "Ghalib", "Zafar", "Dagh"], answer: 1, note: "Ghalib's voice often tests a thought by turning it against itself." },
      { question: "What is a girah in qawwali listening?", options: ["A book cover", "An inserted poetic knot or verse", "A silent ending", "A metre chart"], answer: 1, note: "A girah connects another verse to the unfolding performance." },
      { question: "What does sama foreground?", options: ["Silent reading only", "Attentive sacred listening", "Grammar drills", "Biography"], answer: 1, note: "Sama treats listening as a spiritual practice." },
      { question: "Which poet often widens lyric beauty into public witness?", options: ["Faiz", "Momin", "Dagh", "Zafar"], answer: 0, note: "Faiz gives beloved, garden and dawn historical and political pressure." },
      { question: "What can repetition do in qawwali?", options: ["Only duplicate text", "Build and transform intensity", "Remove rhythm", "End the performance immediately"], answer: 1, note: "Pace, pitch and ensemble response let recurrence become transformation." },
    ],
    videoId: "2HVgTblrRI0",
    videoTitle: "Aaj Rang Hai",
    videoAttribution: "Sabri Brothers · Amir Khusrau",
  },
  {
    id: 9,
    theme: "Train seven kinds of attention",
    description: "Listen across spoken sher, tarannum, ghazal singing, qawwali, cinema and contemporary performance through eighteen progressive labs.",
    outcomes: ["Separate text, voice, pace and return", "Compare two performances of one text", "Keep an annotated listening record"],
    lessons: [
      { title: "The seven-ear method", focus: "word, voice, pulse, return, room, body and afterlife", minutes: 24 },
      { title: "Six ways poetry reaches the ear", focus: "recitation, tarannum, ghazal, qawwali, cinema and spoken word", minutes: 24 },
      { title: "Pronunciation for listeners", focus: "long vowels, aspiration and useful sound contrasts", minutes: 22 },
      { title: "Eighteen listening labs", focus: "from spoken sher to your own annotated hearing", minutes: 30 },
    ],
    cards: [
      { term: "recitation", meaning: "the spoken poem foregrounding text and phrasing", note: "Attend to pause, stress and dramatic address." },
      { term: "tarannum", urdu: "ترنم", meaning: "melodic recitation", note: "It lives between speech and full song." },
      { term: "return", meaning: "what changes when a phrase comes back", note: "Repetition may gain pressure through pace, pitch or ensemble." },
      { term: "emotional temperature", meaning: "the felt climate of a performance", note: "Name it before translating every line." },
    ],
    activities: [
      { kind: "Listen", title: "First hearing", prompt: "Listen without subtitles and mark voice, pace, return and emotional temperature.", hint: "Do not pause; let the whole performance establish its world." },
      { kind: "Compare", title: "Two versions, one text", prompt: "Compare recitation and song. What becomes clearer, and what becomes stranger?", hint: "Use timestamps for one decisive moment." },
      { kind: "Write", title: "One-page listening record", prompt: "Record the text, performer, sonic choices, one return and your final question.", hint: "Observation first; evaluation after." },
    ],
    featured: { label: "Listening refrain", urdu: "چپکے چپکے رات دن آنسو بہانا یاد ہے", roman: "chupke chupke raat din aansu bahaana yaad hai", sense: "I remember quietly shedding tears night and day.", insight: "Soft repetition and the returning yaad hai turn private memory into an audible ritual." },
    quiz: [
      { question: "What is the best first-hearing task?", options: ["Translate every word", "Notice voice, pace and return", "Read the biography", "Stop after each syllable"], answer: 1, note: "The first pass establishes the performance as a whole." },
      { question: "Tarannum is best described as...", options: ["Silent reading", "Melodic recitation", "A rhyme dictionary", "A prose summary"], answer: 1, note: "Tarannum occupies a space between speaking and singing." },
      { question: "Why compare two versions of one text?", options: ["To declare one objectively correct", "To hear interpretation in performance", "To ignore the poem", "To remove emotion"], answer: 1, note: "Performance choices reveal different possibilities in the same words." },
      { question: "Which mode lives between speech and full song?", options: ["tarannum", "silent reading", "indexing", "scansion only"], answer: 0, note: "Tarannum is melodic recitation." },
      { question: "What belongs in a one-page listening record?", options: ["Only a rating", "Text, performer, sonic choices and a question", "Only translation", "Only biography"], answer: 1, note: "The record keeps observation connected to interpretation." },
    ],
    videoId: "sqCtPjEEYiA",
    videoTitle: "Chupke Chupke Raat Din",
    videoAttribution: "Ghulam Ali · Hasrat Mohani",
  },
  {
    id: 10,
    theme: "Bring the full practice together",
    description: "Work through twenty-four annotated encounters across the classical treasury, modern poetry, cinema, qawwali and Sufi traditions.",
    outcomes: ["Move from first hearing to independent reading", "Compare page, voice and screen", "Build a personal capstone anthology"],
    lessons: [
      { title: "The classical treasury", focus: "twelve encounters from Meer to Iqbal", minutes: 30 },
      { title: "Modern poetry and cinema", focus: "Faiz, Firaq, Sahir and Gulzar", minutes: 28 },
      { title: "Qawwali and Sufi poetry", focus: "Khusrau, Bulleh Shah, Kabir tradition and Aziz Mian", minutes: 28 },
      { title: "Comparative laboratories", focus: "one ghazal, two voices; page, voice and screen", minutes: 30 },
    ],
    cards: [
      { term: "Hear", meaning: "meet the poem before solving it", note: "Mark emotional temperature and one repeated sound." },
      { term: "Parse", meaning: "find relationships, verbs and turns", note: "Use the grammar built in Level 2." },
      { term: "Layer", meaning: "hold image, history, ambiguity and performance together", note: "No single layer has to cancel the others." },
      { term: "Keep", meaning: "record what deserves return", note: "A personal anthology is a practice of chosen companionship." },
    ],
    activities: [
      { kind: "Compare", title: "Page, voice and screen", prompt: "Track what one line gains or loses across text, performance and film context.", hint: "Separate the poem's words from each medium's interpretation." },
      { kind: "Write", title: "Personal anthology record", prompt: "Choose one encounter and record text, sense, key word, performance and why you keep it.", hint: "Write for your future listening self." },
      { kind: "Listen", title: "Refrain under pressure", prompt: "Follow one refrain across a complete performance and annotate each change.", hint: "Mark pace, pitch, pause, ensemble and emotional force." },
    ],
    featured: { label: "Annotated encounter", urdu: "لگتا نہیں ہے دل مرا اجڑے دیار میں", roman: "lagta nahin hai dil mera ujre dayaar mein", sense: "My heart cannot settle in this ravaged land.", insight: "Dil lagna means both taking interest and finding belonging; exile breaks both senses at once." },
    quiz: [
      { question: "How many annotated encounters structure the capstone volume?", options: ["Ten", "Twelve", "Twenty", "Twenty-four"], answer: 3, note: "The anthology contains twenty-four guided encounters." },
      { question: "What does the comparative laboratory examine?", options: ["Only spelling", "How medium and performance change meaning", "Only publication dates", "Only rhyme names"], answer: 1, note: "Page, voice and screen make different interpretive choices." },
      { question: "What is the final purpose of a personal anthology?", options: ["Collect everything", "Keep chosen poems in active companionship", "Replace the source books", "Avoid rereading"], answer: 1, note: "Selection and return turn reading into an ongoing practice." },
      { question: "How many classical encounters open the anthology?", options: ["Six", "Eight", "Twelve", "Twenty-four"], answer: 2, note: "Part I contains twelve encounters in the classical treasury." },
      { question: "Which sequence best describes the capstone practice?", options: ["Hear, parse, layer, keep", "Skip, rate, forget, replace", "Scan, count, close, discard", "Translate only"], answer: 0, note: "The capstone gathers listening, grammar, layered reading and chosen return." },
    ],
    videoId: "7SDrjwtfKMk",
    videoTitle: "Chaap Tilak",
    videoAttribution: "Coke Studio Pakistan · Amir Khusrau",
  },
];

const additionalQuiz: Record<number, LevelQuestion[]> = {
  1: [
    { question: "Which word names intense, transformative love?", options: ["ishq", "safar", "raaz", "aavaaz"], answer: 0, note: "Ishq names love with force, risk and transformation." },
    { question: "What does wafa most nearly name?", options: ["Loyalty and faithfulness", "A broken join", "A poetic metre", "A public speech"], answer: 0, note: "Wafa is fidelity, constancy or faithfulness." },
    { question: "Which word can mean sight, glance or viewpoint?", options: ["nazar", "hijr", "gham", "visaal"], answer: 0, note: "Nazar changes meaning with context while retaining the idea of seeing." },
    { question: "What is the useful role of a memory hook?", options: ["Replace the word's meaning", "Connect a word to a concrete association", "Avoid listening", "Remove ambiguity"], answer: 1, note: "A vivid personal association helps vocabulary return in listening." },
    { question: "When first meeting a phrase, what is a helpful next move after recognising one word?", options: ["Guess a related image", "Stop the recording", "Discard the phrase", "Translate every syllable immediately"], answer: 0, note: "Known words can become an entry point into the image around them." },
  ],
  2: [
    { question: "What does goya do in a line such as tum mere paas hote ho goya?", options: ["Signals certainty", "Suspends certainty", "Marks a plural", "Creates a refrain"], answer: 1, note: "Goya lets the presence feel imagined, remembered and almost real." },
    { question: "Which small word usually adds the sense of also?", options: ["bhi", "nahin", "magar", "ka"], answer: 0, note: "Bhi adds also or even, often changing the pressure of a line." },
    { question: "What should a three-pass reading return to after grammar?", options: ["The emotional turn", "A random rhyme", "Only dates", "A dictionary alphabet"], answer: 0, note: "Grammar gives the frame, then the couplet's turn can be felt more clearly." },
    { question: "Which phrase best describes ka, ki and ke?", options: ["Possession markers", "Non-joiners", "Musical modes", "Poet names"], answer: 0, note: "They connect a possessor to what is possessed." },
    { question: "Why are tiny words important in a couplet?", options: ["They carry relationship and emphasis", "They remove all ambiguity", "They are never spoken", "They only fill metre"], answer: 0, note: "Words such as bhi, hi and nahin often bear the turning force." },
  ],
  3: [
    { question: "Where should your eye begin when reading an Urdu word?", options: ["At the right edge", "At the left edge", "At the centre", "At the final vowel only"], answer: 0, note: "Urdu is read right to left, so begin with the rightmost visible letter." },
    { question: "What does the breaker rule help you avoid?", options: ["Mistaking a pen restart for a space", "Using a familiar word", "Seeing dots", "Reading a couplet"], answer: 0, note: "A non-joiner breaks the pen-line, not necessarily the word." },
    { question: "How are short vowels usually handled in Urdu script?", options: ["They are always written", "The reader supplies them from context", "They replace consonants", "They are read backwards"], answer: 1, note: "Short a, i and u are commonly inferred through vocabulary and grammar." },
    { question: "Which letter is a non-joiner?", options: ["و", "ب", "س", "م"], answer: 0, note: "Waao accepts a join from the right but does not join onward." },
    { question: "What does a Reading Lab score of 2 mean?", options: ["Instant reading", "Reading after Roman help", "No attempt", "Correct tracing only"], answer: 0, note: "The guide awards 2 points for instant reading and 1 after segmenting." },
  ],
  4: [
    { question: "What is a maqta?", options: ["The signature couplet", "The opening couplet", "A repeated refrain", "A prose gloss"], answer: 0, note: "The maqta often makes creative use of the poet's takhallus or pen name." },
    { question: "How does qafiyah behave across a ghazal?", options: ["It rhymes before the refrain", "It repeats exactly after every line", "It never returns", "It is a biography"], answer: 0, note: "Qafiyah changes within a rhyme family immediately before the radif." },
    { question: "How many lines make a sher?", options: ["Two", "One", "Three", "Four"], answer: 0, note: "A sher is a self-contained couplet of two misras." },
    { question: "Why should a symbol not be treated as a fixed code?", options: ["It gathers different pressures in different lines", "It has no meaning", "It only indicates rhyme", "It removes context"], answer: 0, note: "Garden, flame or cage can shift meaning with voice and situation." },
    { question: "What does tapping a sher's pulse help you hear?", options: ["Weight and metre", "Only spelling", "A poet's birth date", "Page numbering"], answer: 0, note: "Recitation makes rhythmic weight audible before formal scansion." },
  ],
  5: [
    { question: "How many lines make a rubai?", options: ["Four", "Two", "Six", "Eight"], answer: 0, note: "A rubai is a compact four-line form." },
    { question: "What is a movement map made of?", options: ["Active verbs describing each section", "Only poet names", "Random images", "Alphabetical vocabulary"], answer: 0, note: "Use verbs such as invokes, widens, questions and returns." },
    { question: "Why does a nazm need a different reading posture from a sher?", options: ["Meaning develops across the whole poem", "It has no images", "It avoids all sound", "It is always shorter"], answer: 0, note: "A nazm unfolds through sustained movement rather than autonomous couplets." },
    { question: "What should you track in an image chain?", options: ["How an image changes in pressure", "Only its first dictionary meaning", "Its page number", "A singer's fame"], answer: 0, note: "A recurring image can grow emotional, historical or political force." },
    { question: "Which form is most closely associated with elegiac public memory?", options: ["marsiya", "radif", "qafiyah", "matla"], answer: 0, note: "Marsiya is elegiac poetry that carries grief and public memory." },
  ],
  6: [
    { question: "What does aavaaz mean?", options: ["Voice or sound", "A caravan", "A wound", "Justice"], answer: 0, note: "Aavaaz lets a line ask whose voice speaks and how it carries." },
    { question: "What does qaafila evoke?", options: ["A caravan and collective journey", "A vowel mark", "A private glance", "A refrain only"], answer: 0, note: "Qaafila is both a caravan and a figure for history and belonging." },
    { question: "Why compare gham, dard and zakhm?", options: ["To hear different shades of suffering", "To prove they are identical", "To avoid using words", "To learn metre"], answer: 0, note: "Near-neighbours overlap but bring distinct emotional and figurative force." },
    { question: "What does a semantic field do for recall?", options: ["Builds connected associations", "Erases meanings", "Stops interpretation", "Replaces listening"], answer: 0, note: "Garden, journey, body and society create useful memory networks." },
    { question: "Which word can carry bodily, emotional and historical pain?", options: ["zakhm", "naghma", "aavaaz", "qaafila"], answer: 0, note: "A wound can be literal, inward or collective in poetry." },
  ],
  7: [
    { question: "Which lens begins with return, pause and texture?", options: ["Sound", "Scene", "Syntax", "Ambiguity"], answer: 0, note: "The sound lens listens before it explains." },
    { question: "What does the image lens examine?", options: ["The poem's visual field and associations", "Only grammatical endings", "Only biography", "Only duration"], answer: 0, note: "Images create a field that can shift with voice and context." },
    { question: "What follows observation in a careful six-lens reading?", options: ["Your own grounded reading", "A forced single answer", "A rating without evidence", "A plot summary only"], answer: 0, note: "The personal reading comes after attending to the poem's evidence." },
    { question: "Why map echoes across a ghazal?", options: ["To notice resonance without forcing a plot", "To turn every sher into prose", "To ignore each couplet", "To remove images"], answer: 0, note: "Autonomous couplets can still speak to one another through returning images and questions." },
    { question: "What is a sound first response useful for?", options: ["Keeping the poem's texture alive", "Replacing all meaning", "Avoiding syntax", "Counting publication dates"], answer: 0, note: "Sound keeps pause, return and vocal pressure present in the interpretation." },
  ],
  8: [
    { question: "Which poet's plainness often opens into wounded depth?", options: ["Meer", "Iqbal", "Dagh", "Zafar"], answer: 0, note: "Meer's simplicity is a signature of his intimate, sentient world." },
    { question: "What is a hamd?", options: ["Praise of God", "A signature couplet", "A film song", "A grammar rule"], answer: 0, note: "Hamd is praise before petition in the qawwali tradition." },
    { question: "What does a qawwali party's answer do?", options: ["Turns a private line into social fact", "Stops the performance", "Erases the text", "Removes rhythm"], answer: 0, note: "Response makes the lead's utterance collective." },
    { question: "What might intensification involve?", options: ["Tempo, clapping, height and vocal exchange", "Only silence", "A new alphabet", "Removing the refrain"], answer: 0, note: "Qawwali increases pressure through rhythm, volume and exchange." },
    { question: "Which word describes Faiz's lyric stance in public history?", options: ["Witness", "Isolation only", "Wordless metre", "Private spelling"], answer: 0, note: "Faiz widens lyric beauty into historical and ethical witness." },
  ],
  9: [
    { question: "Which ear asks what actually survives after the performance?", options: ["Afterlife", "Word", "Music", "Sentence"], answer: 0, note: "The afterlife ear names what remains: a word, pulse, image or question." },
    { question: "What does the gathering ear attend to?", options: ["Response, repetition requests and daad", "Only headphones", "Only page layout", "Only subtitles"], answer: 0, note: "A performance also includes the attention and response around it." },
    { question: "What should the first listening avoid?", options: ["Immediate word-by-word translation", "Noticing pace", "Hearing return", "Registering mood"], answer: 0, note: "First register movement, return and pressure before translating." },
    { question: "Which mode foregrounds the spoken poem and its phrasing?", options: ["Recitation", "Qafiyah", "Izafat", "Marsiya only"], answer: 0, note: "Recitation foregrounds text, pause, stress and dramatic address." },
    { question: "What does the time ear notice?", options: ["Pause, duration, acceleration and delay", "Only word meaning", "Only rhyme labels", "Only a singer's name"], answer: 0, note: "Timing changes the pressure and meaning of a performance." },
  ],
  10: [
    { question: "What is the first step in the anthology practice?", options: ["Hear once without pausing", "Translate every word", "Choose a favourite singer", "Write a rating"], answer: 0, note: "The practice begins with an uninterrupted first hearing." },
    { question: "When should Roman Urdu be used in the seven-step method?", options: ["Only when script blocks recognition", "Before seeing Urdu", "Instead of every source text", "Never"], answer: 0, note: "Urdu remains the first bridge; Roman support is used selectively." },
    { question: "What does parse ask you to locate?", options: ["The grammatical hinge", "A thumbnail", "Only a rhyme", "A biography"], answer: 0, note: "Look for denial, address, comparison, question or reversal." },
    { question: "What does recite add after hearing and comparison?", options: ["Embodied attention to the line", "A final translation only", "A new source link", "A numerical score"], answer: 0, note: "Speaking plainly, metrically and with restraint tests what the line does in the mouth." },
    { question: "Why compare second renditions rather than celebrity?", options: ["To identify audible choices", "To rank performers", "To avoid the text", "To stop listening"], answer: 0, note: "Comparison should stay with pace, diction, selection, repetition and closure." },
  ],
};

export const levelContent = baseLevelContent.map((level) => ({ ...level, quiz: [...level.quiz, ...additionalQuiz[level.id]] }));

export const getLevelContent = (id: number) => levelContent.find((level) => level.id === id) ?? levelContent[0];
