import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { HiMenu, HiX, HiBell, HiUser, HiLogout, HiCog } from 'react-icons/hi';
import { FiHome, FiCalendar, FiClock, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { FiDumbbell } from './Icons';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/workouts', label: 'Workouts', icon: FiDumbbell },
  { path: '/schedule', label: 'Schedule', icon: FiCalendar },
  { path: '/timer', label: 'Timer', icon: FiClock },
  { path: '/history', label: 'History', icon: FiActivity },
  { path: '/progress', label: 'Progress', icon: FiBarChart2 },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <FiDumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">GYMFIT</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === path ? 'bg-primary-500/20 text-primary-400' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link to="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname.startsWith('/admin') ? 'bg-yellow-500/20 text-yellow-400' : 'text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-500/10'
                }`}>
                <HiCog className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative p-2 text-white/60 hover:text-white transition-colors">
              <HiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"/>
            </Link>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 glass-card p-2 shadow-xl">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-white/50">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 rounded-lg">
                      <HiUser className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
                      <HiLogout className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white/60">
              {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
            <div className="p-4 space-y-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === path ? 'bg-primary-500/20 text-primary-400' : 'text-white/60 hover:bg-white/5'
                  }`}>
                  <Icon className="w-5 h-5" /> {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
