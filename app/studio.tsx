"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ExternalLink,
  FileText,
  Headphones,
  Library,
  Layers3,
  Lightbulb,
  LogOut,
  Menu,
  PenLine,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { signOut as authSignOut } from "./lib/auth-client";
import type { SessionUser } from "./lib/session";
import {
  externalLinks,
  listeningLinks,
  listeningTracks,
  quizQuestions,
  scriptFamilies,
  volumes,
  words,
} from "./data";
import type { Volume } from "./data";
import { getLevelContent, levelContent } from "./level-content";
import guideContentJson from "./guide-content.json";

type GuideSection = {
  id: string;
  title: string;
  depth: number;
  kind: "Lesson" | "Practice" | "Listening" | "Reference";
  paragraphs: string[];
};

type GuideVocabulary = {
  roman: string;
  urdu: string;
  meaning: string;
  connection: string;
  memory: string;
  example: string;
};

type GuideVolume = {
  volume: number;
  title: string;
  sections: GuideSection[];
  vocabulary: GuideVocabulary[];
  tables: string[][][];
};

const guideContent = guideContentJson as GuideVolume[];

const pronunciationOverrides: Record<string, string> = {
  "اور": "aur",
  "ہے": "hai",
  "ہیں": "hain",
  "کا": "ka",
  "کی": "ki",
  "کے": "ke",
  "میں": "mein",
  "سے": "se",
  "کو": "ko",
  "پر": "par",
  "یہ": "yeh",
  "وہ": "woh",
};

const guidePronunciations = new Map([
  ...guideContent.flatMap((volume) => volume.vocabulary.map((word) => [word.urdu, word.roman] as const)),
  ...Object.entries(pronunciationOverrides),
]);

const urduLetters: Record<string, string> = {
  "ا": "a", "آ": "aa", "ب": "b", "پ": "p", "ت": "t", "ٹ": "t", "ث": "s", "ج": "j", "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ڈ": "d", "ذ": "z", "ر": "r", "ڑ": "r", "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s", "ض": "z", "ط": "t", "ظ": "z", "ع": "", "غ": "gh", "ف": "f", "ق": "q", "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n", "ں": "n", "و": "w", "ہ": "h", "ھ": "h", "ء": "", "ی": "y", "ے": "e", "ئ": "i", "ؤ": "o",
};

const containsUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);

const romanizeUrdu = (text: string) => text.replace(/[\u0621-\u06D3]+/g, (word) => (
  guidePronunciations.get(word) ?? Array.from(word).map((letter) => urduLetters[letter] ?? "").join("")
));

const speakUrdu = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ur"));
  utterance.lang = voice?.lang ?? "ur-PK";
  utterance.rate = 0.78;
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

type Section = "today" | "study" | "script" | "listen" | "quiz" | "library";

const navItems: { id: Section; label: string; icon: typeof BookOpen }[] = [
  { id: "today", label: "Today", icon: Sparkles },
  { id: "study", label: "Levels 1–10", icon: Layers3 },
  { id: "script", label: "Script lab", icon: PenLine },
  { id: "listen", label: "Listening", icon: Headphones },
  { id: "quiz", label: "Quizzes", icon: Trophy },
  { id: "library", label: "Library", icon: Library },
];

/**
 * Progress lives per-account, so two people signing in on the same device do
 * not inherit each other's completed volumes. Set once from the session.
 */
let storageScope = "anon";
export const setStorageScope = (userId: string) => { storageScope = userId; };

const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const value = window.localStorage.getItem(`${storageScope}:${key}`);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`${storageScope}:${key}`, JSON.stringify(value));
    }
  },
};

const scriptDrills = [
  { word: "بہار", answer: "bahaar", choices: ["bahaar", "pyaar", "safar"], notice: "Find the bowl, then use the dot below to confirm be.", task: "Cover the Roman reading. Read the word right to left, then uncover it only to check." },
  { word: "خواب", answer: "khwaab", choices: ["haal", "khwaab", "chaand"], notice: "The cup has one dot above: khe, not ḥe.", task: "Trace the cup with your eye before saying the full word twice." },
  { word: "درد", answer: "dard", choices: ["dard", "raaz", "wafa"], notice: "Daal and re both break the pen-line without making a new word.", task: "Mark every visual restart; the whole shape is still one word." },
  { word: "شعر", answer: "sher", choices: ["safar", "sher", "sukoon"], notice: "Three dots crown the three-tooth path: sheen, not seen.", task: "Name the dot pattern before you read the word aloud." },
  { word: "طلب", answer: "talab", choices: ["zulm", "sada", "talab"], notice: "The upright crown identifies to'e; modern Urdu still lets the word sound like t.", task: "Read for spelling recognition, not an exaggerated historical pronunciation." },
  { word: "غزل", answer: "ghazal", choices: ["ishq", "ghazal", "umr"], notice: "One dot changes ain into ghain.", task: "Locate the dot first, then let the familiar poetry word arrive." },
  { word: "قسمت", answer: "qismat", choices: ["qismat", "firaaq", "gul"], notice: "Qaaf carries two dots; use the tall and rounded bodies as a whole-word cue.", task: "Try the word once without naming every letter." },
  { word: "کہاں", answer: "kahaan", choices: ["mohabbat", "nazar", "kahaan"], notice: "Final noon ghunna has no dot and nasalises the ending.", task: "Compare noon with noon ghunna before checking the Roman bridge." },
  { word: "پھر", answer: "phir", choices: ["ham", "thaa", "phir"], notice: "Do-chashmi he modifies the consonant before it: ph, not p + h as two separate beats.", task: "Say the aspirated sound once, then read the full word normally." },
  { word: "آئینہ", answer: "aaina", choices: ["yaad", "mere", "aaina"], notice: "Hamza keeps adjacent vowel sounds apart.", task: "Find the vowel break before you reveal the Roman reading." },
];

const scriptReadings: Record<string, string> = {
  "بہار": "bahaar", "پیار": "pyaar", "تنہا": "tanhaa", "ثواب": "sawaab",
  "جان": "jaan", "چاند": "chaand", "حال": "haal", "خواب": "khwaab",
  "آج": "aaj", "درد": "dard", "راز": "raaz", "وفا": "wafa",
  "سفر": "safar", "شب": "shab", "شعر": "sher", "سکون": "sukoon",
  "صدا": "sada", "ضرور": "zaroor", "طلب": "talab", "ظلم": "zulm",
  "عشق": "ishq", "عمر": "umr", "غم": "gham", "غزل": "ghazal",
  "فراق": "firaaq", "قسمت": "qismat", "کیا": "kya", "گل": "gul",
  "محبت": "mohabbat", "نظر": "nazar", "کہاں": "kahaan", "نام": "naam",
  "ہم": "ham", "پھر": "phir", "تھا": "thaa",
  "یاد": "yaad", "میرے": "mere", "آئینہ": "aaina", "کہیے": "kahiye",
};

