//src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATIONS = [
  { id: 1, text: 'New topic added in Mathematics!', time: '2m ago',  icon: '📐', unread: true },
  { id: 2, text: 'You scored 80% in Polynomials',   time: '1h ago',  icon: '🎉', unread: true },
  { id: 3, text: 'Complete today\'s Science quiz',   time: '3h ago',  icon: '🔬', unread: false },
];

export default function Navbar({ onMenuClick }) {
  const { user }                          = useAuth();
  const [notifOpen, setNotifOpen]         = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const unreadCount                       = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-10">

      {/* LEFT — Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6"  x2="17" y2="6"  />
          <line x1="3" y1="12" x2="17" y2="12" />
          <line x1="3" y1="18" x2="17" y2="18" />
        </svg>
      </button>

      {/* CENTER — Search Bar */}
      <div className="flex-1 flex justify-center px-2 lg:px-8">
        <motion.div
          animate={{ width: searchFocused ? '100%' : '440px' }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg"
        >
          <Search
            size={16}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-indigo-500' : 'text-gray-400'}`}
          />
          <input
            type="text"
            placeholder="Search topics, subjects, quizzes..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 border-2 placeholder-gray-400 text-gray-700 outline-none transition-all duration-200
              ${searchFocused
                ? 'border-indigo-400 bg-white shadow-lg shadow-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          />
          {searchFocused && (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono hidden sm:block">
              ESC
            </kbd>
          )}
        </motion.div>
      </div>

      {/* RIGHT — Streak + Bell + User */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Streak Badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-xl select-none">
          🔥 <span>7 Day Streak</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">Notifications</p>
                    <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-indigo-50/50' : ''}`}>
                        <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${n.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{n.text}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                    <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 w-full text-center">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-gray-200 ml-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow flex-shrink-0">
            {user?.avatar || 'ST'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name?.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 mt-0.5">Class {user?.classGrade} • {user?.board}</p>
          </div>
        </div>

      </div>
    </header>
  );
}
