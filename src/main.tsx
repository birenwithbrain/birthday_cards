// import React, { useEffect, useMemo, useState } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Cake,
  Camera,
  Check,
  ChevronUp,
  Gift,
  Heart,
  Lock,
  Menu,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { birthday } from "./birthday";
import { siteSettings } from "./siteSettings";
import "./styles.css";

const SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyJiYpYao4lWyihb_isHuAZw0k0ZomBQkn2SdUL22fALUSi5NQkp1zWfN2bXiXjR6nANw/exec";

function sendToSheet(data: {
  type: string;
  question?: string;
  answer?: string;
  wish?: string;
}) {
  // Submit as a normal HTML form to avoid fetch/CORS blocking Apps Script.
  const frameName = "birthday-sheet-submit-frame";
  let frame = document.querySelector<HTMLIFrameElement>(`iframe[name="${frameName}"]`);
  if (!frame) {
    frame = document.createElement("iframe");
    frame.name = frameName;
    frame.style.display = "none";
    document.body.appendChild(frame);
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = SHEET_WEB_APP_URL;
  form.target = frameName;
  form.style.display = "none";

  Object.entries({
    type: data.type,
    question: data.question || "",
    answer: data.answer || "",
    wish: data.wish || "",
  }).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

function App() {
  const [section, setSection] = useState("home");
  const [intro, setIntro] = useState(true);
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quiz, setQuiz] = useState<number | null>(null);
  const [stars, setStars] = useState<number[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [wishText, setWishText] = useState("");
  const [wishStatus, setWishStatus] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startExperience = () => {
    setIntro(false);

    if (!audioRef.current) {
      audioRef.current = new Audio("/music/birthday-song.mpeg");
      audioRef.current.loop = true;
      audioRef.current.volume = 1;
    }

    audioRef.current.play().catch((error) => {
      console.error("Music playback could not start:", error);
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--bg",
      birthday.theme.background,
    );
    document.documentElement.style.setProperty(
      "--ink",
      birthday.theme.foreground,
    );
    document.documentElement.style.setProperty(
      "--primary",
      birthday.theme.primary,
    );
    document.documentElement.style.setProperty(
      "--secondary",
      birthday.theme.secondary,
    );
    document.documentElement.style.setProperty(
      "--accent",
      birthday.theme.accent,
    );
  }, []);

  const progress = useMemo(() => {
    const visibleRoutes = [
      "home",
      ...(siteSettings.sections.memories ? ["evidence"] : []),
      ...(siteSettings.sections.vogue ? ["vogue"] : []),
      ...(siteSettings.sections.flashcards ? ["cards"] : []),
      ...(siteSettings.sections.quiz ? ["quiz"] : []),
      ...(siteSettings.sections.finalWish ? ["wish"] : []),
    ];
    const i = visibleRoutes.indexOf(section);
    return clamp((i / Math.max(visibleRoutes.length - 1, 1)) * 100, 0, 100);
  }, [section]);

  const go = (id: string) => {
    const enabled: Record<string, boolean> = {
      evidence: siteSettings.sections.memories,
      vogue: siteSettings.sections.vogue,
      cards: siteSettings.sections.flashcards,
      quiz: siteSettings.sections.quiz,
      wish: siteSettings.sections.finalWish,
    };
    if (id !== "home" && !enabled[id]) id = "home";
    setSection(id);
    setShowMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const addStar = (n: number) =>
    setStars((s) => (s.includes(n) ? s : [...s, n]));

  // if (intro) return <Intro onStart={() => setIntro(false)} />;
  if (intro) return <Intro onStart={startExperience} />;

  return (
    <div className="app">
      <div className="top-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <header className="topbar">
        <button className="brand" onClick={() => go("home")} aria-label="Home">
          <span>BD</span>
          <b>{birthday.name}</b>
        </button>
        <button
          className="menu-btn"
          onClick={() => setShowMenu(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {section === "home" && (
            <Home key="home" go={go} addStar={addStar} stars={stars} />
          )}
          {section === "evidence" && siteSettings.sections.memories && (
            <Evidence key="evidence" card={card} setCard={setCard} />
          )}
          {section === "vogue" && siteSettings.sections.vogue && (
            <Vogue key="vogue" />
          )}
          {section === "cards" && siteSettings.sections.flashcards && (
            <Cards
              key="cards"
              flipped={flipped}
              setFlipped={setFlipped}
              card={card}
              setCard={setCard}
            />
          )}
          {section === "quiz" && siteSettings.sections.quiz && (
            <Quiz
              key="quiz"
              quiz={quiz}
              setQuiz={setQuiz}
              addStar={addStar}
              stars={stars}
              onAnswer={(question, answer) => {
                void sendToSheet({ type: "Quiz answer", question, answer });
              }}
            />
          )}
          {section === "wish" && siteSettings.sections.finalWish && (
            <Wish
              key="wish"
              stars={stars}
              celebrate={celebrate}
              setCelebrate={setCelebrate}
              wishText={wishText}
              setWishText={setWishText}
              wishStatus={wishStatus}
              setWishStatus={setWishStatus}
            />
          )}
        </AnimatePresence>
      </main>

      <nav className="bottom-nav" aria-label="Birthday navigation">
        {[
          ["home", "Home", Heart, true],
          ["evidence", "Memories", Camera, siteSettings.sections.memories],
          ["vogue", "Vogue", Sparkles, siteSettings.sections.vogue],
          ["cards", "Cards", Sparkles, siteSettings.sections.flashcards],
          ["quiz", "Game", Cake, siteSettings.sections.quiz],
          ["wish", "Wish", Gift, siteSettings.sections.finalWish],
        ]
          .filter(([, , , enabled]: any) => enabled)
          .map(([id, label, Icon]: any) => (
            <button
              key={id}
              className={section === id ? "active" : ""}
              onClick={() => go(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
      </nav>

      <AnimatePresence>
        {showMenu && <MenuSheet close={() => setShowMenu(false)} go={go} />}
      </AnimatePresence>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      className="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="intro-orbit orbit-a" />
      <div className="intro-orbit orbit-b" />
      <motion.div
        className="intro-sticker"
        initial={{ scale: 0, rotate: -18 }}
        animate={{ scale: 1, rotate: 8 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        for you ✦
      </motion.div>
      <div className="intro-copy">
        <span className="eyebrow">a tiny birthday internet corner</span>
        <h1>
          Someone
          <br />
          <em>special</em>
          <br />
          turned {birthday.age}.
        </h1>
        <p>So naturally, we made a whole little website about it.</p>
        <motion.button
          className="big-cta"
          onClick={onStart}
          whileTap={{ scale: 0.96 }}
        >
          <span>Open the surprise</span>
          <ArrowRight size={20} />
        </motion.button>
        <p>Best experienced with sound on. 🔊</p>
      </div>
      <div className="floating-doodle">♡</div>
    </motion.section>
  );
}

function Home({
  go,
  addStar,
  stars,
}: {
  go: (x: string) => void;
  addStar: (n: number) => void;
  stars: number[];
}) {
  return (
    <motion.section
      className="page home-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <div className="home-hero">
        <span className="pill">
          <Sparkles size={13} /> birthday edition
        </span>
        <h2>
          Happy birthday,
          <br />
          <span>{birthday.name}!</span>
        </h2>
        <p>{birthday.intro.subtitle}</p>
        <div className="hero-card">
          <div
            className="hero-photo"
            style={{ backgroundImage: `url(${birthday.profilePhoto})` }}
          >
            <span className="photo-label">SUBJECT / {birthday.age}</span>
          </div>
          <div className="hero-note">
            <span>today's forecast</span>
            <strong>100% chance of cake murderer</strong>
            <small>with a high probability of questionable decisions.</small>
          </div>
        </div>
      </div>

      <div className="quick-grid">
        {siteSettings.sections.memories && (
          <button onClick={() => go("evidence")}>
            <Camera />
            <b>Open memories</b>
            <span>tiny evidence archive</span>
          </button>
        )}
        {siteSettings.sections.vogue && (
          <button onClick={() => go("vogue")}>
            <Sparkles />
            <b>Enter the Vogue edit</b>
            <span>the birthday fashion issue</span>
          </button>
        )}
        {siteSettings.sections.flashcards && (
          <button onClick={() => go("cards")}>
            <Sparkles />
            <b>Flip the cards</b>
            <span>answers may be rude</span>
          </button>
        )}
        {siteSettings.sections.quiz && (
          <button onClick={() => go("quiz")}>
            <Cake />
            <b>Take the test</b>
            <span>scientifically dubious</span>
          </button>
        )}
        {siteSettings.sections.finalWish && (
          <button onClick={() => go("wish")}>
            <Gift />
            <b>Find the wish</b>
            <span>{stars.length}/3 stars found</span>
          </button>
        )}
      </div>

      <button
        className="secret-star star-one"
        onClick={() => addStar(1)}
        aria-label="Hidden star"
      >
        <Star fill={stars.includes(1) ? "currentColor" : "none"} />
      </button>
      <button
        className="secret-star star-two"
        onClick={() => addStar(2)}
        aria-label="Hidden star"
      >
        <Star fill={stars.includes(2) ? "currentColor" : "none"} />
      </button>
      <div className="scroll-hint">
        <ArrowDown size={15} /> tap around. there are secrets.
      </div>
    </motion.section>
  );
}

function Evidence({
  card,
  setCard,
}: {
  card: number;
  setCard: (n: number) => void;
}) {
  const item = birthday.evidence[card];
  return (
    <motion.section
      className="page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <SectionHead
        kicker="evidence archive"
        title="Things we are legally calling memories."
      />
      <div className="evidence-wrap">
        <motion.div
          className="evidence-photo"
          key={card}
          initial={{ scale: 0.94, rotate: -2, opacity: 0 }}
          animate={{ scale: 1, rotate: item.rotate, opacity: 1 }}
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <span className="tape" />
          <span className="exhibit">
            EXHIBIT {String(card + 1).padStart(2, "0")}
          </span>
        </motion.div>
        <div className="evidence-copy">
          <span>{item.label}</span>
          <h3>{item.title}</h3>
          <p>{item.caption}</p>
        </div>
        <div className="pager">
          <button disabled={card === 0} onClick={() => setCard(card - 1)}>
            <ArrowLeft />
          </button>
          <span>
            {card + 1} / {birthday.evidence.length}
          </span>
          <button
            disabled={card === birthday.evidence.length - 1}
            onClick={() => setCard(card + 1)}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <p className="swipe-tip">Use the arrows →</p>
    </motion.section>
  );
}

function Vogue() {
  const photos = birthday.voguePhotos;
  return (
    <motion.section
      className="page vogue-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
    >
      <div className="vogue-masthead">
        <span className="vogue-overline">
          THE BIRTHDAY ISSUE · SPECIAL EDITION
        </span>
        <div className="vogue-wordmark">VOGUE</div>
        <div className="vogue-issue-line">
          <span>ISSUE NO. 01</span>
          <span>THE ICON ISSUE</span>
          <span>EXCLUSIVE</span>
        </div>
      </div>
      <div className="vogue-cover">
        <div className="vogue-cover-photo cover-main">
          <img src={photos[0].image} alt={photos[0].alt} />
          <span className="cover-tag">THE COVER STORY</span>
        </div>
        <div className="vogue-cover-photo cover-small cover-small-one">
          <img src={photos[1].image} alt={photos[1].alt} />
        </div>
        <div className="vogue-cover-photo cover-small cover-small-two">
          <img src={photos[2].image} alt={photos[2].alt} />
        </div>
        <div className="vogue-cover-copy">
          <span>THE BIRTHDAY STAR</span>
          <h2>
            THE ART OF
            <br />
            <em>BEING ICONIC.</em>
          </h2>
          <p>
            A little elegance. A lot of personality. An unforgettable presence.
          </p>
        </div>
      </div>
      <div className="vogue-intro-line">
        <span>STYLE · PRESENCE · PERSONALITY</span>
        <span>AN ORIGINAL PORTRAIT SERIES</span>
      </div>
      <section className="vogue-editorial">
        <div className="vogue-section-title">
          <span>01 / THE ARCHIVE</span>
          <h2>The Style Diaries</h2>
          <p>A collection of looks, moods and moments worth a second look.</p>
        </div>
        <div className="vogue-scrapbook">
          {photos.map((photo, i) => (
            <article
              className={`vogue-polaroid vogue-polaroid-${i + 1}`}
              key={i}
            >
              <div className="vogue-photo-frame">
                <img src={photo.image} alt={photo.alt} />
              </div>
              <div className="vogue-photo-meta">
                <span>
                  {String(i + 1).padStart(2, "0")} / {photo.label}
                </span>
                <p>{photo.caption}</p>
              </div>
              {i === 1 && (
                <span className="vogue-handnote">a moment, framed.</span>
              )}
              {i === 4 && (
                <span className="vogue-stamp">
                  ICON
                  <br />
                  STATUS
                </span>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="vogue-verdict">
        <span className="vogue-overline">02 / THE FASHION VERDICT</span>
        <div className="vogue-rating">
          10<span>/10</span>
        </div>
        <h2>
          Elegance is personal.
          <br />
          <em>And this is unmistakably hers.</em>
        </h2>
        <div className="vogue-rating-details">
          <span>
            <b>STYLE</b> Timeless
          </span>
          <span>
            <b>PRESENCE</b> Unforgettable
          </span>
          <span>
            <b>EFFORT</b> Effortless
          </span>
        </div>
      </section>
      <section className="vogue-editor-note">
        <span>03 / A NOTE FROM THE EDITOR</span>
        <blockquote>
          “Some people wear beautiful outfits. Others make every outfit
          memorable.”
        </blockquote>
        <p>
          This little edition is a reminder that your style is more than what
          you wear. It is the confidence, warmth and personality you bring into
          every frame.
        </p>
      </section>
      <div className="vogue-footer">
        <span>THE BIRTHDAY ISSUE</span>
        <b>VOGUE</b>
        <span>END OF EDITION</span>
      </div>
    </motion.section>
  );
}

function Cards({
  flipped,
  setFlipped,
  card,
  setCard,
}: {
  flipped: boolean;
  setFlipped: (b: boolean) => void;
  card: number;
  setCard: (n: number) => void;
}) {
  const item = birthday.flashcards[card % birthday.flashcards.length];
  return (
    <motion.section
      className="page cards-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <SectionHead
        kicker="little flashcards"
        title="How well do you actually know them?"
      />
      <div className="flip-zone" onClick={() => setFlipped(!flipped)}>
        <motion.div
          className="flip-card"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, type: "spring", bounce: 0.18 }}
        >
          <div className="face front">
            <span className="card-number">0{card + 1}</span>
            <Sparkles />
            <small>tap to flip</small>
            <h3>{item.question}</h3>
            <div className="tap-circle">↻</div>
          </div>
          <div className="face back">
            <span className="card-number">ANSWER</span>
            <Heart fill="currentColor" />
            <small>obviously</small>
            <h3>{item.answer}</h3>
            <div className="tap-circle">↻</div>
          </div>
        </motion.div>
      </div>
      <div className="card-controls">
        <button
          onClick={() => {
            setFlipped(false);
            setCard(
              (card - 1 + birthday.flashcards.length) %
                birthday.flashcards.length,
            );
          }}
        >
          <ArrowLeft />
        </button>
        <span>
          {card + 1} / {birthday.flashcards.length}
        </span>
        <button
          onClick={() => {
            setFlipped(false);
            setCard((card + 1) % birthday.flashcards.length);
          }}
        >
          <ArrowRight />
        </button>
      </div>
      <div className="swipe-pills">
        {birthday.flashcards.map((_, i) => (
          <span key={i} className={i === card ? "on" : ""} />
        ))}
      </div>
    </motion.section>
  );
}

function Quiz({
  quiz,
  setQuiz,
  addStar,
  stars,
  onAnswer,
}: {
  quiz: number | null;
  setQuiz: (n: number | null) => void;
  addStar: (n: number) => void;
  stars: number[];
  onAnswer: (question: string, answer: string) => void;
}) {
  const q = birthday.quiz[quiz ?? 0];
  if (quiz === null)
    return (
      <motion.section
        className="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SectionHead
          kicker="highly scientific test"
          title="What kind of birthday human are you?"
        />
        <div className="quiz-start">
          <div className="quiz-icon">🧪</div>
          <h3>Few questions.</h3>
          <p>Zero peer review. Potentially devastating conclusions.</p>
          <button className="big-cta" onClick={() => setQuiz(0)}>
            Begin the nonsense <ArrowRight />
          </button>
          <button
            className="quiz-star-hunt"
            onClick={() => addStar(3)}
            aria-label="Collect the third hidden star"
          >
            <Star
              size={18}
              fill={stars.includes(3) ? "currentColor" : "none"}
            />
            <span>
              {stars.includes(3)
                ? "Star collected!"
                : "Psst... a tiny star was left here"}
            </span>
          </button>
        </div>
      </motion.section>
    );
  if (quiz >= birthday.quiz.length)
    return (
      <motion.section
        className="page"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="result-card">
          <span>OFFICIAL RESULT</span>
          <div className="result-emoji">✦</div>
          <h2>{birthday.quizResult.title}</h2>
          <p>{birthday.quizResult.text}</p>
          <button className="outline-btn" onClick={() => setQuiz(null)}>
            retake test
          </button>
          <button
            className="quiz-star-hunt"
            onClick={() => addStar(3)}
            aria-label="Collect the third hidden star"
          >
            <Star
              size={18}
              fill={stars.includes(3) ? "currentColor" : "none"}
            />
            <span>
              {stars.includes(3) ? "Star collected!" : "Collect the tiny star"}
            </span>
          </button>
        </div>
      </motion.section>
    );
  return (
    <motion.section
      className="page"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
    >
      <div className="quiz-progress">
        <span
          style={{ width: `${((quiz + 1) / birthday.quiz.length) * 100}%` }}
        />
      </div>
      <span className="eyebrow">
        question {quiz + 1} / {birthday.quiz.length}
      </span>
      <h2 className="quiz-question">{q.question}</h2>
      <div className="answers">
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => {
              onAnswer(q.question, o);
              setQuiz(quiz + 1);
            }}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {o}
          </button>
        ))}
      </div>
      <button
        className="quiz-star-hunt quiz-star-question"
        onClick={() => addStar(3)}
        aria-label="Collect the third hidden star"
      >
        <Star size={18} fill={stars.includes(3) ? "currentColor" : "none"} />
        <span>
          {stars.includes(3) ? "Star collected!" : "A tiny star is hiding here"}
        </span>
      </button>
    </motion.section>
  );
}

function Wish({
  stars,
  celebrate,
  setCelebrate,
  wishText,
  setWishText,
  wishStatus,
  setWishStatus,
}: {
  stars: number[];
  celebrate: boolean;
  setCelebrate: (b: boolean) => void;
  wishText: string;
  setWishText: (value: string) => void;
  wishStatus: string;
  setWishStatus: (value: string) => void;
}) {
  const unlocked = stars.length >= 3;
  return (
    <motion.section
      className="page wish-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="wish-top">
        <span className="pill">
          <Gift size={13} /> final chapter
        </span>
        <div className="star-count">
          {stars.length}/3 <Star size={14} fill="currentColor" />
        </div>
      </div>
      <div className="wish-lock">
        <div className={unlocked ? "lock unlocked" : "lock"}>
          {unlocked ? <Heart fill="currentColor" /> : <Lock />}
        </div>
        <span>{unlocked ? "unlocked" : "three tiny stars unlock this"}</span>
      </div>
      
      {unlocked ? (
        <>
        <div className="final-wish-hero">
          <img
            className="final-wish-photo"
            src={birthday.finalWishPhoto}
            alt={`${birthday.name} birthday portrait`}
          />

          <div className="final-wish-gradient" />

          <div className="final-letter">
            <span className="eyebrow">a little wish, just for you</span>

            <p className="wish-pretitle">Here's to</p>
            <h2>The Loveliest Year</h2>

            {/* <div className="wish-divider">♡</div> */}

            <h3>Happy Birthday, {birthday.name}</h3>

            <p>
              May this new year of your life be softer, happier and so much more you.
              May it bring you the peace you deserve, the success you're working so
              hard for, and a lot of unexpected, beautiful surprises along the way.
            </p>

            <p className="wish-signoff">
              Have the loveliest year, always. ♡
            </p>


          </div>
        </div>
        <div className="wish-submission-card">
          <label htmlFor="birthday-wish">Write a little wish for yourself ♡</label>
          <textarea
            id="birthday-wish"
            value={wishText}
            onChange={(event) => setWishText(event.target.value)}
            placeholder="If you could wish for anything this year..."
            rows={4}
            maxLength={1000}
          />
          <button
            className="big-cta"
            disabled={!wishText.trim()}
            onClick={() => {
              sendToSheet({ type: "Birthday wish", wish: wishText.trim() });
              setWishStatus("Your wish has been submitted. Check the Sheet in a moment. ♡");
              setWishText("");
              setCelebrate(true);
            }}
          >
            Make a wish <Sparkles />
          </button>
          {wishStatus && <p className="wish-status">{wishStatus}</p>}
        </div>
        </>
      ) : (

        <div className="locked-copy">
          <h2>Not yet, birthday detective.</h2>
          <p>
            There are three tiny stars hiding around the site. Find them and
            come back.
          </p>
          <div className="star-map">
            <span className={stars.includes(1) ? "found" : ""}>★</span>
            <span className={stars.includes(2) ? "found" : ""}>★</span>
            <span className={stars.includes(3) ? "found" : ""}>★</span>
          </div>
        </div>
      )}
      <AnimatePresence>
        {celebrate && <Celebration close={() => setCelebrate(false)} />}
      </AnimatePresence>
    </motion.section>
  );
}

function Celebration({ close }: { close: () => void }) {
  return (
    <motion.div
      className="celebrate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      
    <div className="wish-granted-screen">
      <button
        className="wish-close-button"
        onClick={close}
        aria-label="Close celebration"
      >
        ×
      </button>
      <div className="shooting-stars">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={`shooting-star star-${i + 1}`}
          />
        ))}
      </div>

      <motion.h1
        className="wish-granted-text"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.8, ease: "easeOut", delay: 0.8 }}
      >
        Wish Granted !
      </motion.h1>
    </div>

    </motion.div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="section-head">
      <span className="eyebrow">{kicker}</span>
      <h2>{title}</h2>
    </div>
  );
}

function MenuSheet({
  close,
  go,
}: {
  close: () => void;
  go: (x: string) => void;
}) {
  const menuLinks: {
    id: string;
    label: string;
    enabled: boolean;
  }[] = [
    { id: "home", label: "Home", enabled: true },
    { id: "evidence", label: "Memories", enabled: siteSettings.sections.memories },
    { id: "vogue", label: "Vogue Edition", enabled: siteSettings.sections.vogue },
    { id: "cards", label: "Flashcards", enabled: siteSettings.sections.flashcards },
    { id: "quiz", label: "Birthday test", enabled: siteSettings.sections.quiz },
    { id: "wish", label: "Final wish", enabled: siteSettings.sections.finalWish },
  ];

  return (
    <motion.div
      className="sheet-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.div
        className="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-head">
          <b>birthday menu</b>
          <button onClick={close}>
            <X />
          </button>
        </div>

        {menuLinks
          .filter((item) => item.enabled)
          .map((item) => (
            <button
              className="sheet-link"
              key={item.id}
              onClick={() => go(item.id)}
            >
              {item.label}
              <ArrowRight size={17} />
            </button>
          ))}
      </motion.div>
    </motion.div>
  );
}


createRoot(document.getElementById("root")!).render(<App />);
