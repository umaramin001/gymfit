import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSave, FiCamera } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Profile as ProfileType } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profile').then(res => { setProfile(res.data.data || {}); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', profile);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const update = (key: string, value: any) => setProfile(prev => ({ ...prev, [key]: value }));

  return (
    <PageWrapper title="My Profile">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiCamera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
              <p className="text-white/50">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                {user?.role}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"/></div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Age</label>
                  <input type="number" value={profile.age || ''} onChange={e => update('age', parseInt(e.target.value))}
                    className="input-field" placeholder="Age" />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Gender</label>
                  <select value={profile.gender || ''} onChange={e => update('gender', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Height (cm)</label>
                  <input type="number" value={profile.height || ''} onChange={e => update('height', parseFloat(e.target.value))}
                    className="input-field" placeholder="Height" />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1">Weight (kg)</label>
                  <input type="number" value={profile.weight || ''} onChange={e => update('weight', parseFloat(e.target.value))}
                    className="input-field" placeholder="Weight" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Fitness Goal</label>
                <select value={profile.fitnessGoal || ''} onChange={e => update('fitnessGoal', e.target.value)} className="input-field">
                  <option value="">Select goal</option>
                  <option value="Lose Weight">Lose Weight</option>
                  <option value="Build Muscle">Build Muscle</option>
                  <option value="Improve Endurance">Improve Endurance</option>
                  <option value="Increase Strength">Increase Strength</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1">Bio</label>
                <textarea value={profile.bio || ''} onChange={e => update('bio', e.target.value)} className="input-field h-24 resize-none"
                  placeholder="Tell us about yourself..." />
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <FiSave className="w-4 h-4" />}
                Save Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
