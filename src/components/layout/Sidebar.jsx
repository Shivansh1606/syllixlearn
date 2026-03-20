//src/components/layout/Sidebar.jsx

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  User,
  X,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile',   icon: User,            label: 'My Profile' },
  { to: '/scores',    icon: BarChart2,        label: 'My Scores'  },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#1e1b4b] z-30 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">
                 Syllix<span className="text-indigo-300">Learn</span>
              </p>
              <p className="text-indigo-400 text-[10px] tracking-widest uppercase mt-0.5">Learn • Grow</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-indigo-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 mt-5 mb-2 bg-indigo-800/40 rounded-2xl p-4 border border-indigo-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-bold text-white text-sm shadow">
              {user?.avatar || 'ST'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name || 'Student'}</p>
              <p className="text-indigo-300 text-xs">Class {user?.classGrade} • {user?.board}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="text-indigo-400 text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold">Menu</p>
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-indigo-200 hover:bg-indigo-800/60 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-indigo-400 group-hover:text-white'} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="text-indigo-200" />}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4">
            {/* <p className="text-indigo-400 text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold">Subjects</p> */}
            {(user?.selectedSubjects || []).length === 0 ? (
              <p className="text-indigo-400 text-xs px-3"></p>
            ) : (
              (user?.selectedSubjects || []).map((subId) => {
                const subjectNames = { 's9_1': '📐 Mathematics', 's9_2': '🔬 Science', 's9_4': '📚 English', 's9_3': '🌍 Social Science', 's9_5': '✍️ Hindi' };
                const label = subjectNames[subId] || `📖 Subject`;
                return (
                  <NavLink
                    key={subId} to={`/subject/${subId}`}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium
                      transition-all duration-200
                      ${isActive ? 'bg-indigo-500 text-white' : 'text-indigo-300 hover:bg-indigo-800/60 hover:text-white'}
                    `}
                  >
                    {label}
                  </NavLink>
                );
              })
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
