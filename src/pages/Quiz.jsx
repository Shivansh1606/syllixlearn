//src/pages/Quiz.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { quizAPI, parseQuizResponse } from '../api/api';
import toast from 'react-hot-toast';

const OPTION_KEYS    = ['a', 'b', 'c', 'd'];
const OPTION_LABELS  = { a: 'A', b: 'B', c: 'C', d: 'D' };
const TOTAL_SECONDS  = 30;

// Loading Skeleton
const QuizSkeleton = () => (
  <div className="space-y-4">
    <div className="card animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-6" />
      {[1,2,3,4].map(i => (
        <div key={i} className="h-12 bg-gray-100 rounded-xl mb-3" />
      ))}
    </div>
  </div>
);

export default function Quiz() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();
  const timerRef  = useRef(null);

  const chapter      = location.state?.chapter;
  const subject      = location.state?.subject;
  const style        = location.state?.style || { color: 'from-indigo-500 to-purple-600', icon: '📖' };
  const chapterTitle = location.state?.chapterTitle || chapter?.title || 'Chapter';

  // States
  const [questions,    setQuestions]    = useState([]);
  const [current,      setCurrent]      = useState(0);
  const [selected,     setSelected]     = useState(null);   // selected option key: 'a'/'b'/'c'/'d'
  const [answered,     setAnswered]     = useState(false);
  const [answers,      setAnswers]      = useState([]);     // { questionIndex, selected, correct, isRight }
  const [timeLeft,     setTimeLeft]     = useState(TOTAL_SECONDS);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [quizDone,     setQuizDone]     = useState(false);

  // Fetch quiz questions
  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const data      = await quizAPI.getByChapter(id);
      const parsed    = parseQuizResponse(data.quiz);

      if (!parsed.length) {
        setError('Could not parse quiz questions. Please try again.');
        return;
      }
      setQuestions(parsed);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuiz(); }, [id]);

  // Timer
  useEffect(() => {
    if (loading || error || quizDone || answered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSkip();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, loading, error, quizDone, answered]);

  const handleAutoSkip = () => {
    // Time out → mark as wrong, no selection
    const q = questions[current];
    const newAnswers = [...answers, {
      questionIndex: current,
      question:      q.question,
      selected:      null,
      correct:       q.answer,
      isRight:       false,
      timedOut:      true,
    }];
    setAnswers(newAnswers);
    setAnswered(true);
    toast('⏰ Time up!', { icon: '⏰' });
  };

  const handleSelect = (optionKey) => {
    if (answered) return;
    clearInterval(timerRef.current);

    const q       = questions[current];
    const isRight = optionKey === q.answer;

    setSelected(optionKey);
    setAnswered(true);
    setAnswers(prev => [...prev, {
      questionIndex: current,
      question:      q.question,
      selected:      optionKey,
      correct:       q.answer,
      isRight,
      timedOut:      false,
    }]);
  };

  const handleNext = () => {
    clearInterval(timerRef.current);
    if (current + 1 >= questions.length) {
      setQuizDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(TOTAL_SECONDS);
    }
  };

  const correctCount = answers.filter(a => a.isRight).length;

  // Navigate to result when done
  useEffect(() => {
    if (quizDone && questions.length > 0) {
      navigate(`/quiz-result`, {
        replace: true,
        state: {
          score:        correctCount,
          total:        questions.length,
          answers,
          chapterId:    parseInt(id),
          chapterTitle,
          subjectId:    subject?.id,
          subjectName:  subject?.name,
          style,
        }
      });
    }
  }, [quizDone]);

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        AI is generating your quiz...
      </div>
      <QuizSkeleton />
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center py-12">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-semibold text-gray-700">Failed to load quiz</p>
        <p className="text-gray-400 text-sm mt-1">{error}</p>
        <div className="flex gap-3 justify-center mt-4">
          <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16}/> Go Back
          </button>
          <button onClick={fetchQuiz} className="btn-primary flex items-center gap-2">
            <RefreshCw size={16}/> Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const q           = questions[current];
  const timerPct    = (timeLeft / TOTAL_SECONDS) * 100;
  const timerColor  = timeLeft > 15 ? 'bg-green-500' : timeLeft > 7 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
        <ArrowLeft size={16}/> Back
      </button>

      {/* Header */}
      <div className={`card bg-gradient-to-r ${style.color} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">Quiz</p>
            <h1 className="font-bold text-lg capitalize">{chapterTitle}</h1>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">Progress</p>
            <p className="text-2xl font-black">{current + 1}<span className="text-white/60 text-sm font-normal">/{questions.length}</span></p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3">
        <Clock size={16} className={`flex-shrink-0 ${timeLeft <= 7 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}/>
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors duration-300 ${timerColor}`}
            style={{ width: `${timerPct}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
        <span className={`text-sm font-bold w-8 text-right tabular-nums ${timeLeft <= 7 ? 'text-red-500' : 'text-gray-600'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="card"
        >
          <p className="text-base font-semibold text-gray-900 mb-5 leading-relaxed text-center">
            Q{current + 1}. {q.question}
          </p>

          <div className="space-y-3">
            {OPTION_KEYS.map(key => {
              let btnClass = 'w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3 ';

              if (!answered) {
                btnClass += 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer';
              } else if (key === q.answer) {
                btnClass += 'border-green-500 bg-green-50 text-green-800 cursor-default';
              } else if (key === selected && key !== q.answer) {
                btnClass += 'border-red-400 bg-red-50 text-red-700 cursor-default';
              } else {
                btnClass += 'border-gray-100 text-gray-400 cursor-default';
              }

              return (
                <button key={key} className={btnClass} onClick={() => handleSelect(key)}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${answered && key === q.answer       ? 'bg-green-500 text-white' :
                      answered && key === selected        ? 'bg-red-400 text-white' :
                      !answered                           ? 'bg-gray-100 text-gray-600' :
                                                            'bg-gray-100 text-gray-400'}`}
                  >
                    {answered && key === q.answer  ? <CheckCircle2 size={14}/> :
                     answered && key === selected  ? <XCircle size={14}/>  :
                     OPTION_LABELS[key]}
                  </span>
                  {q[key]}
                </button>
              );
            })}
          </div>

          {/* Feedback after answer */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-xl flex items-center justify-between gap-3
                ${answers[answers.length - 1]?.timedOut ? 'bg-orange-50 border border-orange-200' :
                  answers[answers.length - 1]?.isRight   ? 'bg-green-50 border border-green-200' :
                                                            'bg-red-50 border border-red-200'}`}
            >
              <div className="flex items-center gap-2">
                {answers[answers.length - 1]?.timedOut ? (
                  <><span className="text-xl">⏰</span>
                  <span className="text-orange-700 text-sm font-semibold">Time's up!</span></>
                ) : answers[answers.length - 1]?.isRight ? (
                  <><CheckCircle2 size={18} className="text-green-600 flex-shrink-0"/>
                  <span className="text-green-700 text-sm font-semibold">Correct! 🎉</span></>
                ) : (
                  <><XCircle size={18} className="text-red-500 flex-shrink-0"/>
                  <span className="text-red-700 text-sm font-semibold">
                    Correct: Option {OPTION_LABELS[q.answer]} — {q[q.answer]}
                  </span></>
                )}
              </div>
              <button
                onClick={handleNext}
                className="bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition-colors flex-shrink-0"
              >
                {current + 1 >= questions.length ? 'See Results 🏆' : 'Next →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Score so far */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
        <Zap size={14} className="text-indigo-400"/>
        <span>{correctCount} correct out of {current + (answered ? 1 : 0)} answered</span>
      </div>
    </div>
  );
}
