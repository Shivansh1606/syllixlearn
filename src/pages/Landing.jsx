// src/pages/Landing.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Zap, BookOpen, Trophy, BarChart2, Brain, Star,
  ChevronRight, Play, CheckCircle2, ArrowRight,
  GraduationCap, Target, Flame, X,
  TrendingUp, Clock, Award, ChevronDown,
} from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

/* ─── Static Data ─────────────────────────────────── */
const FEATURES = [
  { icon: BookOpen, color: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50',   text: 'text-blue-600',   title: 'Deep Topic Study',       desc: 'Structured study material for every topic — clear explanations, examples, and key points.',  emoji: '📖' },
  { icon: Brain,    color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', text: 'text-purple-600', title: 'Smart AI Quizzes',        desc: 'Topic-wise quizzes with instant feedback, 30s timer, and detailed answer review.',            emoji: '🧠' },
  { icon: BarChart2,color: 'from-green-500 to-emerald-600', bg: 'bg-green-50',  text: 'text-green-600',  title: 'Progress Tracking',       desc: 'Visual charts to track scores, identify weak topics, and celebrate strong ones.',             emoji: '📊' },
  { icon: Target,   color: 'from-orange-500 to-amber-600',  bg: 'bg-orange-50', text: 'text-orange-600', title: 'Personalised Dashboard',  desc: 'Your class, your board, your subjects — everything customised just for you.',                 emoji: '🎯' },
  { icon: Trophy,   color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', text: 'text-yellow-600', title: 'Score History',           desc: "Every quiz attempt saved. See how much you've improved over time.",                           emoji: '🏆' },
  { icon: Flame,    color: 'from-red-500 to-rose-600',      bg: 'bg-red-50',    text: 'text-red-600',    title: 'Daily Streaks',           desc: 'Stay consistent with streak tracking. Small habits lead to big results.',                     emoji: '🔥' },
];

const BOARDS  = ['CBSE', 'ICSE', 'UP Board', 'MP Board', 'Bihar Board', 'Rajasthan Board'];
const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  class: 'Class 10 • CBSE',    avatar: 'PS', color: 'from-pink-400 to-rose-500',    text: 'Syllix Learn identify my Maths weakness and now I am scoring more than 90% score!',  rating: 5, score: 90 },
  { name: 'Rahul Verma',   class: 'Class 9 • UP Board', avatar: 'RV', color: 'from-blue-400 to-indigo-500',  text: 'Each and every topic is deeply explain. Best learning platform I have ever used.', rating: 5, score: 85 },
  { name: 'Anjali Singh',  class: 'Class 12 • ICSE',    avatar: 'AS', color: 'from-green-400 to-emerald-500',text: 'Best app for study and analysis your knowledge.',    rating: 5, score: 92 },
  { name: 'Arjun Mehta',   class: 'Class 8 • CBSE',     avatar: 'AM', color: 'from-purple-400 to-violet-500',text: 'Daily Streak feature make me consistent towards study!',          rating: 5, score: 88 },
];

const STATS = [
  { value: 10000, suffix: '+', label: 'Students Learning', icon: '👨‍🎓', color: 'text-indigo-300' },
  { value: 500,   suffix: '+', label: 'Topics Covered',    icon: '📚', color: 'text-purple-300' },
  { value: 10000, suffix: '+', label: 'Quizzes Daily',     icon: '✅', color: 'text-blue-300'   },
  { value: 8,     suffix: '',  label: 'Boards Supported',  icon: '🏫', color: 'text-pink-300'   },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Register & Set Up',  desc: 'Create your account with class and board details.', icon: '📝', color: 'bg-indigo-100 text-indigo-700', line: 'from-indigo-400 to-purple-400' },
  { step: '02', title: 'Pick Your Subjects', desc: 'Select subjects from your class curriculum.',       icon: '📖', color: 'bg-purple-100 text-purple-700', line: 'from-purple-400 to-blue-400'   },
  { step: '03', title: 'Study Topics',       desc: 'Read AI-generated deep explanations per chapter.',  icon: '🧠', color: 'bg-blue-100 text-blue-700',    line: 'from-blue-400 to-green-400'    },
  { step: '04', title: 'Take Quizzes',       desc: 'Test yourself and track your score history.',       icon: '🎯', color: 'bg-green-100 text-green-700',  line: null                            },
];

const DEMO_QUESTIONS = [
  {
    q: 'Which tense describes an action completed before another past action?',
    options: ['Past Simple', 'Past Perfect', 'Present Perfect', 'Past Continuous'],
    answer: 1,
  },
  {
    q: 'What is the value of π (pi) up to 2 decimal places?',
    options: ['3.14', '3.41', '2.14', '3.12'],
    answer: 0,
  },
];

const FAQS = [
  { q: 'Is Syllix Learn free to use?',          a: 'Yes! Syllix Learn is completely free for all students.' },
  { q: 'Which classes are supported?',           a: 'Classes 6 to 12 across all major Indian boards.' },
  { q: 'How does the AI quiz work?',             a: 'Our AI generates topic-specific MCQs. Each question has a 30-second timer and instant feedback.' },
  { q: 'Can I track my improvement over time?',  a: 'Yes! Every quiz attempt is saved with score history and visual progress charts.' },
  { q: 'Which boards are supported?',            a: 'CBSE, ICSE, UP Board, MP Board, Bihar Board, Rajasthan Board, and more.' },
];

/* ─── Animated Counter ────────────────────────────── */
function AnimatedCounter({ value, suffix }) {
  const ref       = useRef(null);
  const inView    = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring    = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => { if (inView) motionVal.set(value); }, [inView, value, motionVal]);
  useEffect(() => spring.on('change', v => setDisplay(Math.floor(v))), [spring]);

  return (
    <span ref={ref}>
      {display >= 1000 ? `${(display / 1000).toFixed(0)}K` : display}{suffix}
    </span>
  );
}

