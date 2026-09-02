import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiShield, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { FiDumbbell } from '../components/Icons';
import PageWrapper from '../components/PageWrapper';
import api from '../lib/api';
import { AdminDashboard as AdminData, User, Exercise } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'users' | 'exercises';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<AdminData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
      api.get('/admin/exercises'),
    ]).then(([dashRes, usersRes, exRes]) => {
      setData(dashRes.data.data);
      setUsers(usersRes.data.data || []);
      setExercises(exRes.data.data || []);
      setLoading(false);
    });
  }, []);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !isActive } : u));
      toast.success('User updated');
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const deleteExercise = async (id: string) => {
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(prev => prev.filter(e => e.id !== id));
      toast.success('Exercise deleted');
    } catch { toast.error('Failed'); }
  };

  const statCards = [
    { icon: FiUsers, label: 'Total Users', value: data?.totalUsers || 0, color: 'from-primary-500 to-primary-600' },
    { icon: FiActivity, label: 'Active Users', value: data?.activeUsers || 0, color: 'from-emerald-500 to-emerald-600' },
    { icon: FiDumbbell, label: 'Total Workouts', value: data?.totalWorkouts || 0, color: 'from-blue-500 to-blue-600' },
    { icon: FiShield, label: 'Exercises', value: data?.totalExercises || 0, color: 'from-orange-500 to-orange-600' },
  ];

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: FiActivity },
    { key: 'users', label: 'Users', icon: FiUsers },
    { key: 'exercises', label: 'Exercises', icon: FiDumbbell },
  ];

  return (
    <PageWrapper title="Admin Dashboard">
      <div className="flex gap-2 mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === key ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <>
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass-card p-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-sm text-white/50">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-white mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {data?.recentUsers.slice(0, 5).map((u: any) => (
                      <div key={u.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{u.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{u.name}</p>
                            <p className="text-xs text-white/40">{u.email}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/50'}`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-semibold text-white mb-4">Recent Workouts</h3>
                  <div className="space-y-3">
                    {data?.recentWorkouts.slice(0, 5).map((w: any) => (
                      <div key={w.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-white">{w.name}</p>
                          <p className="text-xs text-white/40">{w.user?.name} - {format(new Date(w.date), 'MMM d')}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          w.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'
                        }`}>{w.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm font-medium text-white/50">User</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Joined</th>
                      <th className="text-right p-4 text-sm font-medium text-white/50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{u.name?.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{u.name}</p>
                              <p className="text-xs text-white/40">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/50'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-white/40">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => toggleUserStatus(u.id, u.isActive ?? false)}
                              className="p-1 text-white/40 hover:text-white transition-colors">
                              {u.isActive ? <FiX className="w-4 h-4" /> : <FiCheck className="w-4 h-4" />}
                            </button>
                            <button onClick={() => deleteUser(u.id)} className="p-1 text-red-400/40 hover:text-red-400 transition-colors">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'exercises' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm font-medium text-white/50">Exercise</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Category</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Muscle Group</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Difficulty</th>
                      <th className="text-right p-4 text-sm font-medium text-white/50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.map(e => (
                      <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <p className="text-sm font-medium text-white">{e.name}</p>
                          {e.description && <p className="text-xs text-white/40">{e.description}</p>}
                        </td>
                        <td className="p-4 text-sm text-white/50">{e.category}</td>
                        <td className="p-4 text-sm text-white/50">{e.muscleGroup}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            e.difficulty === 'ADVANCED' ? 'bg-red-500/20 text-red-400' :
                            e.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>{e.difficulty}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteExercise(e.id)} className="p-1 text-red-400/40 hover:text-red-400 transition-colors">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
