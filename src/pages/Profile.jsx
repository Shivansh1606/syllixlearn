//src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit2, Save, RefreshCw, Phone, User, GraduationCap, School } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subjectsAPI } from '../api/api';
import toast from 'react-hot-toast';

// Subject ke liye color/icon — API mein nahi, frontend pe assign
const SUBJECT_STYLES = [
  { color: 'from-blue-500 to-indigo-600',   icon: '📐', bg: 'from-blue-50 to-indigo-50',   text: 'text-blue-700',   border: 'border-blue-300'   },
  { color: 'from-green-500 to-emerald-600', icon: '🔬', bg: 'from-green-50 to-emerald-50', text: 'text-green-700',  border: 'border-green-300'  },
  { color: 'from-purple-500 to-violet-600', icon: '📚', bg: 'from-purple-50 to-violet-50', text: 'text-purple-700', border: 'border-purple-300' },
  { color: 'from-orange-500 to-amber-600',  icon: '🌍', bg: 'from-orange-50 to-amber-50',  text: 'text-orange-700', border: 'border-orange-300' },
  { color: 'from-red-500 to-rose-600',      icon: '✍️', bg: 'from-red-50 to-rose-50',      text: 'text-red-700',    border: 'border-red-300'    },
  { color: 'from-teal-500 to-cyan-600',     icon: '🧪', bg: 'from-teal-50 to-cyan-50',     text: 'text-teal-700',   border: 'border-teal-300'   },
];
const getStyle = (i) => SUBJECT_STYLES[i % SUBJECT_STYLES.length];

