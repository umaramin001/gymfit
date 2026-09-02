import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { FiDumbbell } from '../components/Icons';
import api from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('If account exists, reset link sent');
    } catch { setSent(true); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiDumbbell className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Reset Password</h1>
            <p className="text-white/50 text-sm mt-1">Enter your email to reset password</p>
          </div>
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8 text-primary-400" />
              </div>
              <p className="text-white/70 mb-6">If an account exists with that email, a reset link has been sent.</p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field pl-10" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          {!sent && (
            <p className="text-center text-sm text-white/50 mt-6">
              <Link to="/login" className="text-primary-400 hover:text-primary-300 inline-flex items-center gap-1">
                <FiArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