export default function Studio({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const name = user.name?.trim() || user.email.split("@")[0];
  const [section, setSection] = useState<Section>("today");
  const [mobileNav, setMobileNav] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedLevelTab, setSelectedLevelTab] = useState<LevelTab>("overview");
  const [readerVolume, setReaderVolume] = useState<Volume | null>(null);

  // Scope every localStorage read to this account before any child mounts.
  setStorageScope(user.id);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCompleted(storage.get<number[]>("sukhan-completed", []));
      setKnownWords(storage.get<string[]>("sukhan-known", []));
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const progress = Math.round((completed.length / volumes.length) * 100);

  const toggleCompleted = (id: number) => {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    storage.set("sukhan-completed", next);
  };

  const toggleKnown = (roman: string) => {
    const next = knownWords.includes(roman)
      ? knownWords.filter((item) => item !== roman)
      : [...knownWords, roman];
    setKnownWords(next);
    storage.set("sukhan-known", next);
  };

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authSignOut();
    } finally {
      // Revalidate on the server so the session gate sends us to /login.
      router.replace("/login");
      router.refresh();
    }
  };

  const openLevel = (id: number, sectionId?: string, tab: LevelTab = sectionId ? "learn" : "overview") => {
    setSelectedLevel(id);
    setSelectedSectionId(sectionId ?? null);
    setSelectedLevelTab(tab);
    setSection("study");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!ready) return <div className="app-loading" aria-label="Loading Sukhan" />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <span className="brand-mark" lang="ur" dir="rtl">سخن</span>
          <div>
            <strong>Sukhan</strong>
            <span>Urdu poetry studio</span>
          </div>
        </div>

        <button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close navigation">
          <X size={20} />
        </button>

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={section === item.id ? "nav-item active" : "nav-item"}
                onClick={() => { setSection(item.id); setMobileNav(false); }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-progress">
          <div className="progress-orbit" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <span>{progress}%</span>
          </div>
          <div>
            <strong>Your journey</strong>
            <span>{completed.length} of 10 volumes</span>
          </div>
        </div>

        <div className="profile-row">
          <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{name}</strong>
            <span title={user.email}>{user.email}</span>
          </div>
          <button
            className="icon-button"
            onClick={signOut}
            disabled={signingOut}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <button className="menu-button icon-button" onClick={() => setMobileNav(true)} aria-label="Open navigation">
            <Menu size={21} />
          </button>
          <div className="mobile-brand"><span lang="ur" dir="rtl">سخن</span> Sukhan</div>
          <div className="top-actions">
            <button className="icon-button" onClick={() => setSection("library")} aria-label="Search the library" title="Search library">
              <Search size={19} />
            </button>
            <button className="profile-chip" onClick={() => setSection("today")}>
              <CircleUserRound size={18} />
              <span>{name}</span>
            </button>
          </div>
        </header>

        {section === "today" && (
          <Today
            name={name}
            completed={completed}
            knownCount={knownWords.length}
            onSection={setSection}
            onToggleCompleted={toggleCompleted}
            onOpenLevel={openLevel}
            onOpenPdf={(id) => setReaderVolume(volumes[id - 1])}
          />
        )}
        {section === "study" && (
          <LevelStudio
            key={`${selectedLevel}-${selectedSectionId ?? "start"}-${selectedLevelTab}`}
            levelId={selectedLevel}
            initialSectionId={selectedSectionId ?? undefined}
            initialTab={selectedLevelTab}
            onLevel={(id) => openLevel(id)}
            completed={completed}
            knownWords={knownWords}
            onToggleKnown={toggleKnown}
            onToggleCompleted={toggleCompleted}
            onOpenPdf={(id) => setReaderVolume(volumes[id - 1])}
          />
        )}
        {section === "script" && <ScriptLab onOpenLevel={openLevel} onOpenPdf={(id) => setReaderVolume(volumes[id - 1])} />}
        {section === "listen" && <ListeningRoom onOpenLevel={openLevel} onOpenPdf={(id) => setReaderVolume(volumes[id - 1])} />}
        {section === "quiz" && <QuizRoom onOpenLevel={openLevel} />}
        {section === "library" && (
          <LibraryRoom
            completed={completed}
            onToggleCompleted={toggleCompleted}
            onOpenPdf={(id) => setReaderVolume(volumes[id - 1])}
            onOpenLevel={openLevel}
          />
        )}
      </main>
      {readerVolume && (
        <PdfReader
          volume={readerVolume}
          onClose={() => setReaderVolume(null)}
          onChange={(id) => setReaderVolume(volumes[id - 1])}
        />
      )}
    </div>
  );
}

