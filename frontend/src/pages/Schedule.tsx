import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { WorkoutSchedule } from '../types';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Schedule() {
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ dayOfWeek: 0, name: '', description: '', startTime: '07:00', duration: 60 });

  useEffect(() => {
    api.get('/schedules').then(res => { setSchedules(res.data.data || []); setLoading(false); });
  }, []);

  const saveSchedule = async () => {
    if (!form.name.trim()) return toast.error('Enter a name');
    try {
      if (editId) {
        await api.put(`/schedules/${editId}`, form);
        setSchedules(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
        toast.success('Schedule updated');
      } else {
        const res = await api.post('/schedules', form);
        setSchedules(prev => [...prev, res.data.data].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
        toast.success('Schedule created');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ dayOfWeek: 0, name: '', description: '', startTime: '07:00', duration: 60 });
    } catch { toast.error('Failed to save'); }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (schedule: WorkoutSchedule) => {
    try {
      await api.put(`/schedules/${schedule.id}`, { isActive: !schedule.isActive });
      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, isActive: !s.isActive } : s));
    } catch { toast.error('Failed to update'); }
  };

  const startEdit = (s: WorkoutSchedule) => {
    setForm({ dayOfWeek: s.dayOfWeek, name: s.name, description: s.description || '', startTime: s.startTime || '07:00', duration: s.duration || 60 });
    setEditId(s.id);
    setShowForm(true);
  };

  const usedDays = schedules.map(s => s.dayOfWeek);
  const availableDays = dayNames.map((name, i) => ({ name, index: i })).filter(d => !usedDays.includes(d.index) || editId);

  return (
    <PageWrapper title="Workout Schedule">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-white/50">Plan your weekly workout routine</p>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ dayOfWeek: 0, name: '', description: '', startTime: '07:00', duration: 60 }); }}
          className="btn-primary text-sm flex items-center gap-1">
          <FiPlus className="w-4 h-4" /> Add Day
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 mb-6">
            <h3 className="font-semibold text-white mb-4">{editId ? 'Edit Schedule' : 'Add Schedule'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1">Day</label>
                <select value={form.dayOfWeek} onChange={e => setForm(p => ({ ...p, dayOfWeek: parseInt(e.target.value) }))} className="input-field">
                  {availableDays.map(d => <option key={d.index} value={d.index}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Name</label>
                <input type="text" placeholder="e.g., Chest Day" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Duration (min)</label>
                <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) }))} className="input-field" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-white/50 mb-1">Description</label>
              <input type="text" placeholder="Optional description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveSchedule} className="btn-primary text-sm">{editId ? 'Update' : 'Create'}</button>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="btn-ghost text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="grid gap-4">
          {dayNames.map((day, i) => {
            const schedule = schedules.find(s => s.dayOfWeek === i);
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 flex items-center justify-between ${!schedule ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                    schedule ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/30'
                  }`}>
                    {dayAbbr[i]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{schedule?.name || 'Rest Day'}</p>
                    {schedule && (
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {schedule.startTime}</span>
                        <span>{schedule.duration} min</span>
                        {schedule.description && <span>{schedule.description}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {schedule && (
                    <>
                      <button onClick={() => toggleActive(schedule)} className={`text-xs px-2 py-1 rounded-full ${
                        schedule.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                      }`}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => startEdit(schedule)} className="p-2 text-white/40 hover:text-white transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteSchedule(schedule.id)} className="p-2 text-red-400/40 hover:text-red-400 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
