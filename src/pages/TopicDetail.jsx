//src/pages/TopicDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Brain, Lightbulb, BookOpenCheck } from 'lucide-react';
import { learningAPI } from '../api/api';
import toast from 'react-hot-toast';

const SectionCard = ({ icon, title, text, delay = 0 }) => {

  if (!text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
        {text}
      </p>
    </motion.div>
  );
};

export default function TopicDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const chapter = location.state?.chapter;
  const subject = location.state?.subject;
  const style = location.state?.style || {
    color: 'from-indigo-500 to-purple-600',
    icon: '📖'
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      // const res = await learningAPI.getChapter(id);

      // ⭐ SAFE UNWRAP (handles all api shapes)
      // const payload =
      //   res?.learning_content
      //     ? res
      //     : res?.data?.learning_content
      //     ? res.data
      //     : res?.result?.learning_content
      //     ? res.result
      //     : res;

      // setData(payload);

      const res = await learningAPI.getChapter(id);
      const payload =
        res?.content?.learning_content
          ? {
              title: res.chapter,
              learning_content: res.content.learning_content
            }
          : res?.learning_content
          ? res
          : res?.data?.learning_content
          ? res.data
          : res;

      setData(payload);

    } catch (e) {
      toast.error("Failed to load chapter");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-400">
        Loading chapter...
      </div>
    );
  }

  const content = data?.learning_content;

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-semibold text-gray-700">Content not available yet</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 text-indigo-600 text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 flex items-center gap-1"
      >
        <ArrowLeft size={16}/> Back
      </button>

      {/* HERO */}
      <div className={`rounded-3xl p-6 text-white bg-gradient-to-r ${style.color}`}>
        <div className="flex items-center gap-4">
          <div className="text-3xl">{style.icon}</div>

          <div>
            <p className="text-white/70 text-xs uppercase">
              {subject?.name}
            </p>

            <h1 className="text-2xl font-bold">
              {data?.title || chapter?.title}
            </h1>

            <p className="text-white/80 text-sm mt-1">
              AI Concept Learning • 8 min read
            </p>
          </div>
        </div>
      </div>

      {/* WHAT */}
      <SectionCard
        icon={<BookOpenCheck className="text-indigo-600" size={20}/>}
        title="What is this concept?"
        text={content.what}
        delay={0.1}
      />

      {/* WHY */}
      <SectionCard
        icon={<Lightbulb className="text-yellow-500" size={20}/>}
        title="Why is it important?"
        text={content.why}
        delay={0.2}
      />

      {/* WHEN */}
      <SectionCard
        icon={<Brain className="text-pink-500" size={20}/>}
        title="When do we use it?"
        text={content.when}
        delay={0.3}
      />

      {/* HOW */}
      <SectionCard
        icon={<Zap className="text-green-500" size={20}/>}
        title="How does it work?"
        text={content.how}
        delay={0.4}
      />

      {/* EXAMPLE */}
      {content.example && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6"
        >
          <h3 className="font-bold text-indigo-700 mb-2">
            Real Life Example 🎯
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {content.example}
          </p>
        </motion.div>
      )}

      {/* MEMORY */}
      {content.memory_trick && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-purple-50 border border-purple-100 rounded-2xl p-6"
        >
          <h3 className="font-bold text-purple-700 mb-2">
            Memory Trick 🧠
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {content.memory_trick}
          </p>
        </motion.div>
      )}

      {/* SUMMARY */}
      {content.summary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-green-50 border border-green-100 rounded-2xl p-6"
        >
          <h3 className="font-bold text-green-700 mb-2">
            Quick Summary ⚡
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {content.summary}
          </p>
        </motion.div>
      )}

      {/* QUIZ CTA */}
      {content.quiz?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 text-center"
        >
          <h3 className="text-lg font-bold">
            Ready to Test Yourself?
          </h3>

          <p className="text-white/80 text-sm mt-1 mb-4">
            Take quiz and unlock next concept
          </p>

          <button
            onClick={() => navigate(`/quiz/${id}`, { state: { chapter, subject, style } })}
            className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50"
          >
            Start Quiz 🚀
          </button>
        </motion.div>
      )}

    </div>
  );
}