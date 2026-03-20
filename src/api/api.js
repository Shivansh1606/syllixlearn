// src/api/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const getToken    = ()      => localStorage.getItem('syllix_token');
export const setToken    = (token) => localStorage.setItem('syllix_token', token);
export const removeToken = ()      => localStorage.removeItem('syllix_token');
export const getUserId   = ()      => localStorage.getItem('syllix_user_id');
export const setUserId   = (id)    => localStorage.setItem('syllix_user_id', String(id));
export const removeUserId = ()     => localStorage.removeItem('syllix_user_id');

async function request(endpoint, options = {}) {
  const token = getToken();
  const { headers: extraHeaders, ...restOptions } = options;

  const config = {
    ...restOptions,
    headers: {
      'Content-Type':               'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch {
    throw new Error('Network error. Check your connection or API URL.');
  }

  if (response.status === 401) {
    removeToken();
    removeUserId();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server error (${response.status}). Please try again.`);
  }

  if (response.status === 422) {
    const msg = data?.detail?.[0]?.msg || 'Validation error. Check your inputs.';
    throw new Error(msg);
  }

  if (response.status === 500) {
    throw new Error('Server error. Please contact support.');
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || `Request failed (${response.status})`);
  }

  if (data?.error) throw new Error(data.error);

  return data;
}

// ─── Auth APIs ────────────────────────────────────────────────
export const authAPI = {
  signup: (payload) => request('/auth/signup', {
    method: 'POST',
    body:   JSON.stringify(payload),
    // { name, phone, password, board_id, class_id, state_id } ← state_id required!
  }),

  login: (payload) => request('/auth/login', {
    method: 'POST',
    body:   JSON.stringify(payload),
    // { phone, password }
  }),
};

// ─── States API ───────────────────────────────────────────────
// NEW: Migration ke baad add hua — state_id ab signup mein required hai
// Response: [{ id, name }]  e.g. [{ id: 1, name: "U.P" }]
export const statesAPI = {
  getAll: () => request('/states/'),
};

// ─── Boards API ───────────────────────────────────────────────
export const boardsAPI = {
  getAll: () => request('/boards/'),
};

// ─── Classes API ──────────────────────────────────────────────
export const classesAPI = {
  getByBoard: (board_id) => request(`/classes/?board_id=${board_id}`),
  getAll:     ()          => request('/classes/'),
};

// ─── Syllabus API ─────────────────────────────────────────────
export const syllabusAPI = {
  getTree: (board_id) => request(`/syllabus/tree?board_id=${board_id}`),
};

// ─── Subjects API ─────────────────────────────────────────────
export const subjectsAPI = {
  getByClass: (class_id) => request(`/subjects/?class_id=${class_id}`),
};

// ─── Chapters API ─────────────────────────────────────────────
export const chaptersAPI = {
  getBySubject: (subject_id) => request(`/chapters/?subject_id=${subject_id}`),
};

// ─── Learning API ─────────────────────────────────────────────
export const learningAPI = {
  getChapter: (chapter_id) => {
    const token = getToken();
    if (!token)      throw new Error('Not authenticated');
    if (!chapter_id) throw new Error('Invalid chapter');
    return request(`/learning/chapter?chapter_id=${chapter_id}&token=${token}`);
  },
};

// ─── Quiz API ─────────────────────────────────────────────────
export const quizAPI = {
  getByChapter: (chapter_id) => {
    const token = getToken();
    if (!token)      throw new Error('Not authenticated');
    if (!chapter_id || chapter_id === 'undefined') {
      throw new Error('Invalid chapter ID');
    }
    return request(`/quiz/chapter?chapter_id=${chapter_id}&token=${token}`);
  },
};

// ─── Users API ────────────────────────────────────────────────
// User object ab: { id, name, phone, board_id, class_id, state_id }
export const usersAPI = {
  getById: (user_id) => {
    if (!user_id) throw new Error('Invalid user ID');
    return request(`/users/${user_id}`);
  },
};

// ─── Quiz Response Parser ─────────────────────────────────────
export const parseQuizResponse = (quizString) => {
  if (!quizString || typeof quizString !== 'string') return [];
  try {
    const match = quizString.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    return parsed.filter(q =>
      q.question && q.a && q.b && q.c && q.d && q.answer
    );
  } catch (err) {
    console.error('Quiz parse error:', err);
    return [];
  }
};
