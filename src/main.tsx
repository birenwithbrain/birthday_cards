import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, Lock, RotateCcw, Sparkles, Star } from 'lucide-react';
import { birthday as b } from './birthday';
import './styles.css';

const ease = [0.22, 1, 0.36, 1] as const;

function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={`section ${className}`}>{children}</section>;
}

function App() {
  const [started, setStarted] = useState(false);
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [evidence, setEvidence] = useState(0);
  const [quiz, setQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [stars, setStars] = useState<number[]>([]);
  const [wished, setWished] = useState(false);

  const quizResult = useMemo(() => {
    if (quizScore >= 3) return 'Certified main character.';
    if (quizScore >= 2) return 'Suspiciously functional human.';
    return 'Beautifully chaotic. As expected.';
  }, [quizScore]);

  const starPositions = [
    { top: '18%', left: '8%' }, { top: '36%', right: '9%' }, { bottom: '16%', left: '18%' }
  ];

  const answerQuiz = (i: number) => {
    const nextScore = quizScore + (i === b.quiz[quiz].answer ? 1 : 0);
    if (quiz < b.quiz.length - 1) { setQuizScore(nextScore); setQuiz(quiz + 1); }
    else { setQuizScore(nextScore); setUnlocked(true); }
  };

  return <main style={{ '--bg': b.theme.background, '--fg': b.theme.foreground, '--primary': b.theme.primary, '--secondary': b.theme.secondary, '--accent': b.theme.accent, '--card': b.theme.card, '--muted': b.theme.muted } as React.CSSProperties}>
    <div className="grain" />
    <nav className="nav"><span>BIRTHDAY PROTOCOL <span className="dot" /></span><span>{String(b.age).padStart(2, '0')} / {new Date().getFullYear()}</span></nav>

    <Section id="top" className="hero">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease }} className="hero-copy">
        <p className="eyebrow">{b.intro.eyebrow}</p>
        <h1>{b.intro.title}<br /><em>{b.name}.</em></h1>
        <p className="lede">{b.intro.subtitle}</p>
        <button className="primary-btn" onClick={() => { setStarted(true); document.getElementById('id-card')?.scrollIntoView({ behavior: 'smooth' }); }}>BEGIN INVESTIGATION <ArrowRight size={18}/></button>
      </motion.div>
      <motion.div className="hero-orbit" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
        <div className="orbit-dot dot-a"/><div className="orbit-dot dot-b"/><div className="orbit-dot dot-c"/>
      </motion.div>
      <div className="scroll-cue"><ArrowDown size={16}/> scroll to investigate</div>
    </Section>

    <AnimatePresence>{started && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Section id="id-card" className="dark-section">
        <div className="section-head"><span>01 / SUBJECT IDENTIFICATION</span><span>CASE #{String(b.age).padStart(3, '0')}</span></div>
        <motion.div initial={{ opacity: 0, scale: .95, rotate: -1 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} className="id-card">
          <div className="id-photo"><img src={b.evidence[0].image} alt={b.name}/><span>SUBJECT PHOTO</span></div>
          <div className="id-info"><div><span className="label">NAME</span><strong>{b.name}</strong></div><div><span className="label">AGE</span><strong>{b.age}</strong></div><div><span className="label">STATUS</span><strong>ALIVE & ICONIC</strong></div><div className="wide"><span className="label">KNOWN FOR</span><strong>{b.subjectLine}</strong></div><div className="barcode" /></div>
        </motion.div>
      </Section>

      <Section className="cream-section">
        <div className="section-head"><span>02 / EVIDENCE ROOM</span><span>EXHIBIT {String(evidence + 1).padStart(2, '0')} / 03</span></div>
        <div className="evidence-wrap">
          <AnimatePresence mode="wait">
            <motion.div key={evidence} initial={{ opacity: 0, x: 60, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: evidence % 2 ? -1 : 1 }} exit={{ opacity: 0, x: -60, rotate: -2 }} transition={{ duration: .45, ease }} className="evidence-card">
              <img src={b.evidence[evidence].image} alt="Evidence"/>
              <div className="tape"/><div className="evidence-copy"><span>{b.evidence[evidence].label}</span><h2>{b.evidence[evidence].title}</h2><p>{b.evidence[evidence].caption}</p></div>
            </motion.div>
          </AnimatePresence>
          <div className="arrow-row"><button onClick={() => setEvidence((evidence - 1 + b.evidence.length) % b.evidence.length)}><ArrowLeft/></button><span>SWIPE / CLICK</span><button onClick={() => setEvidence((evidence + 1) % b.evidence.length)}><ArrowRight/></button></div>
        </div>
      </Section>

      <Section className="lavender-section">
        <div className="section-head"><span>03 / MEMORY TRAINING</span><span>{String(card + 1).padStart(2, '0')} / {String(b.flashcards.length).padStart(2, '0')}</span></div>
        <div className="flash-intro"><p className="eyebrow">FLASHCARD DEPARTMENT</p><h2>How well do you <em>actually</em> know this person?</h2></div>
        <div className="flash-area">
          <motion.div className="flashcard" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: .6, ease }} onClick={() => setFlipped(!flipped)}>
            <div className="flash-face front"><span className="card-number">QUESTION {String(card + 1).padStart(2, '0')}</span><h3>{b.flashcards[card][0]}</h3><p>tap to reveal</p></div>
            <div className="flash-face back"><span className="card-number">OFFICIAL ANSWER</span><h3>{b.flashcards[card][1]}</h3><p>tap to flip back</p></div>
          </motion.div>
          <div className="card-controls"><button onClick={() => {setCard((card - 1 + b.flashcards.length) % b.flashcards.length);setFlipped(false)}}><ArrowLeft/></button><button onClick={() => {setCard((card + 1) % b.flashcards.length);setFlipped(false)}}><ArrowRight/></button></div>
        </div>
      </Section>

      <Section className="cream-section stats-section">
        <div className="section-head"><span>04 / BIRTHDAY ANALYTICS</span><span>LIVE RESULTS</span></div>
        <div className="stats-title"><h2>Scientifically questionable.<br/><em>Emotionally accurate.</em></h2></div>
        <div className="stats-grid">{b.stats.map(([label, value], i) => <div className="stat" key={label}><span>{label}</span><strong>{value}{i === 0 ? '' : '%'}</strong><div className="bar"><motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(Number(value), 100)}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * .1, ease }}/></div></div>)}</div>
      </Section>

      <Section className="dark-section quiz-section">
        <div className="section-head"><span>05 / BEHAVIOURAL ANALYSIS</span><span>QUESTION {quiz + 1} / {b.quiz.length}</span></div>
        {!unlocked ? <div className="quiz-card"><span className="eyebrow">IMPORTANT QUESTION</span><h2>{b.quiz[quiz].q}</h2><div className="options">{b.quiz[quiz].options.map((o, i) => <button key={o} onClick={() => answerQuiz(i)}><span>{String.fromCharCode(65 + i)}</span>{o}</button>)}</div></div> : <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} className="result"><Sparkles size={36}/><span>ANALYSIS COMPLETE</span><h2>{quizResult}</h2><p>You scored {quizScore} / {b.quiz.length}. The birthday committee has accepted these findings.</p></motion.div>}
      </Section>

      <Section className="unlock-section">
        {starPositions.map((p, i) => <button key={i} className={`hidden-star ${stars.includes(i) ? 'found' : ''}`} style={p} onClick={() => setStars(s => s.includes(i) ? s : [...s, i])}><Star size={18} fill="currentColor"/></button>)}
        <div className="lock-card"><div className="lock-icon">{stars.length >= 3 ? <Check/> : <Lock/>}</div><span>FINAL LOCK</span><h2>{stars.length >= 3 ? 'Unlocked.' : `Find the hidden stars. ${stars.length} / 3`}</h2><p>{stars.length >= 3 ? 'You found them. The committee is reluctantly impressed.' : 'Three tiny stars are hiding somewhere on this page.'}</p>{stars.length >= 3 && <button className="primary-btn" onClick={() => document.getElementById('final')?.scrollIntoView({ behavior: 'smooth' })}>OPEN FINAL MESSAGE <ArrowDown size={18}/></button>}</div>
      </Section>

      <Section id="final" className="final-section">
        <div className="confetti-field">{Array.from({length: 18}).map((_, i) => <motion.span key={i} animate={{ y: [0, -35, 0], rotate: [0, 180, 360] }} transition={{ duration: 2.4 + i * .08, repeat: Infinity, delay: i * .07 }} style={{ left: `${(i * 17) % 100}%`, top: `${20 + (i * 13) % 65}%` }}><Sparkles size={14}/></motion.span>)}</div>
        <p className="eyebrow">CASE CLOSED</p><h2>Okay.<br/><em>Enough bullying.</em></h2><p className="final-message">{b.finalMessage}</p><div className="wish-box"><Star/><span>{b.wishPrompt}</span><button onClick={() => setWished(true)}>{wished ? 'WISH SENT ✨' : 'MAKE THE WISH'}</button></div><button className="back-top" onClick={() => document.getElementById('top')?.scrollIntoView({behavior:'smooth'})}><RotateCcw size={15}/> replay</button>
      </Section>
    </motion.div>}</AnimatePresence>
    <footer>MADE WITH QUESTIONABLE AMOUNTS OF LOVE · {new Date().getFullYear()}</footer>
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
