// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  authAPI, syllabusAPI, usersAPI,
  getToken, setToken, setUserId,
  removeToken, removeUserId, getUserId,
} from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [scores,  setScores]  = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── App Start — Token + Profile + Scores Load ─────────────
  useEffect(() => {
    const init = async () => {
      const token   = getToken();
      const userId  = getUserId();
      const saved   = localStorage.getItem('syllix_user_profile');

      if (token && userId && saved) {
        try {
          const profile = JSON.parse(saved);
          setUser(profile);

          // Agar board/class info missing hai saved profile mein → API se fetch karo
          if (profile.id && (!profile.boardName || !profile.className)) {
            try {
              const apiUser = await usersAPI.getById(profile.id);
              if (apiUser.board_id && apiUser.class_id) {
                const { boardName, className } = await resolveBoardClass(
                  apiUser.board_id,
                  apiUser.class_id
                );
                const enriched = {
                  ...profile,
                  board_id:  apiUser.board_id,
                  class_id:  apiUser.class_id,
                  boardName,
                  className,
                  name:   apiUser.name  || profile.name,
                  phone:  apiUser.phone || profile.phone,
                  avatar: (apiUser.name || profile.name)?.slice(0, 2).toUpperCase(),
                };
                setUser(enriched);
                localStorage.setItem('syllix_user_profile', JSON.stringify(enriched));
              }
            } catch {
              // Silent fail — existing profile use karo
            }
          }
        } catch {
          // Corrupt localStorage — clean karo
          removeToken();
          removeUserId();
          localStorage.removeItem('syllix_user_profile');
        }
      }

      // Scores load karo
      const savedScores = localStorage.getItem('syllix_scores');
      if (savedScores) {
        try { setScores(JSON.parse(savedScores)); } catch { /* ignore */ }
      }

      setLoading(false);
    };

    init();
  }, []);

  // ─── Helper: board_id + class_id → boardName + className ──
  const resolveBoardClass = async (board_id, class_id) => {
    try {
      const tree  = await syllabusAPI.getTree(board_id);
      const board = tree.find(b => b.id === board_id);
      const cls   = board?.classes?.find(c => c.id === class_id);
      return {
        boardName: board?.name || '',
        className: cls?.name   || '',
      };
    } catch {
      return { boardName: '', className: '' };
    }
  };

  // ─── Register ──────────────────────────────────────────────
  // formData: { name, phone, password, board_id, class_id, boardName, className }
  const register = async (formData) => {
    const payload = {
      name:     formData.name.trim(),
      phone:    formData.phone.trim(),
      password: formData.password,
      state_id: parseInt(formData.state_id),
      board_id: parseInt(formData.board_id),
      class_id: parseInt(formData.class_id),
    };

    const data = await authAPI.signup(payload);
    // Response: { token: "...", user_id: 5 }

    const userProfile = {
      id:        data.user_id,
      name:      formData.name.trim(),
      phone:     formData.phone.trim(),
      state_id:  parseInt(formData.state_id),
      board_id:  parseInt(formData.board_id),
      class_id:  parseInt(formData.class_id),
      stateName: formData.stateName,
      boardName: formData.boardName,
      className: formData.className,
      avatar:    formData.name.trim().slice(0, 2).toUpperCase(),
    };

    setToken(data.token);
    setUserId(data.user_id);
    setUser(userProfile);
    localStorage.setItem('syllix_user_profile', JSON.stringify(userProfile));

    return userProfile;
  };

  // ─── Login ─────────────────────────────────────────────────
  // phone + password → JWT → user profile fetch → board/class resolve
  const login = async (phone, password) => {
    // Step 1: Auth API → token + user_id
    const data = await authAPI.login({ phone: phone.trim(), password });
    // Response: { token: "...", user_id: 19 }

    setToken(data.token);
    setUserId(data.user_id);

    // Step 2: Same user already saved? Reuse karo (fast path)
    const saved        = localStorage.getItem('syllix_user_profile');
    const savedProfile = saved ? JSON.parse(saved) : null;

    if (savedProfile && savedProfile.id === data.user_id && savedProfile.boardName) {
      setUser(savedProfile);

      // Scores bhi load karo
      const savedScores = localStorage.getItem('syllix_scores');
      if (savedScores) {
        try { setScores(JSON.parse(savedScores)); } catch { /* ignore */ }
      }

      return savedProfile;
    }

    // Step 3: /users/:id se fresh profile fetch karo
    let apiUser = null;
    try {
      apiUser = await usersAPI.getById(data.user_id);
    } catch {
      // API fail — minimal fallback
      apiUser = {
        id:       data.user_id,
        name:     `Student ${data.user_id}`,
        phone:    phone.trim(),
        board_id: null,
        class_id: null,
      };
    }

    // Step 4: board_id + class_id se boardName + className resolve karo
    let boardName = '', className = '';
    if (apiUser.board_id && apiUser.class_id) {
      const resolved = await resolveBoardClass(apiUser.board_id, apiUser.class_id);
      boardName = resolved.boardName;
      className = resolved.className;
    }

    const userProfile = {
      id:        apiUser.id,
      name:      apiUser.name      || `Student ${data.user_id}`,
      phone:     apiUser.phone     || phone.trim(),
      board_id:  apiUser.board_id  || null,
      class_id:  apiUser.class_id  || null,
      boardName,
      className,
      avatar:    (apiUser.name || `${data.user_id}`)
                   .slice(0, 2)
                   .toUpperCase(),
    };

    setUser(userProfile);
    localStorage.setItem('syllix_user_profile', JSON.stringify(userProfile));

    // Scores load karo
    const savedScores = localStorage.getItem('syllix_scores');
    if (savedScores) {
      try { setScores(JSON.parse(savedScores)); } catch { /* ignore */ }
    }

    return userProfile;
  };

  // ─── Logout ────────────────────────────────────────────────
  const logout = () => {
    removeToken();
    removeUserId();
    setUser(null);
    setScores([]);
    localStorage.removeItem('syllix_user_profile');
    localStorage.removeItem('syllix_scores');
  };

  // ─── Update Profile ────────────────────────────────────────
  // Koi bhi field update karo — state + localStorage dono sync honge
  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('syllix_user_profile', JSON.stringify(updated));
  };

  // ─── Refresh Profile from API ──────────────────────────────
  // Profile page pe manual refresh ke liye
  const refreshProfile = async () => {
    if (!user?.id) return;
    try {
      const apiUser = await usersAPI.getById(user.id);
      const { boardName, className } = await resolveBoardClass(
        apiUser.board_id,
        apiUser.class_id
      );
      updateProfile({
        name:      apiUser.name,
        phone:     apiUser.phone,
        board_id:  apiUser.board_id,
        class_id:  apiUser.class_id,
        boardName,
        className,
        avatar:    apiUser.name?.slice(0, 2).toUpperCase(),
      });
    } catch {
      // Silent fail
    }
  };

  // ─── Save Score ────────────────────────────────────────────
  // Score API nahi hai boss ke backend mein — localStorage use karo
  const saveScore = (scoreData) => {
    const newScore = {
      ...scoreData,
      id:   Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updated = [newScore, ...scores];
    setScores(updated);
    localStorage.setItem('syllix_scores', JSON.stringify(updated));
    return newScore;
  };

  // ─── Clear Scores ──────────────────────────────────────────
  const clearScores = () => {
    setScores([]);
    localStorage.removeItem('syllix_scores');
  };

  return (
    <AuthContext.Provider value={{
      user,
      scores,
      loading,
      register,
      login,
      logout,
      updateProfile,
      refreshProfile,
      saveScore,
      clearScores,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