function Today({
  name,
  completed,
  knownCount,
  onSection,
  onToggleCompleted,
  onOpenLevel,
  onOpenPdf,
}: {
  name: string;
  completed: number[];
  knownCount: number;
  onSection: (section: Section) => void;
  onToggleCompleted: (id: number) => void;
  onOpenLevel: (id: number) => void;
  onOpenPdf: (id: number) => void;
}) {
  const nextVolume = volumes.find((volume) => !completed.includes(volume.id)) ?? volumes[9];
  const dayWord = words[new Date().getDate() % words.length];

  return (
    <div className="page-content">
      <section className="welcome-band">
        <div>
          <span className="eyebrow">Your poetry practice</span>
          <h1>Good to see you, {name}.</h1>
          <p>Begin with one word, one line, and one attentive hearing.</p>
        </div>
        <div className="streak-tile">
          <span className="streak-number">07</span>
          <span>day rhythm</span>
        </div>
      </section>

      <section className="today-grid">
        <article className="continue-panel" style={{ "--volume-color": nextVolume.color } as React.CSSProperties}>
          <div className="continue-copy">
            <span className="overline">Continue · Volume {nextVolume.id}</span>
            <h2>{nextVolume.title}</h2>
            <p>{nextVolume.strapline}</p>
            <div className="topic-row">
              {nextVolume.topics.map((topic) => <span key={topic}>{topic}</span>)}
            </div>
            <div className="button-row">
              <button className="primary-button" onClick={() => onOpenLevel(nextVolume.id)}>
                <Play size={17} fill="currentColor" /> Begin session
              </button>
              <button className="secondary-button" onClick={() => onOpenPdf(nextVolume.id)}>
                <BookOpen size={17} /> Open volume
              </button>
            </div>
          </div>
          <img src={nextVolume.cover} alt={`Cover of Volume ${nextVolume.id}: ${nextVolume.title}`} />
        </article>

        <article className="word-panel">
          <div className="panel-heading">
            <div>
              <span className="overline">Word of the day</span>
              <h2>{dayWord.roman}</h2>
            </div>
            <Volume2 size={21} />
          </div>
          <div className="daily-urdu" lang="ur" dir="rtl">{dayWord.urdu}</div>
          <p className="daily-meaning">{dayWord.meaning}</p>
          <div className="phrase-line"><span>{dayWord.phrase}</span><span>{dayWord.phraseMeaning}</span></div>
          <button className="text-button" onClick={() => onOpenLevel(1)}>Study the deck <ChevronRight size={16} /></button>
        </article>
      </section>

      <section className="metric-strip" aria-label="Learning progress">
        <div><strong>{completed.length}</strong><span>volumes completed</span></div>
        <div><strong>{knownCount}</strong><span>study items recognised</span></div>
        <div><strong>24</strong><span>guided encounters</span></div>
        <div><strong>394</strong><span>pages in your library</span></div>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <div><span className="eyebrow">The complete path</span><h2>Ten volumes, one listening practice</h2></div>
          <button className="text-button" onClick={() => onSection("library")}>View library <ArrowRight size={16} /></button>
        </div>
        <div className="journey-list">
          {volumes.map((volume) => (
            <article className="journey-row" key={volume.id}>
              <span className="journey-number" style={{ color: volume.color }}>{String(volume.id).padStart(2, "0")}</span>
              <button className="journey-main" onClick={() => onOpenLevel(volume.id)}>
                <span className="journey-urdu" lang="ur" dir="rtl">{volume.urdu}</span>
                <h3>{volume.title}</h3>
              </button>
              <span className="journey-level">{volume.level}</span>
              <span className="journey-duration">{volume.duration}</span>
              <button
                className={completed.includes(volume.id) ? "complete-button completed" : "complete-button"}
                onClick={() => onToggleCompleted(volume.id)}
                aria-label={`${completed.includes(volume.id) ? "Mark incomplete" : "Mark complete"}: ${volume.title}`}
              >
                {completed.includes(volume.id) ? <Check size={17} /> : <span />}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

type LevelTab = "overview" | "learn" | "practice" | "quiz";
type LearnMode = "reader" | "vocabulary" | "reference";

function LevelStudio({
  levelId,
  initialSectionId,
  initialTab = "overview",
  onLevel,
  completed,
  knownWords,
  onToggleKnown,
  onToggleCompleted,
  onOpenPdf,
}: {
  levelId: number;
  initialSectionId?: string;
  initialTab?: LevelTab;
  onLevel: (id: number) => void;
  completed: number[];
  knownWords: string[];
  onToggleKnown: (key: string) => void;
  onToggleCompleted: (id: number) => void;
  onOpenPdf: (id: number) => void;
}) {
  const content = getLevelContent(levelId);
  const volume = volumes[levelId - 1];
  const guide = guideContent[levelId - 1];
  const [tab, setTab] = useState<LevelTab>(initialTab);
  const [learnMode, setLearnMode] = useState<LearnMode>("reader");
  const [sectionQuery, setSectionQuery] = useState("");
  const [sectionKind, setSectionKind] = useState("All");
  const [activeSectionId, setActiveSectionId] = useState(initialSectionId ?? guide.sections[0]?.id ?? "");
  const [completedSections, setCompletedSections] = useState<string[]>(() => storage.get<string[]>(`sukhan-level-${levelId}-sections`, []));
  const [vocabularyQuery, setVocabularyQuery] = useState("");
  const [openVocabulary, setOpenVocabulary] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  const [cardOpen, setCardOpen] = useState(false);
  const [activityDone, setActivityDone] = useState<number[]>(() => storage.get<number[]>(`sukhan-level-${levelId}-activities`, []));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const card = content.cards[cardIndex];
  const cardKey = `${levelId}:${card.term}`;
  const question = content.quiz[questionIndex];
  const selectedAnswer = answers[questionIndex];
  const quizFinished = answers.length === content.quiz.length;
  const quizScore = answers.reduce((score, answer, index) => score + (answer === content.quiz[index].answer ? 1 : 0), 0);
  const activeSection = guide.sections.find((section) => section.id === activeSectionId) ?? guide.sections[0];
  const activeSectionIndex = guide.sections.findIndex((section) => section.id === activeSection?.id);
  const filteredSections = guide.sections.filter((section) => {
    const matchesKind = sectionKind === "All" || section.kind === sectionKind;
    const haystack = `${section.title} ${section.paragraphs.join(" ")}`.toLowerCase();
    return matchesKind && haystack.includes(sectionQuery.trim().toLowerCase());
  });
  const filteredVocabulary = guide.vocabulary.filter((word) => `${word.roman} ${word.urdu} ${word.meaning} ${word.connection}`.toLowerCase().includes(vocabularyQuery.trim().toLowerCase()));
  const practiceSections = guide.sections.filter((section) => section.kind === "Practice");
  const nextMajorSectionIndex = guide.sections.findIndex((section, index) => index > activeSectionIndex && section.depth === 1);
  const childSections = activeSection?.depth === 1
    ? guide.sections.slice(activeSectionIndex + 1, nextMajorSectionIndex === -1 ? guide.sections.length : nextMajorSectionIndex).filter((section) => section.depth === 2)
    : [];

  const openSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setLearnMode("reader");
    setTab("learn");
    window.requestAnimationFrame(() => document.querySelector(".guide-article")?.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const toggleSectionComplete = (sectionId: string) => {
    const next = completedSections.includes(sectionId) ? completedSections.filter((id) => id !== sectionId) : [...completedSections, sectionId];
    setCompletedSections(next);
    storage.set(`sukhan-level-${levelId}-sections`, next);
  };

  const toggleActivity = (index: number) => {
    const next = activityDone.includes(index) ? activityDone.filter((item) => item !== index) : [...activityDone, index];
    setActivityDone(next);
    storage.set(`sukhan-level-${levelId}-activities`, next);
  };

  const selectAnswer = (answer: number) => {
    if (selectedAnswer !== undefined) return;
    setAnswers([...answers, answer]);
  };

  const moveCard = (direction: number) => {
    setCardOpen(false);
    setCardIndex((cardIndex + direction + content.cards.length) % content.cards.length);
  };

  return (
    <div className="page-content level-page">
      <div className="level-switcher" aria-label="Choose a level">
        {levelContent.map((item) => (
          <button
            key={item.id}
            className={item.id === levelId ? "active" : completed.includes(item.id) ? "complete" : ""}
            onClick={() => onLevel(item.id)}
            aria-label={`Open level ${item.id}`}
          >
            <span>{String(item.id).padStart(2, "0")}</span>
            {completed.includes(item.id) && <Check size={13} />}
          </button>
        ))}
      </div>

      <section className="level-hero" style={{ "--volume-color": volume.color } as React.CSSProperties}>
        <div className="level-cover"><img src={volume.cover} alt={`Cover of Level ${levelId}: ${volume.title}`} /></div>
        <div className="level-hero-copy">
          <span className="overline">Level {levelId} · {volume.level}</span>
          <h1>{volume.title}</h1>
          <p>{content.description}</p>
          <div className="level-facts">
            <span>{guide.sections.length} study sections</span>
            <span>{practiceSections.length + content.activities.length} activities</span>
            {guide.vocabulary.length > 0 && <span>{guide.vocabulary.length} vocabulary entries</span>}
            <span>{volume.pages} source pages</span>
          </div>
          <div className="button-row level-actions">
            <button className="primary-button" onClick={() => { setLearnMode("reader"); setTab("learn"); }}><Play size={16} fill="currentColor" /> Start learning</button>
            <button className="secondary-button" onClick={() => onOpenPdf(levelId)}><BookOpen size={16} /> Read source PDF</button>
            <button className={completed.includes(levelId) ? "secondary-button level-complete active" : "secondary-button level-complete"} onClick={() => onToggleCompleted(levelId)}>
              <CheckCircle2 size={16} /> {completed.includes(levelId) ? "Completed" : "Mark complete"}
            </button>
          </div>
        </div>
      </section>

      <div className="level-tabs segmented-control" role="tablist" aria-label={`Level ${levelId} sections`}>
        {(["overview", "learn", "practice", "quiz"] as LevelTab[]).map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      {tab === "overview" && (
        <section className="level-overview">
          <div className="outcome-panel">
            <span className="eyebrow">What this level unlocks</span>
            <h2>{content.theme}</h2>
            <div className="outcome-list">
              {content.outcomes.map((outcome, index) => <div key={outcome}><span>{index + 1}</span><p>{outcome}</p></div>)}
            </div>
            <div className="source-progress">
              <div><span>Study progress</span><strong>{completedSections.length} / {guide.sections.length}</strong></div>
              <div><span style={{ width: `${Math.min(100, (completedSections.length / guide.sections.length) * 100)}%` }} /></div>
            </div>
          </div>
          <div className="lesson-map">
            <div className="activity-header"><div><span className="overline">Complete Volume {levelId} curriculum</span><h2>Major sections</h2></div><FileText size={20} /></div>
            {guide.sections.filter((section) => section.depth === 1).slice(0, 8).map((section, index) => (
              <button key={section.id} onClick={() => openSection(section.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{section.title}</strong><small>{section.kind} · {section.paragraphs.length || "grouped"} reading notes</small></div>
                <em>{completedSections.includes(section.id) ? "Done" : "Open"}</em>
                <ChevronRight size={17} />
              </button>
            ))}
            <button className="lesson-map-all" onClick={() => { setLearnMode("reader"); setTab("learn"); }}><span>{guide.sections.length}</span><div><strong>Open the complete guide</strong><small>Every lesson, workshop, encounter and reference section</small></div><em>View all</em><ChevronRight size={17} /></button>
          </div>
          <article className="featured-reading">
            <div><span className="overline">{content.featured.label}</span><h2>Close-reading seed</h2></div>
            <blockquote lang="ur" dir="rtl">{content.featured.urdu}</blockquote>
            <p className="roman-line">{content.featured.roman}</p>
            <div className="reading-notes"><p><strong>Plain sense</strong>{content.featured.sense}</p><p><strong>Why it matters</strong>{content.featured.insight}</p></div>
          </article>
        </section>
      )}

      {tab === "learn" && (
        <section className="complete-study">
          <div className="complete-study-toolbar">
            <div>
              <span className="overline">Volume {levelId} · Complete study edition</span>
              <h2>{learnMode === "reader" ? "Lesson reader" : learnMode === "vocabulary" ? (guide.vocabulary.length ? "Complete vocabulary" : "Key concepts") : "Reference tables"}</h2>
            </div>
            <div className="segmented-control" role="tablist" aria-label="Study format">
              <button className={learnMode === "reader" ? "active" : ""} onClick={() => setLearnMode("reader")}>Lessons · {guide.sections.length}</button>
              <button className={learnMode === "vocabulary" ? "active" : ""} onClick={() => setLearnMode("vocabulary")}>{guide.vocabulary.length ? `Vocabulary · ${guide.vocabulary.length}` : "Study cards"}</button>
              <button className={learnMode === "reference" ? "active" : ""} onClick={() => setLearnMode("reference")}>Tables · {guide.tables.length}</button>
            </div>
          </div>

          {learnMode === "reader" && activeSection && (
            <div className="guide-reader-shell">
              <aside className="guide-rail">
                <label className="search-field"><Search size={17} /><input value={sectionQuery} onChange={(event) => setSectionQuery(event.target.value)} placeholder="Search this volume" /></label>
                <div className="guide-kind-filter">
                  {["All", "Lesson", "Practice", "Listening", "Reference"].map((kind) => <button key={kind} className={sectionKind === kind ? "active" : ""} onClick={() => setSectionKind(kind)}>{kind}</button>)}
                </div>
                <div className="guide-section-list">
                  {filteredSections.map((section) => (
                    <button key={section.id} className={`${activeSection.id === section.id ? "active" : ""} ${section.depth === 2 ? "nested" : ""}`} onClick={() => setActiveSectionId(section.id)}>
                      <span>{completedSections.includes(section.id) ? <Check size={13} /> : section.kind.slice(0, 1)}</span>
                      <div><strong>{section.title}</strong><small>{section.kind}</small></div>
                    </button>
                  ))}
                  {filteredSections.length === 0 && <p className="empty-guide-search">No matching sections.</p>}
                </div>
              </aside>

              <article className="guide-article">
                <header>
                  <div><span className="overline">{activeSection.kind} · Section {activeSectionIndex + 1} of {guide.sections.length}</span><h2>{activeSection.title}</h2></div>
                  <button className={completedSections.includes(activeSection.id) ? "secondary-button level-complete active" : "secondary-button"} onClick={() => toggleSectionComplete(activeSection.id)}><CheckCircle2 size={16} /> {completedSections.includes(activeSection.id) ? "Studied" : "Mark studied"}</button>
                </header>
                <div className="guide-prose">
                  {activeSection.paragraphs.map((paragraph, index) => containsUrdu(paragraph) ? (
                    <div className="guide-pronunciation" key={`${activeSection.id}-${index}`}>
                      <p lang="ur" dir="rtl">{paragraph}</p>
                      <div>
                        <span>{romanizeUrdu(paragraph)}</span>
                        <button className="icon-button bordered" onClick={() => speakUrdu(paragraph)} aria-label={`Listen to Urdu pronunciation: ${romanizeUrdu(paragraph)}`} title="Listen to pronunciation"><Volume2 size={17} /></button>
                      </div>
                    </div>
                  ) : <p key={`${activeSection.id}-${index}`}>{paragraph}</p>)}
                  {activeSection.paragraphs.length === 0 && childSections.length > 0 && (
                    <div className="included-sections"><span className="overline">Included sections</span>{childSections.map((section) => <button key={section.id} onClick={() => setActiveSectionId(section.id)}><span>{section.kind}</span><strong>{section.title}</strong><ChevronRight size={16} /></button>)}</div>
                  )}
                  {activeSection.paragraphs.length === 0 && childSections.length === 0 && <p>This section is a signpost in the source guide. Continue to the adjacent lesson for the full exercise or reading.</p>}
                </div>
                <footer className="guide-reader-nav">
                  <button className="secondary-button" disabled={activeSectionIndex <= 0} onClick={() => setActiveSectionId(guide.sections[activeSectionIndex - 1].id)}><ChevronLeft size={16} /> Previous</button>
                  <button className="secondary-button" onClick={() => onOpenPdf(levelId)}><BookOpen size={16} /> View source page</button>
                  <button className="primary-button" disabled={activeSectionIndex >= guide.sections.length - 1} onClick={() => setActiveSectionId(guide.sections[activeSectionIndex + 1].id)}>Next <ChevronRight size={16} /></button>
                </footer>
              </article>
            </div>
          )}

          {learnMode === "vocabulary" && (
            guide.vocabulary.length > 0 ? (
              <div className="vocabulary-browser">
                <div className="vocabulary-browser-tools"><label className="search-field"><Search size={17} /><input value={vocabularyQuery} onChange={(event) => setVocabularyQuery(event.target.value)} placeholder={`Search ${guide.vocabulary.length} words`} /></label><span>{filteredVocabulary.length} entries</span></div>
                <div className="vocabulary-grid">
                  {filteredVocabulary.map((word, index) => {
                    const wordKey = `${levelId}:full:${word.roman}`;
                    const isOpen = openVocabulary === wordKey;
                    return (
                      <article className={isOpen ? "vocabulary-entry open" : "vocabulary-entry"} key={`${word.roman}-${index}`}>
                        <button className="vocabulary-main" onClick={() => setOpenVocabulary(isOpen ? "" : wordKey)}>
                          <span className="vocabulary-number">{String(index + 1).padStart(3, "0")}</span>
                          <span className="vocabulary-urdu" lang="ur" dir="rtl">{word.urdu}</span>
                          <div><strong>{word.roman}</strong><small>{word.meaning}</small></div>
                          <ChevronRight size={17} />
                        </button>
                        {isOpen && <div className="vocabulary-detail">{word.connection && <p><strong>Connection</strong>{word.connection}</p>}{word.memory && <p><strong>Memory hook</strong>{word.memory}</p>}{word.example && <p><strong>In use</strong>{word.example}</p>}<button className={knownWords.includes(wordKey) ? "known-button known" : "known-button"} onClick={() => onToggleKnown(wordKey)}><CheckCircle2 size={17} /> {knownWords.includes(wordKey) ? "Recognised" : "Mark recognised"}</button></div>}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="level-learn-grid compact-deck">
                <div className="level-deck">
                  <div className="activity-header"><div><span className="overline">Revision deck</span><h2>Recognise the idea</h2></div><span>{cardIndex + 1} / {content.cards.length}</span></div>
                  <button className={cardOpen ? "level-card is-open" : "level-card"} onClick={() => setCardOpen(!cardOpen)}><div className="level-card-face">{card.urdu && <span lang="ur" dir="rtl">{card.urdu}</span>}<strong>{card.term}</strong><small>{cardOpen ? card.meaning : "Tap to reveal"}</small>{cardOpen && <p>{card.note}</p>}</div></button>
                  <div className="deck-controls"><button className="icon-button bordered" onClick={() => moveCard(-1)} aria-label="Previous card"><ArrowLeft size={18} /></button><button className={knownWords.includes(cardKey) ? "known-button known" : "known-button"} onClick={() => onToggleKnown(cardKey)}><CheckCircle2 size={18} /> {knownWords.includes(cardKey) ? "Recognised" : "Mark recognised"}</button><button className="icon-button bordered" onClick={() => moveCard(1)} aria-label="Next card"><ArrowRight size={18} /></button></div>
                </div>
                <div className="lesson-detail-list"><span className="overline">Guided pathway</span><h2>Core study sequence</h2>{content.lessons.map((lesson, index) => <article key={lesson.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{lesson.title}</h3><p>{lesson.focus}</p></div><em>{lesson.minutes} min</em></article>)}</div>
              </div>
            )
          )}

          {learnMode === "reference" && (
            <div className="reference-tables">
              {guide.tables.map((table, tableIndex) => (
                <article key={`table-${tableIndex}`}><div><span className="overline">Reference table</span><h3>Table {tableIndex + 1}</h3></div><div className="table-scroll"><table><tbody>{table.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => rowIndex === 0 ? <th key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div></article>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "practice" && (
        <section className="practice-layout">
          <div className="practice-list">
            <div className="activity-header"><div><span className="overline">Guided activities</span><h2>Make the level active</h2></div><span>{activityDone.length} / {content.activities.length} complete</span></div>
            {content.activities.map((activity, index) => (
              <article className={activityDone.includes(index) ? "practice-card done" : "practice-card"} key={activity.title}>
                <div className="practice-card-top"><span>{activity.kind}</span><button onClick={() => toggleActivity(index)} aria-label={`Mark ${activity.title} ${activityDone.includes(index) ? "not done" : "done"}`}>{activityDone.includes(index) && <Check size={16} />}</button></div>
                <h3>{activity.title}</h3>
                <p>{activity.prompt}</p>
                <div className="activity-hint"><Lightbulb size={15} /><span>{activity.hint}</span></div>
                {activity.kind === "Write" && <textarea aria-label={`${activity.title} notes`} placeholder="Write your response here..." />}
              </article>
            ))}
            {practiceSections.length > 0 && (
              <div className="practice-catalogue">
                <div><span className="overline">Complete source practice</span><h2>{practiceSections.length} workshops, labs and encounters</h2></div>
                <div>
                  {practiceSections.map((section, index) => (
                    <button key={section.id} onClick={() => openSection(section.id)}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div><strong>{section.title}</strong><small>{section.paragraphs.length} reading and practice notes</small></div>
                      {completedSections.includes(section.id) ? <CheckCircle2 size={17} /> : <ChevronRight size={17} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="practice-sidebar">
            <span className="overline">Keep the source nearby</span>
            <h2>Read while you practise</h2>
            <p>The original Volume {levelId} stays inside Sukhan, so you can move between an activity and its full context.</p>
            <button className="secondary-button" onClick={() => onOpenPdf(levelId)}><BookOpen size={17} /> Open PDF reader</button>
            {content.videoId && (
              <div className="level-video">
                <div className="mini-video"><iframe src={`https://www.youtube-nocookie.com/embed/${content.videoId}?rel=0`} title={content.videoTitle ?? `Level ${levelId} listening practice`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
                <p><strong>{content.videoTitle}</strong>{content.videoAttribution && <span>{content.videoAttribution}</span>}</p>
              </div>
            )}
          </aside>
        </section>
      )}

      {tab === "quiz" && (
        <section className="level-quiz-wrap">
          {!quizFinished ? (
            <div className="quiz-card">
              <div className="quiz-topline"><span>Level {levelId} · Question {questionIndex + 1} of {content.quiz.length}</span><span>{quizScore} correct</span></div>
              <div className="quiz-progress"><span style={{ width: `${((questionIndex + 1) / content.quiz.length) * 100}%` }} /></div>
              <h2>{question.question}</h2>
              <div className="answer-grid">
                {question.options.map((option, index) => {
                  const answered = selectedAnswer !== undefined;
                  const correct = answered && index === question.answer;
                  const wrong = answered && index === selectedAnswer && index !== question.answer;
                  return <button key={option} className={correct ? "correct" : wrong ? "wrong" : ""} onClick={() => selectAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{correct && <Check size={18} />}{wrong && <X size={18} />}</button>;
                })}
              </div>
              {selectedAnswer !== undefined && <div className="answer-note"><strong>{selectedAnswer === question.answer ? "Exactly." : "Not quite."}</strong><span>{question.note}</span></div>}
              <button className="primary-button next-question" disabled={selectedAnswer === undefined} onClick={() => setQuestionIndex(questionIndex + 1)}>
                {questionIndex === content.quiz.length - 1 ? "See result" : "Next question"} <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="quiz-result">
              <div className="result-medallion"><Trophy size={34} /><strong>{quizScore}/{content.quiz.length}</strong></div>
              <span className="overline">Level {levelId} checkpoint complete</span>
              <h2>{quizScore === content.quiz.length ? "This level is settling in." : "One more pass will make it stick."}</h2>
              <p>Review the cards or move ahead when you are ready.</p>
              <div className="button-row quiz-result-actions">
                <button className="secondary-button" onClick={() => { setAnswers([]); setQuestionIndex(0); }}><RotateCcw size={16} /> Try again</button>
                {levelId < 10 && <button className="primary-button" onClick={() => onLevel(levelId + 1)}>Open Level {levelId + 1} <ArrowRight size={16} /></button>}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ScriptLab({ onOpenLevel, onOpenPdf }: { onOpenLevel: (id: number, sectionId?: string, tab?: LevelTab) => void; onOpenPdf: (id: number) => void }) {
  const [familyIndex, setFamilyIndex] = useState(0);
  const [traceLetter, setTraceLetter] = useState(scriptFamilies[0].letters.split(" ")[0]);
  const [completedFamilies, setCompletedFamilies] = useState<number[]>(() => storage.get<number[]>("sukhan-script-families", []));
  const [revealedWords, setRevealedWords] = useState<number[]>([]);
  const [chosenReading, setChosenReading] = useState<string | null>(null);
  const [recognitionWins, setRecognitionWins] = useState<number[]>(() => storage.get<number[]>("sukhan-script-recognition", []));
  const family = scriptFamilies[familyIndex];
  const drill = scriptDrills[familyIndex];
  const familySectionId = `v3-s${4 + familyIndex * 3}`;
  const scriptPath = [
    { label: "Letter map", detail: "The complete alphabet as a visual reference", sectionId: "v3-s3" },
    { label: "Vowels", detail: "What is written and what your ear supplies", sectionId: "v3-s34" },
    { label: "Joining", detail: "Read the pen-line rather than isolated boxes", sectionId: "v3-s36" },
    { label: "Recognition", detail: "100 familiar words in ten practice sets", sectionId: "v3-s38" },
    { label: "Couplets", detail: "Move from word shapes into script-first reading", sectionId: "v3-s49" },
  ];
  const toggleFamily = () => {
    const next = completedFamilies.includes(familyIndex) ? completedFamilies.filter((item) => item !== familyIndex) : [...completedFamilies, familyIndex];
    setCompletedFamilies(next);
    storage.set("sukhan-script-families", next);
  };

  const chooseReading = (choice: string) => {
    if (chosenReading) return;
    setChosenReading(choice);
    if (choice === drill.answer && !recognitionWins.includes(familyIndex)) {
      const next = [...recognitionWins, familyIndex];
      setRecognitionWins(next);
      storage.set("sukhan-script-recognition", next);
    }
  };

  return (
    <div className="page-content">
      <PageIntro eyebrow="Level 3 · Learn the script" title="Letter-family lab" description="Work through the same ten families, joins, reading sets and couplets that shape the Level 3 curriculum." />
      <section className="tool-bridge script-bridge">
        <div><span className="overline">Level 3 progress</span><h2>{completedFamilies.length} of {scriptFamilies.length} families practised · {recognitionWins.length} readings checked</h2><p>Volume 3 works from familiar whole words: see the shape, segment dots and joins, predict the vowels, then confirm with Roman Urdu.</p></div>
        <div className="tool-bridge-actions"><button className="secondary-button" onClick={() => onOpenLevel(3, familySectionId)}><BookOpen size={17} /> Read this family</button><button className="secondary-button" onClick={() => onOpenPdf(3)}><FileText size={17} /> Open Level 3 PDF</button></div>
      </section>
      <section className="script-layout">
        <div className="family-rail" role="tablist" aria-label="Urdu letter families">
          {scriptFamilies.map((item, index) => (
            <button key={item.name} className={index === familyIndex ? "active" : ""} onClick={() => { setFamilyIndex(index); setTraceLetter(item.letters.split(" ")[0]); setRevealedWords([]); setChosenReading(null); }}>
              <span>{completedFamilies.includes(index) ? <Check size={13} /> : String(index + 1).padStart(2, "0")}</span>
              <div><strong>{item.name}</strong><span lang="ur" dir="rtl">{item.letters}</span></div>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
        <div className="script-workspace">
          <div className="script-family-heading">
            <div><span className="overline">Level 3 · Family {familyIndex + 1} of {scriptFamilies.length}</span><h2>{family.name}</h2></div>
            <span className="family-letters" lang="ur" dir="rtl">{family.letters}</span>
          </div>
          <p className="family-roman">{family.roman}</p>
          <div className="clue-box"><Sparkles size={18} /><p>{family.clue}</p></div>
          <div className="script-method" aria-label="Four-step script method">
            <span><strong>01</strong> See the shared body</span><span><strong>02</strong> Mark dots or breakers</span><span><strong>03</strong> Predict the word</span><span><strong>04</strong> Confirm last</span>
          </div>
          <div className="word-shapes">
            {family.words.map((word, index) => <button key={word} className={revealedWords.includes(index) ? "revealed" : ""} onClick={() => setRevealedWords((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])} lang="ur" dir="rtl"><span>{word}</span><small>{revealedWords.includes(index) ? scriptReadings[word] : "Tap to reveal"}</small></button>)}
          </div>
          <section className="recognition-check" aria-live="polite">
            <div className="recognition-word" lang="ur" dir="rtl">{drill.word}</div>
            <div className="recognition-copy"><span className="overline">Timed recognition</span><h3>Which familiar word is this?</h3><p>{drill.task}</p><div className="recognition-options">{drill.choices.map((choice) => <button key={choice} className={chosenReading ? (choice === drill.answer ? "correct" : choice === chosenReading ? "incorrect" : "") : ""} onClick={() => chooseReading(choice)}>{choice}</button>)}</div>{chosenReading && <div className="recognition-feedback"><CheckCircle2 size={16} /><span><strong>{chosenReading === drill.answer ? "Correct." : `It reads ${drill.answer}.`}</strong> {drill.notice}</span></div>}</div>
          </section>
          <section className="trace-letter-picker" aria-label="Choose an Urdu letter to trace">
            <div><span className="overline">Trace every letter</span><h3>Choose a letter from this family</h3></div>
            <div>{family.letters.split(" ").map((letter) => <button key={letter} className={traceLetter === letter ? "active" : ""} onClick={() => setTraceLetter(letter)} lang="ur" dir="rtl" aria-label={`Trace ${letter}`}>{letter}</button>)}</div>
          </section>
          <TracePad letter={traceLetter} />
          <div className="family-completion">
            <div><span className="overline">Family checkpoint</span><p>Complete the reading check, then trace the opening letter. Volume 3 asks you to say each word aloud twice before consulting its meaning.</p></div>
            <button className={completedFamilies.includes(familyIndex) ? "secondary-button level-complete active" : "primary-button"} onClick={toggleFamily}><CheckCircle2 size={17} /> {completedFamilies.includes(familyIndex) ? "Family practised" : "Mark family practised"}</button>
          </div>
        </div>
      </section>
      <section className="recognition-sets section-block">
        <div className="section-title-row"><div><span className="eyebrow">Volume 3 · Reading Lab</span><h2>Ten-word recognition sets</h2></div><p className="section-note">Score 2 for instant reading, 1 after segmenting, 0 if you needed the Roman bridge. Aim for 16/20.</p></div>
        <div>{Array.from({ length: 10 }, (_, index) => <button key={index} onClick={() => onOpenLevel(3, `v3-s${39 + index}`)}><span>{String(index + 1).padStart(2, "0")}</span><strong>Words {index * 10 + 1}–{index * 10 + 10}</strong><small>Circle a breaker, underline a recurring family, mark a vowel carrier.</small><ChevronRight size={17} /></button>)}</div>
      </section>
      <section className="tool-curriculum section-block">
        <div className="section-title-row"><div><span className="eyebrow">Continue inside Level 3</span><h2>From shapes to reading</h2></div></div>
        <div className="tool-curriculum-grid">
          {scriptPath.map((item, index) => <button key={item.sectionId} onClick={() => onOpenLevel(3, item.sectionId)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>{item.detail}</small></div><ChevronRight size={17} /></button>)}
        </div>
      </section>
    </div>
  );
}

function TracePad({ letter }: { letter: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => clear(), [letter]);

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    canvas.setPointerCapture(event.pointerId);
    drawing.current = true;
    const ctx = canvas.getContext("2d")!;
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(event);
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e2725";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = () => { drawing.current = false; };
  function clear() {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="trace-section">
      <div className="trace-heading"><div><span className="overline">Trace with your hand</span><h3>Follow {letter}</h3></div><button className="icon-button bordered" onClick={clear} aria-label="Clear tracing pad" title="Clear"><RotateCcw size={17} /></button></div>
      <div className="trace-pad">
        <span lang="ur" dir="rtl">{letter}</span>
        <canvas ref={canvasRef} width={700} height={260} onPointerDown={start} onPointerMove={draw} onPointerUp={end} onPointerCancel={end} onPointerLeave={end} aria-label={`Trace the Urdu letter ${letter}`} />
      </div>
    </div>
  );
}

function ListeningRoom({ onOpenLevel, onOpenPdf }: { onOpenLevel: (id: number, sectionId?: string, tab?: LevelTab) => void; onOpenPdf: (id: number) => void }) {
  const [activeTrack, setActiveTrack] = useState(0);
  const [activeLibraryIndex, setActiveLibraryIndex] = useState<number | null>(null);
  const [linkFilter, setLinkFilter] = useState<"All" | (typeof listeningLinks)[number]["category"]>("All");
  const pathways = [
    { level: 8, sectionId: "v8-s30", label: "Qawwali in motion", description: "Follow how voice, response and return turn a text into collective attention.", stages: ["Establish the tonal ground", "Invoke the opening praise", "State the line clearly", "Hear the party answer", "Track the phrase expanding", "Notice intensification", "Dwell inside one word", "Listen for the resolution"], passes: [{ label: "Receive", detail: "No transcript: notice bodily rhythm, return, contrast and emotional trajectory." }, { label: "Follow", detail: "Use the text and mark where the performed order differs from the written order." }, { label: "Interpret", detail: "Ask how repetition, inserted verse and audience response shift the semantic centre." }], sourceIds: ["v8-s31", "v8-s35", "v8-s61", "v8-s63"] },
    { level: 9, sectionId: "v9-s2", label: "Seven-ear listening", description: "Train attention to word, sentence, voice, time, music, gathering and afterlife.", stages: ["Word: establish the text", "Sentence: find the hinge", "Voice: hear diction and breath", "Time: notice pause and delay", "Music: track melody and refrain", "Gathering: hear response and daad", "Afterlife: name what remains"], passes: [{ label: "First hearing", detail: "Register movement, return and pressure before translating." }, { label: "Second hearing", detail: "Check the word and grammatical turn with the text in front of you." }, { label: "Third hearing", detail: "Return to audible evidence and name what changed in your understanding." }], sourceIds: ["v9-s2", "v9-s3", "v9-s11", "v9-s15", "v9-s53", "v9-s56"] },
    { level: 10, sectionId: "v10-s31", label: "Comparative anthology", description: "Move deliberately from page to voice to a second interpretation.", stages: ["Hear once without pausing", "Read from Urdu first", "Parse the grammatical hinge", "Layer scene, feeling and claim", "Compare choices, not celebrity", "Recite with restraint", "Keep one line for your anthology"], passes: [{ label: "Page", detail: "Record the room, beloved, season or speaker that the line first suggested." }, { label: "Voice", detail: "Notice how melody changes time, intimacy and certainty." }, { label: "Screen or second voice", detail: "Identify what a new interpretation makes concrete or leaves open." }], sourceIds: ["v10-s1", "v10-s2", "v10-s31", "v10-s32", "v10-s33", "v10-s34"] },
  ];
  const [pathwayIndex, setPathwayIndex] = useState(1);
  const [marks, setMarks] = useState<boolean[]>(() => storage.get<boolean[]>("sukhan-listening-9", pathways[1].stages.map(() => false)));
  const [notes, setNotes] = useState(() => storage.get<Record<string, string>>("sukhan-listening-notes-9", { first: "", text: "", return: "", evidence: "" }));
  const selectedLibraryLink = activeLibraryIndex === null ? null : listeningLinks[activeLibraryIndex];
  const track = selectedLibraryLink ?? listeningTracks[activeTrack];
  const pathway = pathways[pathwayIndex];
  const sourceSections = pathway.sourceIds.map((id) => guideContent[pathway.level - 1].sections.find((section) => section.id === id)).filter((section): section is GuideSection => Boolean(section));
  const visibleListeningLinks = listeningLinks
    .map((link, index) => ({ link, index }))
    .filter(({ link }) => linkFilter === "All" || link.category === linkFilter);

  const choosePathway = (index: number) => {
    const next = pathways[index];
    setPathwayIndex(index);
    setMarks(storage.get<boolean[]>(`sukhan-listening-${next.level}`, next.stages.map(() => false)));
    setNotes(storage.get<Record<string, string>>(`sukhan-listening-notes-${next.level}`, { first: "", text: "", return: "", evidence: "" }));
  };

  const toggleMark = (index: number) => {
    const next = marks.map((mark, markIndex) => markIndex === index ? !mark : mark);
    setMarks(next);
    storage.set(`sukhan-listening-${pathway.level}`, next);
  };

  const updateNote = (field: string, value: string) => {
    const next = { ...notes, [field]: value };
    setNotes(next);
    storage.set(`sukhan-listening-notes-${pathway.level}`, next);
  };

  return (
    <div className="page-content">
      <PageIntro eyebrow="Levels 8–10 · The poem leaves the page" title="Listening room" description="Choose a listening pathway, make a record, then return to the exact source lesson that deepens the hearing." />
      <section className="listening-pathways" aria-label="Listening pathways">
        {pathways.map((item, index) => <button key={item.level} className={index === pathwayIndex ? "active" : ""} onClick={() => choosePathway(index)}><span>Level {item.level}</span><strong>{item.label}</strong><small>{item.description}</small></button>)}
      </section>
      <section className="tool-bridge listening-bridge">
        <div><span className="overline">Current pathway · Level {pathway.level}</span><h2>{pathway.label}</h2><p>{pathway.description} Mark each act as you can point to audible evidence rather than simply recognising its label.</p></div>
        <div className="tool-bridge-actions"><button className="secondary-button" onClick={() => onOpenLevel(pathway.level, pathway.sectionId)}><BookOpen size={17} /> Open pathway lesson</button><button className="secondary-button" onClick={() => onOpenPdf(pathway.level)}><FileText size={17} /> Open source PDF</button></div>
      </section>
      <section className="recording-shelf section-block">
        <div className="section-title-row"><div><span className="eyebrow">1. Choose a recording</span><h2>Start guided, then explore</h2></div><p className="section-note">The two starting recordings are a gentle way into the room. The full shelf is grouped by tradition and always opens the selected player directly below.</p></div>
        <div className="featured-recordings">
          {listeningTracks.map((item, index) => (
            <button key={item.videoId} className={activeLibraryIndex === null && index === activeTrack ? "active" : ""} onClick={() => { setActiveTrack(index); setActiveLibraryIndex(null); document.getElementById("listening-player")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
              <img src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" />
              <span className="track-play"><Play size={16} fill="currentColor" /></span>
              <div><strong>{item.title}</strong><small>{item.artist}</small><p>{item.focus}</p></div>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
        <div className="catalogue-heading"><span className="overline">All levels · Curated recordings</span><p>Browse {listeningLinks.length} direct-play videos: study labs for Levels 1–7, then classical, modern, Sufi and comparison recordings for the advanced volumes.</p></div>
        <div className="listening-link-filters" role="tablist" aria-label="Filter listening links">{(["All", "Study labs", "Classical", "Modern & cinema", "Qawwali & Sufi", "Compare"] as const).map((category) => <button key={category} className={linkFilter === category ? "active" : ""} onClick={() => setLinkFilter(category)}>{category === "All" ? `All ${listeningLinks.length}` : category}</button>)}</div>
        <div className="listening-link-grid">{visibleListeningLinks.map(({ link, index }) => <button key={`${link.videoId}-${index}`} className={index === activeLibraryIndex ? "active" : ""} onClick={() => { setActiveLibraryIndex(index); document.getElementById("listening-player")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{link.title}</strong><small>{link.level ? `Level ${link.level} · ${link.artist}` : link.artist}</small></div><Play size={16} fill="currentColor" /></button>)}</div>
      </section>
      <section className="listening-layout section-block" id="listening-player">
        <div className="video-stage">
          <div className="video-frame">
            <iframe
              key={`${track.videoId}-${track.startSeconds ?? 0}`}
              src={`https://www.youtube-nocookie.com/embed/${track.videoId}?rel=0${track.startSeconds ? `&start=${track.startSeconds}` : ""}`}
              title={`${track.title} by ${track.artist}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="track-caption">
            <div><span className="overline">Now listening</span><h2>{track.title}</h2><p>{track.artist}</p></div>
            <a className="icon-button bordered" href={`https://www.youtube.com/watch?v=${track.videoId}`} target="_blank" rel="noreferrer" aria-label="Open on YouTube" title="Open on YouTube"><ExternalLink size={18} /></a>
          </div>
          <p className="focus-note"><Headphones size={18} />{track.focus}</p>
          <div className="listening-passes"><span className="overline">Make three passes</span>{pathway.passes.map((pass, index) => <div key={pass.label}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{pass.label}</strong>{pass.detail}</p></div>)}</div>
        </div>
        <aside className="listening-notebook">
          <span className="overline">Level {pathway.level} · listening record</span>
          <h2>Evidence, not impressions alone</h2>
          <div className="listening-checks">
            {pathway.stages.map((stage, index) => (
              <button key={stage} className={marks[index] ? "done" : ""} onClick={() => toggleMark(index)}>
                <span>{marks[index] ? <Check size={16} /> : String(index + 1).padStart(2, "0")}</span>{stage}
              </button>
            ))}
          </div>
          <div className="listening-note-grid">
            <label className="notebook-field">First pass<textarea value={notes.first ?? ""} onChange={(event) => updateNote("first", event.target.value)} placeholder="Mood, image, pulse, recurring sound..." /></label>
            <label className="notebook-field">With the text<textarea value={notes.text ?? ""} onChange={(event) => updateNote("text", event.target.value)} placeholder="A word, sentence hinge, refrain or inserted verse..." /></label>
            <label className="notebook-field">On return<textarea value={notes.return ?? ""} onChange={(event) => updateNote("return", event.target.value)} placeholder="What changed between first and third hearing?" /></label>
          </div>
          <label className="notebook-field evidence-field">Audible evidence<input value={notes.evidence ?? ""} onChange={(event) => updateNote("evidence", event.target.value)} placeholder="e.g. 01:42 - the held vowel changes the refrain" /></label>
        </aside>
      </section>

      <section className="source-lane section-block">
        <div className="section-title-row"><div><span className="eyebrow">Inside this pathway</span><h2>Continue with the source practice</h2></div></div>
        <div className="source-lane-grid">
          {sourceSections.map((section, index) => <button key={section.id} onClick={() => onOpenLevel(pathway.level, section.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{section.title}</strong><small>{section.kind}</small></div><ChevronRight size={17} /></button>)}
        </div>
      </section>
    </div>
  );
}

function QuizRoom({ onOpenLevel }: { onOpenLevel: (id: number, sectionId?: string, tab?: LevelTab) => void }) {
  const [scope, setScope] = useState<"mixed" | number>("mixed");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const levelQuiz = typeof scope === "number" ? getLevelContent(scope) : null;
  const questions = levelQuiz?.quiz ?? quizQuestions;
  const question = questions[index];
  const scopeLabel = levelQuiz ? `Level ${scope} · ${levelQuiz.theme}` : "Mixed studio review";

  const chooseScope = (nextScope: "mixed" | number) => {
    setScope(nextScope);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const select = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.answer) setScore(score + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
  };

  const restart = () => { setIndex(0); setSelected(null); setScore(0); setFinished(false); };

  return (
    <div className="page-content quiz-page">
      <PageIntro eyebrow="Assessment hub · Levels 1–10" title="Recognition quizzes" description="Choose a level checkpoint or take the mixed studio review. Each result leads back into the exact curriculum it tests." />
      <section className="quiz-selector" aria-label="Choose a quiz">
        <button className={scope === "mixed" ? "active" : ""} onClick={() => chooseScope("mixed")}><span>Studio</span><strong>Mixed review</strong><small>{quizQuestions.length} questions across the course</small></button>
        {levelContent.map((level) => <button key={level.id} className={scope === level.id ? "active" : ""} onClick={() => chooseScope(level.id)}><span>Level {level.id}</span><strong>{volumes[level.id - 1].title}</strong><small>{level.quiz.length} source-based questions</small></button>)}
      </section>
      {finished ? (
        <section className="quiz-result">
          <div className="result-medallion"><Trophy size={35} /><strong>{score}/{questions.length}</strong></div>
          <span className="overline">Session complete</span>
          <h2>{score >= Math.ceil(questions.length * 0.7) ? "The material is beginning to stay." : "Return, recognise, repeat."}</h2>
          <p>{levelQuiz ? `Review the Level ${scope} lesson reader or continue with its next activity.` : "Use the result to choose the level that needs another pass."}</p>
          <div className="button-row quiz-result-actions"><button className="secondary-button" onClick={restart}><RotateCcw size={17} /> Try again</button>{typeof scope === "number" && <button className="primary-button" onClick={() => onOpenLevel(scope, undefined, "quiz")}>Open Level {scope} quiz <ArrowRight size={17} /></button>}</div>
        </section>
      ) : (
        <section className="quiz-card">
          <div className="quiz-topline"><span>{scopeLabel} · Question {index + 1} of {questions.length}</span><span>{score} correct</span></div>
          <div className="quiz-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          <h2>{question.question}</h2>
          <div className="answer-grid">
            {question.options.map((option, optionIndex) => {
              const isCorrect = selected !== null && optionIndex === question.answer;
              const isWrong = selected === optionIndex && optionIndex !== question.answer;
              return (
                <button key={option} className={isCorrect ? "correct" : isWrong ? "wrong" : ""} onClick={() => select(optionIndex)}>
                  <span>{String.fromCharCode(65 + optionIndex)}</span>{option}{isCorrect && <Check size={18} />}{isWrong && <X size={18} />}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="answer-note"><strong>{selected === question.answer ? "Exactly." : "Not quite."}</strong><span>{question.note}</span></div>
          )}
          <button className="primary-button next-question" disabled={selected === null} onClick={next}>
            {index === questions.length - 1 ? "See result" : "Next question"} <ArrowRight size={17} />
          </button>
        </section>
      )}
    </div>
  );
}

function LibraryRoom({
  completed,
  onToggleCompleted,
  onOpenPdf,
  onOpenLevel,
}: {
  completed: number[];
  onToggleCompleted: (id: number) => void;
  onOpenPdf: (id: number) => void;
  onOpenLevel: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const filtered = useMemo(() => volumes.filter((volume) => {
    const matchesQuery = `${volume.title} ${volume.strapline} ${volume.topics.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (level === "All" || volume.level === level);
  }), [query, level]);

  return (
    <div className="page-content">
      <PageIntro eyebrow="Your complete shelf" title="The ten-level library" description="Search every original guide, open it without leaving Sukhan, or enter its interactive level." />
      <section className="library-tools">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search volumes and topics" /></label>
        <div className="segmented-control library-filter" role="tablist" aria-label="Filter by level">
          {["All", "Beginner", "Intermediate", "Advanced"].map((item) => <button key={item} className={level === item ? "active" : ""} onClick={() => setLevel(item)}>{item}</button>)}
        </div>
      </section>

      <section className="library-grid">
        {filtered.map((volume) => (
          <article className="volume-card" key={volume.id}>
            <div className="volume-cover-wrap"><img src={volume.cover} alt={`Cover of Volume ${volume.id}: ${volume.title}`} /><span style={{ background: volume.color }}>{String(volume.id).padStart(2, "0")}</span></div>
            <div className="volume-card-copy">
              <div className="volume-card-meta"><span>{volume.level}</span><span>{volume.pages} pages</span></div>
              <h2>{volume.title}</h2>
              <p>{volume.strapline}</p>
              <div className="topic-row">{volume.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
              <div className="volume-actions">
                <button className="primary-button" onClick={() => onOpenPdf(volume.id)}><BookOpen size={17} /> Read here</button>
                <button className="secondary-button" onClick={() => onOpenLevel(volume.id)}><Layers3 size={17} /> Study</button>
                <button className={completed.includes(volume.id) ? "icon-button bordered completed" : "icon-button bordered"} onClick={() => onToggleCompleted(volume.id)} aria-label="Toggle completion" title="Toggle completion"><CheckCircle2 size={18} /></button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="resource-band section-block">
        <div><span className="eyebrow">Beyond the shelf</span><h2>Reference and listening links</h2></div>
        <div className="resource-links">
          {externalLinks.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer"><div><strong>{link.label}</strong><span>{link.description}</span></div><ExternalLink size={18} /></a>
          ))}
        </div>
      </section>
    </div>
  );
}

function PdfReader({ volume, onClose, onChange }: { volume: Volume; onClose: () => void; onChange: (id: number) => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && volume.id > 1) onChange(volume.id - 1);
      if (event.key === "ArrowRight" && volume.id < volumes.length) onChange(volume.id + 1);
    };
    document.body.classList.add("reader-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("reader-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onChange, volume.id]);

  return (
    <div className="pdf-reader" role="dialog" aria-modal="true" aria-label={`Reading Level ${volume.id}: ${volume.title}`}>
      <header className="pdf-reader-header">
        <div className="pdf-reader-title">
          <span style={{ background: volume.color }}>{String(volume.id).padStart(2, "0")}</span>
          <div><small>Level {volume.id} · Source guide</small><strong>{volume.title}</strong></div>
        </div>
        <div className="pdf-reader-controls">
          <button className="icon-button" disabled={volume.id === 1} onClick={() => onChange(volume.id - 1)} aria-label="Previous volume" title="Previous volume"><ChevronLeft size={20} /></button>
          <span>{volume.id} / {volumes.length}</span>
          <button className="icon-button" disabled={volume.id === volumes.length} onClick={() => onChange(volume.id + 1)} aria-label="Next volume" title="Next volume"><ChevronRight size={20} /></button>
          <button className="icon-button pdf-close" onClick={onClose} aria-label="Close PDF reader" title="Close reader"><X size={21} /></button>
        </div>
      </header>
      <div className="pdf-reader-stage">
        <iframe key={volume.pdf} src={`${volume.pdf}#view=FitH&navpanes=0`} title={`Level ${volume.id}: ${volume.title} PDF`} />
      </div>
    </div>
  );
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>;
}
