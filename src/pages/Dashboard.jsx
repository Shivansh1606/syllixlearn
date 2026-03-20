//src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, BookOpen, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { syllabusAPI } from '../api/api';
import toast from 'react-hot-toast';

// Subject ke liye color/icon mapping (API mein nahi hai — frontend pe assign karte hain)
const SUBJECT_STYLES = {
  english: {
    color: 'from-blue-500 to-indigo-600',
    icon: '✍️',
  },
  mathematics: {
    color: 'from-purple-500 to-violet-600',
    icon: '📐',
  },
  physics: {
    color: 'from-green-500 to-emerald-600',
    icon: '⚡',
  },
  chemistry: {
    color: 'from-orange-500 to-amber-600',
    icon: '🧪',
  },
  biology: {
    color: 'from-red-500 to-rose-600',
    icon: '🌱',
  },
};

const getStyle = (subjectName) => {
  if (!subjectName) return SUBJECT_STYLES.english;

  const key = subjectName.toLowerCase().replace(' ', '');

  return SUBJECT_STYLES[key] || {
    color: 'from-gray-500 to-gray-600',
    icon: '📚',
  };
};

// Skeleton Card
const SubjectSkeleton = () => (
  <div className="card animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-gray-200 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
    <div className="h-2 bg-gray-100 rounded w-full" />
  </div>
);

export default function Dashboard() {
  const { user, scores } = useAuth();
  const navigate         = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchSubjects = async () => {
    if (!user?.board_id || !user?.class_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Syllabus tree se poora data ek call mein
      const tree = await syllabusAPI.getTree(user.board_id);

      // User ki class find karo tree mein
      const boardData = tree.find(b => b.id === user.board_id) || tree[0];
      const classData = boardData?.classes?.find(c => c.id === user.class_id);
      const subs      = classData?.subjects || [];

      setSubjects(subs);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user?.board_id, user?.class_id]);

  const avgScore = scores.length
    ? Math.round(scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / scores.length)
    : 0;

  const noSetup = !user?.board_id || !user?.class_id;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <div className="w-64 h-64 bg-white rounded-full absolute -right-16 -top-16" />
          <div className="w-40 h-40 bg-white rounded-full absolute right-8 bottom-0" />
        </div>
        <div className="relative">
          <p className="text-indigo-200 text-sm font-medium">
            {new Date().getHours() < 12 ? '🌅 Good Morning' : new Date().getHours() < 17 ? '☀️ Good Afternoon' : '🌙 Good Evening'}
          </p>
          <h1 className="text-2xl font-bold mt-1">{user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-indigo-200 text-sm mt-1">
            {user?.boardName && user?.className
              ? `Class ${user.className} • ${user.boardName} • Ready to learn?`
              : 'Set up your profile to get started!'}
          </p>
          {noSetup && (
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <Plus size={16}/> Complete Your Profile
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '📚', label: 'Subjects',     value: subjects.length },
          { icon: '✅', label: 'Quizzes Done', value: scores.length   },
          { icon: '⭐', label: 'Avg Score',    value: `${avgScore}%`  },
          { icon: '🔥', label: 'Day Streak',   value: '1'             },
        ].map(stat => (
          <div key={stat.label} className="card flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Subjects</h2>
          {error && (
            <button onClick={fetchSubjects} className="text-sm text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
              <RefreshCw size={14}/> Retry
            </button>
          )}
        </div>

        {/* No Setup State */}
        {noSetup && (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">🎓</p>
            <p className="font-semibold text-gray-700">Profile setup incomplete</p>
            <p className="text-gray-400 text-sm mt-1">Add your board and class to see subjects</p>
            <button onClick={() => navigate('/profile')} className="btn-primary mt-4">
              Complete Profile
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {!noSetup && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SubjectSkeleton key={i} />)}
          </div>
        )}

        {/* Error State */}
        {!noSetup && !loading && error && (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">😕</p>
            <p className="font-semibold text-gray-700">Failed to load subjects</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
            <button onClick={fetchSubjects} className="btn-primary mt-4 flex items-center gap-2 mx-auto">
              <RefreshCw size={16}/> Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!noSetup && !loading && !error && subjects.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-gray-700">No subjects available yet</p>
            <p className="text-gray-400 text-sm mt-1">Content is being added for your class</p>
          </div>
        )}

        {/* Subjects Grid */}
        {!noSetup && !loading && !error && subjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, i) => {
              const style = getStyle(subject.name);
              const chapterCount = subject.chapters?.length || 0;
              const subScores   = scores.filter(s => s.subjectId === subject.id);
              const subAvg      = subScores.length
                ? Math.round(subScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / subScores.length)
                : null;

              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(`/subject/${subject.id}`, { state: { subject, style } })}
                  className="card cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {style.icon}
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-gray-900 mt-3 capitalize">{subject.name}</h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Class {user?.className} • {chapterCount} chapter{chapterCount !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <BookOpen size={12}/> {subScores.length} quizzes
                    </span>
                    {subAvg !== null && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${subAvg >= 70 ? 'bg-green-100 text-green-700' : subAvg >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {subAvg}% avg
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Scores */}
      {scores.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button onClick={() => navigate('/scores')} className="text-sm text-indigo-600 font-semibold">View All →</button>
          </div>
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase">Chapter</th>
                  <th className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase hidden sm:table-cell">Subject</th>
                  <th className="text-center px-5 py-3 text-gray-500 font-semibold text-xs uppercase">Score</th>
                  <th className="text-right px-5 py-3 text-gray-500 font-semibold text-xs uppercase hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {scores.slice(0, 5).map(s => {
                  const pct = Math.round((s.score / s.total) * 100);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{s.chapterTitle}</td>
                      <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell capitalize">{s.subjectName}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${pct >= 80 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {s.score}/{s.total} ({pct}%)
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-400 hidden md:table-cell">
                        {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
