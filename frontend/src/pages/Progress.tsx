import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiTrendingUp, FiPlus } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import api from '../lib/api';
import { Progress as ProgressData } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Progress() {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'weight', value: '', unit: 'kg', notes: '' });

  useEffect(() => {
    api.get('/progress').then(res => { setProgress(res.data.data || []); setLoading(false); });
  }, []);

  const addProgress = async () => {
    if (!form.value) return toast.error('Enter a value');
    try {
      const res = await api.post('/progress', { ...form, value: parseFloat(form.value) });
      setProgress(prev => [res.data.data, ...prev]);
      setShowForm(false);
      setForm({ type: 'weight', value: '', unit: 'kg', notes: '' });
      toast.success('Progress recorded!');
    } catch { toast.error('Failed to record'); }
  };

  const weightData = progress
    .filter(p => p.type === 'weight')
    .map(p => ({ date: format(new Date(p.date), 'MMM d'), value: p.value }))
    .reverse();

  const strengthData = progress
    .filter(p => ['bench_press_max', 'squat_max', 'deadlift_max'].includes(p.type))
    .reduce((acc, p) => {
      const date = format(new Date(p.date), 'MMM d');
      const existing = acc.find((d: any) => d.date === date);
      if (existing) existing[p.type] = p.value;
      else acc.push({ date, [p.type]: p.value });
      return acc;
    }, [] as any[])
    .reverse();

  const recentPRs = progress
    .filter(p => p.type.includes('max'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <PageWrapper title="Progress Tracking">
      <div className="flex justify-between items-center mb-6">
        <p className="text-white/50">Track your fitness journey over time</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-1">
          <FiPlus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
          <h3 className="font-semibold text-white mb-4">Record Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
                <option value="weight">Body Weight</option>
                <option value="bench_press_max">Bench Press Max</option>
                <option value="squat_max">Squat Max</option>
                <option value="deadlift_max">Deadlift Max</option>
                <option value="body_fat">Body Fat %</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Value</label>
              <input type="number" step="0.1" placeholder="Value" value={form.value}
                onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Unit</label>
              <input type="text" placeholder="kg" value={form.unit}
                onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="input-field" />
            </div>
            <div className="flex items-end">
              <button onClick={addProgress} className="btn-primary w-full text-sm">Save</button>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Body Weight</h3>
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/30">No data yet</div>
              )}
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Strength Progress</h3>
              {strengthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                    <Legend wrapperStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="bench_press_max" name="Bench" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="squat_max" name="Squat" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="deadlift_max" name="Deadlift" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/30">No data yet</div>
              )}
            </div>
          </div>

          {recentPRs.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Recent Personal Records</h3>
              <div className="space-y-3">
                {recentPRs.map((pr, i) => (
                  <div key={pr.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FiTrendingUp className="w-5 h-5 text-primary-400" />
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{pr.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-white/40">{format(new Date(pr.date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <p className="font-bold text-white">{pr.value} {pr.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
