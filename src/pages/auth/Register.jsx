// src/pages/auth/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { statesAPI, boardsAPI, classesAPI } from '../../api/api';
import toast from 'react-hot-toast';

const STEPS = ['Personal Info', 'Location & Board', 'Password'];

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  // ── API Data ───────────────────────────────────────────────
  const [states,  setStates]  = useState([]);
  const [boards,  setBoards]  = useState([]);
  const [classes, setClasses] = useState([]);

  const [loadingStates,  setLoadingStates]  = useState(false);
  const [loadingBoards,  setLoadingBoards]  = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // ── Form ───────────────────────────────────────────────────
  const [step,     setStep]     = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '',
    state_id: '', stateName: '',
    board_id: '', boardName: '',
    class_id: '', className: '',
    password: '', confirmPassword: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Step 2 pe aate hi states fetch ────────────────────────
  useEffect(() => {
    if (step !== 1) return;
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const data = await statesAPI.getAll();
        setStates(data);
      } catch {
        toast.error('Failed to load states.');
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, [step]);

  // ── State select → boards fetch ────────────────────────────
  useEffect(() => {
    if (!form.state_id) { setBoards([]); return; }

    // Board/Class reset karo jab state change ho
    set('board_id', ''); set('boardName', '');
    set('class_id', ''); set('className', '');
    setClasses([]);

    const fetchBoards = async () => {
      setLoadingBoards(true);
      try {
        const data = await boardsAPI.getAll();
        // Test data filter karo
        setBoards(data.filter(b => b.name && b.name !== 'string'));
      } catch {
        toast.error('Failed to load boards.');
      } finally {
        setLoadingBoards(false);
      }
    };
    fetchBoards();
  }, [form.state_id]);

  // ── Board select → classes fetch ───────────────────────────
  useEffect(() => {
    if (!form.board_id) { setClasses([]); return; }

    set('class_id', ''); set('className', '');

    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const data = await classesAPI.getByBoard(form.board_id);
        setClasses(data);
      } catch {
        toast.error('Failed to load classes.');
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, [form.board_id]);

  // ── Validation ─────────────────────────────────────────────
  const validate = () => {
    if (step === 0) {
      if (!form.name.trim())             { toast.error('Name is required');               return false; }
      if (!/^\d{10}$/.test(form.phone))  { toast.error('Enter valid 10-digit phone');     return false; }
    }
    if (step === 1) {
      if (!form.state_id) { toast.error('Select your state');  return false; }
      if (!form.board_id) { toast.error('Select your board');  return false; }
      if (!form.class_id) { toast.error('Select your class');  return false; }
    }
    if (step === 2) {
      if (form.password.length < 6)              { toast.error('Password must be at least 6 characters'); return false; }
      if (form.password !== form.confirmPassword) { toast.error('Passwords do not match');                 return false; }
    }
    return true;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name:      form.name,
        phone:     form.phone,
        password:  form.password,
        state_id:  parseInt(form.state_id),  
        board_id:  parseInt(form.board_id),
        class_id:  parseInt(form.class_id),
        stateName: form.stateName,
        boardName: form.boardName,
        className: form.className,
      });
      toast.success('Account created! Welcome to Syllix Learn 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Reusable Option Button ─────────────────────────────────
  const OptionBtn = ({ selected, onClick, children, wide = false }) => (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all text-left
        ${wide ? 'col-span-2' : ''}
        ${selected
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
          : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
        }`}
    >
      {children}
    </button>
  );

  const Spinner = ({ text = 'Loading...' }) => (
    <div className="input-field flex items-center gap-2 text-gray-400">
      <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
      {text}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-2xl">
              Syllix<span className="text-indigo-300"> Learn</span>
            </span>
          </div>
          <p className="text-indigo-300 text-sm">Create your free learning account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="flex">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 transition-all duration-500
                  ${i <= step ? 'bg-indigo-600' : 'bg-gray-100'}
                  ${i !== 0 ? 'ml-0.5' : ''}`}
              />
            ))}
          </div>

          <div className="p-8">
            <div className="mb-6">
              <p className="text-xs text-indigo-500 font-semibold uppercase tracking-widest">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{STEPS[step]}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Step 0: Personal Info ─────────────────── */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Arjun Sharma"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                      <input
                        className="input-field pl-12"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={form.phone}
                        onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Location & Board ──────────────── */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">

                  {/* State Select */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Select State
                    </label>
                    {loadingStates ? <Spinner text="Loading states..." /> : (
                      <div className="grid grid-cols-2 gap-2">
                        {states.map(state => (
                          <OptionBtn
                            key={state.id}
                            selected={form.state_id === state.id}
                            onClick={() => { set('state_id', state.id); set('stateName', state.name); }}
                          >
                             {state.name}
                          </OptionBtn>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Board Select — state select hone ke baad */}
                  {form.state_id && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Select Board
                      </label>
                      {loadingBoards ? <Spinner text="Loading boards..." /> : boards.length === 0 ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-sm">
                          No boards available for this state yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {boards.map(board => (
                            <OptionBtn
                              key={board.id}
                              selected={form.board_id === board.id}
                              onClick={() => { set('board_id', board.id); set('boardName', board.name); }}
                            >
                              {board.name}
                            </OptionBtn>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Class Select — board select hone ke baad */}
                  {form.board_id && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Select Class
                      </label>
                      {loadingClasses ? <Spinner text="Loading classes..." /> : classes.length === 0 ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-sm">
                          No classes available for this board yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {classes.map(cls => (
                            <OptionBtn
                              key={cls.id}
                              selected={form.class_id === cls.id}
                              onClick={() => { set('class_id', cls.id); set('className', cls.name); }}
                            >
                              {cls.name}
                            </OptionBtn>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── Step 2: Password ──────────────────────── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  {/* Summary Card */}
                  <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {form.name.slice(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{form.name}</p>
                      <p className="text-indigo-600 text-xs">
                        {form.stateName} • {form.boardName} • Class {form.className}
                      </p>
                      <p className="text-gray-400 text-xs">+91 {form.phone}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Set Password</label>
                    <div className="relative">
                      <input
                        className="input-field pr-10"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        value={form.password}
                        onChange={e => set('password', e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Confirm Password</label>
                    <input
                      className="input-field"
                      type="password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={e => set('confirmPassword', e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">
                    ← Back
                  </button>
                )}
                {step < 2 ? (
                  <button type="button" onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    Next <ArrowRight size={16}/>
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Creating...</>
                      : 'Create Account '
                    }
                  </button>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
