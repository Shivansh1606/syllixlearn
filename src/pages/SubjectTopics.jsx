//src/pages/SubjectTopics.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chaptersAPI } from '../api/api';
import toast from 'react-hot-toast';

const ChapterSkeleton = () => (
  <div className="card animate-pulse flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

export default function SubjectTopics() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();
  const { scores }  = useAuth();

  const subject = location.state?.subject;
  const style   = location.state?.style || {
    color: 'from-indigo-500 to-purple-600',
    icon: '📖',
    text: 'text-indigo-600',
  };

  const [chapters, setChapters] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchChapters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chaptersAPI.getBySubject(id);
      // order_index se sort karo
      const sorted = [...data].sort((a, b) => a.order_index - b.order_index);
      setChapters(sorted);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChapters(); }, [id]);

  const doneChapters = new Set(scores.map(s => s.chapterId));

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16}/> Back to Dashboard
      </button>

      {/* Header */}
      <div className={`card bg-gradient-to-r ${style.color} text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl">
            {style.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {subject?.name || 'Subject'}
            </h1>
            <p className="text-white/80 text-sm mt-0.5">
              {loading ? 'Loading...' : `${chapters.length} Chapter${chapters.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <ChapterSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card text-center py-10">
          <p className="text-3xl mb-3">😕</p>
          <p className="font-semibold text-gray-700">Failed to load chapters</p>
          <button onClick={fetchChapters} className="btn-primary mt-4 flex items-center gap-2 mx-auto">
            <RefreshCw size={16}/> Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && chapters.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🚧</p>
          <p className="font-semibold text-gray-700">Chapters Coming Soon!</p>
          <p className="text-gray-400 text-sm mt-1">Content is being added for this subject</p>
        </div>
      )}

      {/* Chapters List */}
      {!loading && !error && chapters.length > 0 && (
        <div className="space-y-3">
          {chapters.map((chapter, i) => {
            const isDone     = doneChapters.has(chapter.id);
            const lastScore  = scores.find(s => s.chapterId === chapter.id);

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/topic/${chapter.id}`, { state: { chapter, subject, style } })}
                className="card cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  {/* Chapter Number / Done Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br ${style.color} shadow`}>
                    {isDone ? <CheckCircle2 size={20}/> : chapter.order_index}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors capitalize">
                        {chapter.title}
                      </h3>
                      {isDone && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                          Done ✓
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <BookOpen size={12}/> AI Explained
                      </span>
                      <span className="text-gray-400 text-xs">Chapter {chapter.order_index}</span>
                      {lastScore && (
                        <span className={`text-xs font-semibold ${Math.round((lastScore.score / lastScore.total) * 100) >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                          Last: {lastScore.score}/{lastScore.total}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
