//src/pages/QuizResult.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OPTION_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' };

const getGrade = (pct) => {
  if (pct === 100) return { label: 'Perfect! 🏆',     color: 'text-yellow-600', bg: 'from-yellow-400 to-orange-500'  };
  if (pct >= 80)  return { label: 'Excellent! ⭐',    color: 'text-green-600',  bg: 'from-green-400 to-emerald-600'  };
  if (pct >= 60)  return { label: 'Good Job! 👍',     color: 'text-blue-600',   bg: 'from-blue-400 to-indigo-600'    };
  if (pct >= 40)  return { label: 'Keep Trying! 💪',  color: 'text-orange-600', bg: 'from-orange-400 to-amber-500'   };
  return           { label: 'Practice More! 📚',       color: 'text-red-600',    bg: 'from-red-400 to-rose-600'       };
};

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveScore } = useAuth();

  const {
    score, total, answers = [],
    chapterId, chapterTitle,
    subjectId, subjectName,
    style = { color: 'from-indigo-500 to-purple-600' },
  } = location.state || {};

  const pct   = total ? Math.round((score / total) * 100) : 0;
  const grade = getGrade(pct);

  // Score save karo — ek baar
  useEffect(() => {
    if (score !== undefined && total) {
      saveScore({ score, total, chapterId, chapterTitle, subjectId, subjectName });
    }
  }, []);

  if (!location.state) {
    return (
      <div className="card text-center py-16 max-w-md mx-auto">
        <p className="text-4xl mb-3">🤔</p>
        <p className="font-semibold text-gray-700">No results to show</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Score Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card bg-gradient-to-br ${grade.bg} text-white text-center py-10`}
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Trophy size={44} className="text-white" />
        </motion.div>

        <h2 className="text-3xl font-black">{grade.label}</h2>
        <p className="text-white/80 mt-1 capitalize text-sm">{chapterTitle}</p>

        <div className="flex justify-center items-end gap-2 mt-4">
          <span className="text-7xl font-black leading-none">{pct}</span>
          <span className="text-3xl font-bold text-white/70 pb-2">%</span>
        </div>
        <p className="text-white/70 text-sm mt-1">{score} correct out of {total} questions</p>

        {/* Mini stats */}
        <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/20">
          {[
            { icon: '✅', label: 'Correct',   val: answers.filter(a => a.isRight).length    },
            { icon: '❌', label: 'Wrong',     val: answers.filter(a => !a.isRight && !a.timedOut).length },
            { icon: '⏰', label: 'Timed Out', val: answers.filter(a => a.timedOut).length   },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold">{s.val}</p>
              <p className="text-white/60 text-xs">{s.icon} {s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-2)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16}/> Back to Chapter
        </button>
        <button
          onClick={() => navigate(`/quiz/${chapterId}`, { state: location.state })}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <RotateCcw size={16}/> Retry Quiz
        </button>
      </div>

      {/* Answer Review */}
      {answers.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Answer Review</h3>
          <div className="space-y-3">
            {answers.map((ans, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`card border-l-4 ${ans.isRight ? 'border-l-green-500' : 'border-l-red-400'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ans.isRight ? 'bg-green-100' : 'bg-red-100'}`}>
                    {ans.isRight
                      ? <CheckCircle2 size={16} className="text-green-600"/>
                      : ans.timedOut
                        ? <Clock size={16} className="text-orange-500"/>
                        : <XCircle size={16} className="text-red-500"/>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{ans.question}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs">
                      {ans.timedOut ? (
                        <span className="text-orange-600 font-medium">⏰ Timed out</span>
                      ) : (
                        <span className={`font-medium ${ans.isRight ? 'text-green-600' : 'text-red-500'}`}>
                          Your answer: Option {OPTION_LABELS[ans.selected]}
                        </span>
                      )}
                      {!ans.isRight && (
                        <span className="text-green-600 font-medium">
                          ✓ Correct: Option {OPTION_LABELS[ans.correct]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Go to Dashboard */}
      <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full">
        Back to Dashboard 🏠
      </button>
    </div>
  );
}
