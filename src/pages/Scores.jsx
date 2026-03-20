//src/pages/Scores.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getColor = (pct) =>
  pct >= 80 ? 'text-green-600 bg-green-50' :
  pct >= 50 ? 'text-yellow-600 bg-yellow-50' :
              'text-red-600 bg-red-50';

const getBarColor = (pct) =>
  pct >= 80 ? 'bg-green-500' :
  pct >= 50 ? 'bg-yellow-500' :
              'bg-red-500';

export default function Scores() {
  const { scores } = useAuth();
  const navigate   = useNavigate();

  const totalQuizzes  = scores.length;
  const avgScore      = totalQuizzes
    ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / totalQuizzes)
    : 0;
  const bestScore     = totalQuizzes
    ? Math.max(...scores.map(s => Math.round((s.score / s.total) * 100)))
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
        <ArrowLeft size={16}/> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900">My Scores</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: '✅', label: 'Total Quizzes', value: totalQuizzes,    color: 'text-indigo-600' },
          { icon: '⭐', label: 'Average Score', value: `${avgScore}%`,  color: 'text-blue-600'   },
          { icon: '🏆', label: 'Best Score',    value: `${bestScore}%`, color: 'text-yellow-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {totalQuizzes === 0 && (
        <div className="card text-center py-14">
          <p className="text-5xl mb-3">🎯</p>
          <p className="font-semibold text-gray-700">No quizzes attempted yet</p>
          <p className="text-gray-400 text-sm mt-1">Study a chapter and take your first quiz!</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
            Start Learning
          </button>
        </div>
      )}

      {/* Scores List */}
      {totalQuizzes > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={18} className="text-indigo-500"/>
            <h2 className="font-bold text-gray-900">All Attempts</h2>
          </div>
          <div className="space-y-3">
            {scores.map((s, i) => {
              const pct = Math.round((s.score / s.total) * 100);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Trophy size={18} className="text-indigo-600"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 capitalize truncate">{s.chapterTitle}</p>
                      <p className="text-gray-400 text-xs capitalize mt-0.5">{s.subjectName} • {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getBarColor(pct)}`} style={{ width: `${pct}%` }}/>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getColor(pct)}`}>
                          {s.score}/{s.total} ({pct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
