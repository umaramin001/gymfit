import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiZap, FiTrendingUp, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { FiDumbbell } from '../components/Icons';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { WorkoutStats, Notification } from '../types';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, loading } = useApi<WorkoutStats>('/workouts/stats');
  const { data: notifications } = useApi<Notification[]>('/notifications');

  const statCards = [
    { icon: FiDumbbell, label: 'Total Workouts', value: stats?.totalWorkouts || 0, color: 'from-primary-500 to-primary-600' },
    { icon: FiActivity, label: 'This Week', value: stats?.weekWorkouts || 0, color: 'from-emerald-500 to-emerald-600' },
    { icon: FiZap, label: 'Calories Burned', value: stats?.totalCalories || 0, color: 'from-orange-500 to-orange-600' },
    { icon: FiClock, label: 'Minutes Trained', value: stats?.totalDuration || 0, color: 'from-blue-500 to-blue-600' },
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <PageWrapper title={`Welcome back, ${user?.name?.split(' ')[0]}!`}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-display font-bold text-white">{s.value.toLocaleString()}</p>
                <p className="text-sm text-white/50">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
                <Link to="/schedule" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  View All <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="text-center py-8">
                <FiCalendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">
                  {days[new Date().getDay()]} - {format(new Date(), 'MMMM d, yyyy')}
                </p>
                <p className="text-white/30 text-sm mt-1">Check your schedule for today's workout plan</p>
                <Link to="/schedule" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                  <FiCalendar className="w-4 h-4" /> View Schedule
                </Link>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/workouts" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500/30">
                    <FiDumbbell className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Log Workout</p>
                    <p className="text-xs text-white/40">Record today's session</p>
                  </div>
                </Link>
                <Link to="/timer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30">
                    <FiClock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Start Timer</p>
                    <p className="text-xs text-white/40">Begin workout timer</p>
                  </div>
                </Link>
                <Link to="/progress" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30">
                    <FiTrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">View Progress</p>
                    <p className="text-xs text-white/40">Check your stats</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Workouts</h2>
              <Link to="/history" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                View History <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {stats?.recentWorkouts && stats.recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentWorkouts.slice(0, 5).map((w, i) => (
                  <motion.div key={w.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                        <FiDumbbell className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{w.name}</p>
                        <p className="text-xs text-white/40">{format(new Date(w.date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">{w.duration || 0} min</p>
                      <p className="text-xs text-white/40">{w.totalCalories || 0} cal</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/30">
                <FiDumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No workouts recorded yet. Start your first workout!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
