import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WorkoutTracker from './pages/WorkoutTracker';
import Schedule from './pages/Schedule';
import Timer from './pages/Timer';
import History from './pages/History';
import Progress from './pages/Progress';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>} />
      <Route path="/workouts" element={<ProtectedRoute><Navbar /><WorkoutTracker /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Navbar /><Schedule /></ProtectedRoute>} />
      <Route path="/timer" element={<ProtectedRoute><Navbar /><Timer /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Navbar /><History /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Navbar /><Progress /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Navbar /><Notifications /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute><AdminRoute><Navbar /><AdminDashboard /></AdminRoute></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </Router>
    </AuthProvider>
  );
}