/* ─── FadeUp Utility ──────────────────────────────── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Navbar ──────────────────────────────────────── */
function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['Features', 'How It Works', 'Demo', 'FAQs'];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200/10">
            <Zap size={19} className="text-white" />
          </div>
          <span className={`font-black text-xl transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            Syllix<span className={scrolled ? 'text-indigo-600' : 'text-indigo-300'}>Learn</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(item => (
            <a key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${scrolled ? 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link to="/login"
            className={`hidden sm:block text-sm font-semibold px-4 py-2 rounded-xl transition-all
              ${scrolled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-white hover:bg-white/10'}`}>
            Sign In
          </Link>
          <Link to="/register"
            className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 flex items-center gap-1.5">
            Get Started <ArrowRight size={15}/>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Interactive Demo Quiz ───────────────────────── */
function DemoQuiz() {
  const [qIndex,   setQIndex]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    if (answered || done) { clearInterval(timerRef.current); return; }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setAnswered(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIndex, answered, done]);

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === DEMO_QUESTIONS[qIndex].answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qIndex + 1 >= DEMO_QUESTIONS.length) { setDone(true); return; }
    setQIndex(q => q + 1);
    setSelected(null);
    setAnswered(false);
  };

  const reset = () => {
    setQIndex(0); setSelected(null);
    setAnswered(false); setScore(0); setDone(false);
  };

  const q          = DEMO_QUESTIONS[qIndex];
  const pct        = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 15 ? 'bg-green-500' : timeLeft > 7 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"/>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"/>
          <div className="w-3 h-3 bg-green-400 rounded-full"/>
        </div>
        <span className="text-white/80 text-sm font-semibold">🎯 Live Quiz Demo</span>
        <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded-lg">Try it!</span>
      </div>

      <div className="p-6">
        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock size={14} className={timeLeft <= 7 ? 'text-red-500 animate-pulse' : 'text-gray-400'}/>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${pct}%` }}/>
                </div>
                <span className={`text-xs font-bold w-6 tabular-nums ${timeLeft <= 7 ? 'text-red-500' : 'text-gray-500'}`}>{timeLeft}s</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium">Q{qIndex + 1} of {DEMO_QUESTIONS.length}</span>
                <div className="flex gap-1">
                  {DEMO_QUESTIONS.map((_, i) => (
                    <div key={i} className={`w-8 h-1.5 rounded-full ${i <= qIndex ? 'bg-indigo-500' : 'bg-gray-200'}`}/>
                  ))}
                </div>
              </div>

              <p className="font-bold text-gray-900 text-sm leading-relaxed mb-4 text-center">{q.q}</p>

              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  let cls = 'w-full text-left p-3 rounded-xl border-2 text-sm transition-all duration-200 flex items-center gap-3 ';
                  if (!answered)                       cls += 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer text-gray-700';
                  else if (i === q.answer)             cls += 'border-green-500 bg-green-50 text-green-800 cursor-default';
                  else if (i === selected)             cls += 'border-red-400 bg-red-50 text-red-700 cursor-default';
                  else                                 cls += 'border-gray-100 text-gray-400 cursor-default';
                  return (
                    <button key={i} className={cls} onClick={() => handleSelect(i)}>
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0
                        ${answered && i === q.answer ? 'bg-green-500 text-white' :
                          answered && i === selected  ? 'bg-red-400 text-white'  :
                          'bg-gray-100 text-gray-600'}`}
                      >
                        {['A','B','C','D'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between"
                >
                  <span className={`text-sm font-semibold ${selected === q.answer ? 'text-green-600' : timeLeft === 0 ? 'text-orange-500' : 'text-red-500'}`}>
                    {selected === q.answer ? '🎉 Correct!' : timeLeft === 0 ? "⏰ Time's up!" : '❌ Wrong!'}
                  </span>
                  <button onClick={handleNext}
                    className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
                    {qIndex + 1 >= DEMO_QUESTIONS.length ? 'See Results 🏆' : 'Next →'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="text-5xl mb-3">{score === DEMO_QUESTIONS.length ? '🏆' : '📊'}</div>
            <p className="text-2xl font-black text-gray-900">{score}/{DEMO_QUESTIONS.length}</p>
            <p className="text-gray-500 text-sm mt-1">
              {score === DEMO_QUESTIONS.length ? 'Perfect Score! 🎉' : 'Keep Practicing! 💪'}
            </p>
            <div className="mt-4 p-3 bg-indigo-50 rounded-xl text-sm text-indigo-700 font-medium">
              There are multiple question with explaination after creating account!!
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={reset} className="flex-1 border-2 border-indigo-200 text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-indigo-50 text-sm transition-colors">
                Try Again
              </button>
              <Link to="/register" className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 text-sm transition-colors flex items-center justify-center gap-1.5">
                Start Learning <ArrowRight size={14}/>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── FAQ Item ────────────────────────────────────── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`border-2 rounded-2xl transition-all duration-300 overflow-hidden ${open ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-100 bg-white hover:border-indigo-100'}`}
    >
      <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown size={18} className={open ? 'text-indigo-600' : 'text-gray-400'}/>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Hero App Illustration ───────────────────────── */
function HeroIllustration() {
  return (
    <div className="relative w-72 h-80 lg:w-96 lg:h-[420px]">
      {/* Glow blobs */}
      <div className="absolute top-8 right-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-8 left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000" />

      {/* Main App Card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-52 h-72 lg:w-64 lg:h-80 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-4 flex flex-col gap-3">

          {/* App Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Zap size={14} className="text-white"/>
            </div>
            <div>
              <div className="text-white text-xs font-bold">SyllixLearn</div>
              <div className="text-indigo-300 text-[10px]">Class 10 • CBSE</div>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Chapter Card */}
          <div className="bg-white/15 rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📐</span>
              <div>
                <div className="text-white text-xs font-bold">Number System</div>
                <div className="text-indigo-300 text-[10px]">Mathematics • Ch 1</div>
              </div>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-green-400 rounded-full"
              />
            </div>
            <div className="text-indigo-300 text-[10px] mt-1">75% Complete</div>
          </div>

          {/* AI Explanation Preview */}
          <div className="bg-white/10 rounded-2xl p-3 flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🤖</span>
              <span className="text-indigo-300 text-[10px] font-semibold">AI Explanation</span>
            </div>
            <div className="space-y-1.5">
              {[95, 80, 90, 70, 85].map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  animate={{ width: `${w}%` }}
                  transition={{ delay: 1.5 + i * 0.1, duration: 0.6 }}
                  className="h-1.5 bg-white/30 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Quiz Score */}
          <div className="bg-green-400/20 border border-green-400/30 rounded-2xl p-2.5 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <div>
              <div className="text-white text-xs font-bold">Quiz Passed!</div>
              <div className="text-green-300 text-[10px]">Score: 4/5 (80%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge — Top Left */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 -left-4 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white/20 shadow-lg"
      >
        <p className="text-white text-xs font-bold">🎯 AI Quiz</p>
        <p className="text-indigo-200 text-[10px]">5 Questions</p>
      </motion.div>

      {/* Floating Badge — Bottom Right */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-4 -right-4 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white/20 shadow-lg"
      >
        <p className="text-white text-xs font-bold">⭐ 80% Avg</p>
        <p className="text-indigo-200 text-[10px]">Keep Going!</p>
      </motion.div>

      {/* Floating Icon — Top Right */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-10 -right-2 w-11 h-11 bg-purple-500/40 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
      >
        <span className="text-2xl">📚</span>
      </motion.div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────── */
export default function Landing() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredFeature,    setHoveredFeature]    = useState(null);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex items-center justify-center overflow-hidden">

        {/* BG Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl -top-40 -right-40" />
          <div className="absolute w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl -bottom-40 -left-40" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[800px] h-[800px] border border-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[500px] h-[500px] border border-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Floating Subject Pills */}
        {[
          { label: '📐 Mathematics', pos: 'top-[28%] left-[3%]',    delay: 0.2 },
          { label: '🔬 Science',     pos: 'top-[35%] right-[3%]',   delay: 0.4 },
          { label: '🌍 Social Sci.', pos: 'bottom-[30%] left-[3%]', delay: 0.6 },
          { label: '📚 English',     pos: 'bottom-[25%] right-[3%]',delay: 0.8 },
        ].map(pill => (
          <motion.div
            key={pill.label}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1], scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: pill.delay, duration: 0.4 },
              scale:   { delay: pill.delay, duration: 0.4 },
              y:       { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: pill.delay },
            }}
            className={`absolute ${pill.pos} hidden lg:flex bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg`}
          >
            {pill.label}
          </motion.div>
        ))}

        {/* ── Hero Content — 2 Column Layout ── */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* LEFT — Text */}
            <div className="flex-1 text-center lg:text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Free for all students • Class 6–12
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-[58px] font-black text-white leading-[1.1] tracking-tight"
              >
                Learn Smarter,
                <br />
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Score Higher ⚡
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-indigo-200/90 text-lg sm:text-xl mt-5 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                India's smartest learning platform for Class 6–12 students. AI-generated explanations, timed quizzes, and progress tracking — all in one place.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8"
              >
                <Link to="/register"
                  className="group bg-white text-indigo-700 font-bold text-base px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-900/50 active:scale-95 flex items-center justify-center gap-2"
                >
                  Start Learning Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </Link>
                <a href="#demo"
                  className="group bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Play size={16} className="fill-white group-hover:scale-110 transition-transform" /> Try Demo Quiz
                </a>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-6"
              >
                {['100% Free', 'All Major Boards', 'Class 6–12'].map(badge => (
                  <span key={badge} className="flex items-center gap-1.5 text-indigo-300 text-sm font-medium">
                    <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" /> {badge}
                  </span>
                ))}
              </motion.div>

              {/* Mini Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-3 mt-8 max-w-xs mx-auto lg:mx-0"
              >
                {[
                  { val: '10K+', label: 'Students' },
                  { val: '500+', label: 'Topics'   },
                  { val: '8',    label: 'Boards'   },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3 text-center">
                    <p className="text-xl font-black text-white">{s.val}</p>
                    <p className="text-indigo-300 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — App Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex justify-center lg:justify-end"
            >
              <HeroIllustration />
            </motion.div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-indigo-400 cursor-pointer"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-indigo-400/60 rounded-full flex items-start justify-center pt-1.5">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-2 bg-indigo-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ───────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.1} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/70 text-sm mt-1 font-medium">{stat.label}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-16">
            <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Why Students Love{' '}
              <span className="text-indigo-600">Syllix Learn</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              Built specifically for Indian students — covering all major boards and classes 6–12.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.07}>
                <motion.div
                  onHoverStart={() => setHoveredFeature(i)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 h-full cursor-default
                    ${hoveredFeature === i ? 'border-indigo-200 shadow-xl shadow-indigo-100' : 'border-gray-100 shadow-sm'}`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ scale: hoveredFeature === i ? 1.1 : 1 }}
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <f.icon size={22} className="text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-1">{f.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                  {hoveredFeature === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-indigo-600 font-semibold"
                    >
                      <Link to="/login" className="flex items-center gap-1 hover:gap-2 transition-all">
                        Try this feature <ArrowRight size={14}/>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-purple-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
              Start in <span className="text-purple-600">4 Easy Steps</span>
            </h2>
          </FadeUp>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.15} className="relative">
                {step.line && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%+8px)] w-[calc(100%-16px)] h-0.5">
                    <div className={`w-full h-full bg-gradient-to-r ${step.line} opacity-30`}/>
                    <ChevronRight size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300"/>
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="text-center bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-200 relative z-10"
                >
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm`}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-black text-gray-300 tracking-widest mb-1">STEP {step.step}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4} className="text-center mt-10">
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 text-base">
              <GraduationCap size={20}/> Get Started Free
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── DEMO QUIZ ───────────────────────────────── */}
      <section id="demo" className="py-24 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl top-0 right-0"/>
          <div className="absolute w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl bottom-0 left-0"/>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <span className="inline-block bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                🎮 Interactive Demo
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                Try a Real Quiz
                <br />
                <span className="text-indigo-300">Right Here!</span>
              </h2>
              <p className="text-indigo-200 text-lg mb-6 leading-relaxed">
                Experience our AI-powered quiz system. 30-second timer, instant feedback, and score tracking — exactly like the real app.
              </p>
              <div className="space-y-3">
                {['5 MCQ questions per chapter', '30-second timer per question', 'Instant right/wrong feedback', 'Full answer review at the end'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-indigo-200">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0"/>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register"
                className="inline-flex items-center gap-2 mt-8 bg-white text-indigo-700 font-bold px-6 py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95 text-sm">
                Take Full Quizzes <ArrowRight size={16}/>
              </Link>
            </FadeUp>

            <FadeUp delay={0.2}>
              <DemoQuiz />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── BOARDS ──────────────────────────────────── */}
      <section id="boards" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span className="inline-block bg-green-100 text-green-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
              All Major Boards 🏫
            </h2>
            <p className="text-gray-500 mb-10">Structured content for Classes 6–12 across India's top education boards.</p>
          </FadeUp>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {BOARDS.map((b, i) => (
              <FadeUp key={b} delay={i * 0.06}>
                <motion.span
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white border-2 border-indigo-100 hover:border-indigo-400 text-gray-700 hover:text-indigo-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all cursor-default shadow-sm hover:shadow-md block"
                >
                  {b}
                </motion.span>
              </FadeUp>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {CLASSES.map((c, i) => (
              <FadeUp key={c} delay={i * 0.05}>
                <motion.span
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-bold px-5 py-2 rounded-xl text-sm block cursor-default shadow-lg shadow-indigo-200"
                >
                  Class {c}
                </motion.span>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-14">
            <span className="inline-block bg-yellow-100 text-yellow-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              Student Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Students Love Syllix Learn ❤️
            </h2>
          </FadeUp>

          <div className="max-w-2xl mx-auto mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-6 italic">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-4 py-2 rounded-xl mb-5">
                  <TrendingUp size={15}/> Now scoring {TESTIMONIALS[activeTestimonial].score}%
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${TESTIMONIALS[activeTestimonial].color} flex items-center justify-center text-white font-bold text-sm`}>
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-gray-500 text-xs">{TESTIMONIALS[activeTestimonial].class}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} aria-label={`Review ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-indigo-600 w-6' : 'bg-gray-300 w-2 hover:bg-indigo-300'}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${i === activeTestimonial ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-200'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xs`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.class.split('•')[0].trim()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={12} className="text-green-500"/>
                  <span className="text-green-600 text-xs font-bold">{t.score}%</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQS ────────────────────────────────────── */}
      <section id="faqs" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Common Questions
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -right-20" />
          <div className="absolute w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -bottom-10 -left-10" />
          <motion.div
            animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[600px] h-[600px] border border-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <FadeUp className="relative max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-indigo-300">Learning Journey?</span>
          </h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join thousands of students already using Syllix Learn — it's completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register"
              className="group bg-white text-indigo-700 font-bold text-base px-10 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2"
            >
              <GraduationCap size={20} />
              Create Free Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <a href="#demo"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Play size={16} className="fill-white"/> Try Demo First
            </a>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-black text-lg">Syllix<span className="text-indigo-400">Learn</span></span>
            </Link>

            <p className="text-sm text-center text-gray-500">
              Built with ❤️ for Indian students • Class 6–12 • All Boards
            </p>

            <div className="flex gap-4 text-sm">
              <Link to="/register" className="hover:text-white transition-colors font-medium">Register</Link>
              <Link to="/login"    className="hover:text-white transition-colors font-medium">Login</Link>
              <a href="#features"  className="hover:text-white transition-colors font-medium">Features</a>
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs mt-6">
            © 2026 SyllixLearn. Free for all students.
          </p>
        </div>
      </footer>
    </div>
  );
}
