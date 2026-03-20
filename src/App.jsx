//src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout        from './components/layout/Layout';
import Landing       from './pages/Landing';
import Register      from './pages/auth/Register';
import Login         from './pages/auth/Login';
import Dashboard     from './pages/Dashboard';
import Profile       from './pages/Profile';
import SubjectTopics from './pages/SubjectTopics';
import TopicDetail   from './pages/TopicDetail';
import Quiz          from './pages/Quiz';
import QuizResult    from './pages/QuizResult';
import Scores        from './pages/Scores';

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

const Public = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"         element={<Public><Landing /></Public>} />
      <Route path="/register" element={<Public><Register /></Public>} />
      <Route path="/login"    element={<Public><Login /></Public>} />

      {/* Protected Routes */}
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/subject/:id"    element={<SubjectTopics />} />
        <Route path="/topic/:id"      element={<TopicDetail />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/quiz-result"    element={<QuizResult />} />
        <Route path="/scores"         element={<Scores />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter', fontSize: '14px' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