export default function Profile() {
  const { user, updateProfile, refreshProfile } = useAuth();

  // ── Edit form state ──────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Subjects state ───────────────────────────────────────
  const [subjects,        setSubjects]        = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectError,    setSubjectError]    = useState(null);
  const [selected,        setSelected]        = useState(user?.selectedSubjects || []);

  // ── Refresh loading state ────────────────────────────────
  const [syncing, setSyncing] = useState(false);

  // ── Fetch subjects when class_id available ───────────────
  // 📡 API CALL 1: GET /subjects/?class_id={class_id}
  const fetchSubjects = async () => {
    if (!user?.class_id) return;
    setLoadingSubjects(true);
    setSubjectError(null);
    try {
      const data = await subjectsAPI.getByClass(user.class_id);
      setSubjects(data);
    } catch (err) {
      setSubjectError(err.message);
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user?.class_id]);

  // Sync selected subjects with user profile
  useEffect(() => {
    setSelected(user?.selectedSubjects || []);
  }, [user?.selectedSubjects]);

  // ── Subject toggle ───────────────────────────────────────
  const toggleSubject = (id) => {
    const updated = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    setSelected(updated);
    updateProfile({ selectedSubjects: updated });
    toast.success(selected.includes(id) ? 'Subject removed' : 'Subject added!');
  };

  // ── Save profile edits ───────────────────────────────────
  // Note: Boss ke API mein PUT /users/:id endpoint nahi hai abhi
  // → sirf localStorage mein save hoga (AuthContext.updateProfile)
  const saveProfile = () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return; }
    if (!/^\d{10}$/.test(form.phone)) { toast.error('Enter valid 10-digit phone'); return; }
    updateProfile({
      name:   form.name.trim(),
      phone:  form.phone.trim(),
      avatar: form.name.trim().slice(0, 2).toUpperCase(),
    });
    toast.success('Profile updated!');
    setEditing(false);
  };

  const cancelEdit = () => {
    setForm({ name: user?.name || '', phone: user?.phone || '' });
    setEditing(false);
  };

  // ── Sync from API ────────────────────────────────────────
  // 📡 API CALL 2: GET /users/{user_id} (via AuthContext.refreshProfile)
  // 📡 API CALL 3: GET /syllabus/tree?board_id= (via resolveBoardClass in AuthContext)
  const handleSync = async () => {
    setSyncing(true);
    try {
      await refreshProfile();
      toast.success('Profile synced!');
    } catch {
      toast.error('Sync failed. Try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {/* Sync Button — API se fresh data pull karta hai */}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Profile'}
        </button>
      </div>

      {/* ── Profile Card ────────────────────────────────── */}
      <div className="card">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg select-none">
              {user?.avatar || '??'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">+91 {user?.phone}</p>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {user?.boardName && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {user.boardName}
                  </span>
                )}
                {user?.className && (
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Class {user.className}
                  </span>
                )}
                {!user?.boardName && !user?.className && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ⚠️ Board/Class not set
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit / Save button */}
          <div className="flex gap-2">
            {editing && (
              <button onClick={cancelEdit} className="btn-secondary py-2 text-sm">
                Cancel
              </button>
            )}
            <button
              onClick={() => editing ? saveProfile() : setEditing(true)}
              className={`flex items-center gap-2 py-2 text-sm ${editing ? 'btn-primary' : 'btn-secondary'}`}
            >
              {editing ? <><Save size={15}/> Save</> : <><Edit2 size={15}/> Edit</>}
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Editable: Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <User size={11}/> Full Name
            </label>
            <input
              type="text"
              value={editing ? form.name : user?.name || ''}
              readOnly={!editing}
              onChange={e => set('name', e.target.value)}
              className={`input-field text-sm ${!editing ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Editable: Phone */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <Phone size={11}/> Phone Number
            </label>
            <div className="relative">
              {editing && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+91</span>
              )}
              <input
                type="tel"
                maxLength={10}
                value={editing ? form.phone : `+91 ${user?.phone || ''}`}
                readOnly={!editing}
                onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                className={`input-field text-sm ${editing ? 'pl-12' : ''} ${!editing ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {/* Read-only: Board */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <School size={11}/> Board
            </label>
            <input
              value={user?.boardName || 'Not set — use Sync Profile'}
              readOnly
              className="input-field text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Read-only: Class */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <GraduationCap size={11}/> Class
            </label>
            <input
              value={user?.className ? `Class ${user.className}` : 'Not set — use Sync Profile'}
              readOnly
              className="input-field text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

        </div>

        {/* Note about board/class */}
        <p className="text-xs text-gray-400 mt-3">
          📌 Board & Class are set during registration. Use <strong>Sync Profile</strong> to refresh from server.
        </p>
      </div>

      {/* ── Subject Selection ────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">My Subjects</h3>
            <p className="text-gray-500 text-sm mt-0.5">
              {user?.boardName && user?.className
                ? `Class ${user.className} • ${user.boardName} • ${selected.length} selected`
                : 'Complete profile to see subjects'}
            </p>
          </div>
          {subjectError && (
            <button
              onClick={fetchSubjects}
              className="text-xs text-indigo-600 flex items-center gap-1 hover:text-indigo-700"
            >
              <RefreshCw size={13}/> Retry
            </button>
          )}
        </div>

        {/* No class_id */}
        {!user?.class_id && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-yellow-700 text-sm font-medium">⚠️ Class not set in your profile</p>
            <p className="text-yellow-600 text-xs mt-1">
              Use <strong>Sync Profile</strong> button above to fetch your class details from server.
            </p>
          </div>
        )}

        {/* Loading */}
        {user?.class_id && loadingSubjects && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {user?.class_id && !loadingSubjects && subjectError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 text-sm">{subjectError}</p>
          </div>
        )}

        {/* Empty */}
        {user?.class_id && !loadingSubjects && !subjectError && subjects.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">No subjects added for your class yet</p>
          </div>
        )}

        {/* Subjects Grid */}
        {/* 📡 Data from: GET /subjects/?class_id={user.class_id} */}
        {user?.class_id && !loadingSubjects && !subjectError && subjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((subject, i) => {
              const style      = getStyle(i);
              const isSelected = selected.includes(subject.id);

              return (
                <motion.button
                  key={subject.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleSubject(subject.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left w-full
                    ${isSelected
                      ? `${style.border} bg-gradient-to-r ${style.bg}`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center text-xl shadow flex-shrink-0`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm capitalize ${isSelected ? style.text : 'text-gray-700'}`}>
                      {subject.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">Class {user?.className}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${isSelected
                      ? `bg-gradient-to-br ${style.color} border-transparent`
                      : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white" strokeWidth={3}/>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Danger Zone ──────────────────────────────────── */}
      <div className="card border border-red-100">
        <h3 className="font-bold text-gray-900 mb-1">Account Info</h3>
        <p className="text-gray-400 text-sm mb-4">User ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{user?.id}</code></p>
        <p className="text-xs text-gray-400">
          Board and Class changes require re-registration. Contact support if needed.
        </p>
      </div>
    </div>
  );
}
