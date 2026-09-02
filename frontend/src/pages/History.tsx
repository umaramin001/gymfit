import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiZap, FiCheck } from 'react-icons/fi';
import { FiDumbbell } from '../components/Icons';
import PageWrapper from '../components/PageWrapper';
import api from '../lib/api';
import { Workout } from '../types';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type Period = 'week' | 'month' | 'all';

export default function History() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('week');

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    let startDate: Date | undefined;
    
    if (period === 'week') startDate = startOfWeek(now);
    else if (period === 'month') startDate = startOfMonth(now);

    const params: any = { limit: '50' };
    if (startDate) params.startDate = startDate.toISOString();

    api.get('/workouts', { params }).then(res => {
      setWorkouts(res.data.data?.workouts || []);
      setLoading(false);
    });
  }, [period]);

  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.totalCalories || 0), 0);
  const completedCount = workouts.filter(w => w.status === 'COMPLETED').length;

  return (
    <PageWrapper title="Workout History">
      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
            }`}>
            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <FiDumbbell className="w-6 h-6 text-primary-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{completedCount}</p>
          <p className="text-xs text-white/50">Workouts</p>
        </div>
        <div className="glass-card p-4 text-center">
          <FiClock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalDuration}</p>
          <p className="text-xs text-white/50">Minutes</p>
        </div>
        <div className="glass-card p-4 text-center">
          <FiZap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{totalCalories}</p>
          <p className="text-xs text-white/50">Calories</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : workouts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiDumbbell className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No workouts found for this period</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card p-5 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    w.status === 'COMPLETED' ? 'bg-emerald-500/20' : w.status === 'SKIPPED' ? 'bg-red-500/20' : 'bg-white/10'
                  }`}>
                    {w.status === 'COMPLETED' ? <FiCheck className="w-6 h-6 text-emerald-400" /> : <FiDumbbell className="w-6 h-6 text-white/40" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{w.name}</h3>
                    <p className="text-sm text-white/40">{format(new Date(w.date), 'EEEE, MMM d, yyyy')}</p>
                    {w.exercises && w.exercises.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {w.exercises.map(we => (
                          <span key={we.id} className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-full">
                            {we.exercise.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    w.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                    w.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-white/10 text-white/50'
                  }`}>{w.status}</span>
                  <div className="mt-2 text-sm text-white/50">
                    {w.duration && <p>{w.duration} min</p>}
                    {w.totalCalories && <p>{w.totalCalories} cal</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
