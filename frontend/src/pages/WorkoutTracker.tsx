import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { FiDumbbell } from '../components/Icons';
import PageWrapper from '../components/PageWrapper';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Exercise, Workout, WorkoutExercise } from '../types';
import { format } from 'date-fns';

export default function WorkoutTracker() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [exerciseForm, setExerciseForm] = useState({ weight: '', reps: '', sets: '3', duration: '' });

  useEffect(() => {
    Promise.all([
      api.get('/exercises'),
      api.get('/workouts'),
    ]).then(([exRes, wRes]) => {
      setExercises(exRes.data.data);
      setWorkouts(wRes.data.data?.workouts || []);
      setLoading(false);
    });
  }, []);

  const createWorkout = async () => {
    if (!newWorkoutName.trim()) return toast.error('Enter workout name');
    try {
      const res = await api.post('/workouts', { name: newWorkoutName });
      const workout = { ...res.data.data, exercises: [] };
      setCurrentWorkout(workout);
      setWorkouts(prev => [workout, ...prev]);
      setShowNewWorkout(false);
      setNewWorkoutName('');
      toast.success('Workout created!');
    } catch { toast.error('Failed to create workout'); }
  };

  const addExercise = async () => {
    if (!currentWorkout || !selectedExercise) return toast.error('Select an exercise');
    const sets = [];
    const numSets = parseInt(exerciseForm.sets) || 3;
    for (let i = 0; i < numSets; i++) {
      sets.push({
        reps: exerciseForm.reps ? parseInt(exerciseForm.reps) : undefined,
        weight: exerciseForm.weight ? parseFloat(exerciseForm.weight) : undefined,
        duration: exerciseForm.duration ? parseInt(exerciseForm.duration) : undefined,
        isCompleted: false,
      });
    }
    try {
      const res = await api.post(`/workouts/${currentWorkout.id}/exercises`, {
        exerciseId: selectedExercise, sets,
      });
      setCurrentWorkout(prev => prev ? { ...prev, exercises: [...prev.exercises, res.data.data] } : null);
      setSelectedExercise('');
      setExerciseForm({ weight: '', reps: '', sets: '3', duration: '' });
      toast.success('Exercise added!');
    } catch { toast.error('Failed to add exercise'); }
  };

  const completeWorkout = async () => {
    if (!currentWorkout) return;
    try {
      await api.put(`/workouts/${currentWorkout.id}`, { status: 'COMPLETED' });
      setCurrentWorkout(null);
      setWorkouts(prev => prev.map(w => w.id === currentWorkout.id ? { ...w, status: 'COMPLETED' } : w));
      toast.success('Workout completed!');
    } catch { toast.error('Failed to complete workout'); }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(prev => prev.filter(w => w.id !== id));
      if (currentWorkout?.id === id) setCurrentWorkout(null);
      toast.success('Workout deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const exerciseOptions = exercises.filter(e => !currentWorkout?.exercises.some(we => we.exerciseId === e.id));
  const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))];

  return (
    <PageWrapper title="Workout Tracker">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {currentWorkout ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{currentWorkout.name}</h2>
                  <p className="text-sm text-white/50">{format(new Date(currentWorkout.date), 'MMM d, yyyy')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={completeWorkout} className="btn-primary text-sm flex items-center gap-1">
                    <FiCheck className="w-4 h-4" /> Complete
                  </button>
                  <button onClick={() => setCurrentWorkout(null)} className="btn-ghost text-sm text-red-400">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium text-white/70 mb-3">Add Exercise</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)} className="input-field text-sm">
                    <option value="">Select exercise</option>
                    {muscleGroups.map(group => (
                      <optgroup key={group} label={group}>
                        {exerciseOptions.filter(e => e.muscleGroup === group).map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <input type="number" placeholder="Weight (kg)" value={exerciseForm.weight}
                    onChange={e => setExerciseForm(p => ({ ...p, weight: e.target.value }))} className="input-field text-sm" />
                  <input type="number" placeholder="Reps" value={exerciseForm.reps}
                    onChange={e => setExerciseForm(p => ({ ...p, reps: e.target.value }))} className="input-field text-sm" />
                  <input type="number" placeholder="Sets" value={exerciseForm.sets}
                    onChange={e => setExerciseForm(p => ({ ...p, sets: e.target.value }))} className="input-field text-sm" />
                </div>
                <button onClick={addExercise} className="btn-primary text-sm mt-3 flex items-center gap-1">
                  <FiPlus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-3">
                {currentWorkout.exercises.map((we) => (
                  <div key={we.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{we.exercise.name}</h4>
                      <span className="text-xs text-white/40">{we.sets.length} sets</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-white/50">
                      <div className="font-medium">Set</div>
                      <div className="font-medium">Weight</div>
                      <div className="font-medium">Reps</div>
                      <div className="font-medium">Done</div>
                      {we.sets.map((s) => (
                        <Fragment key={s.id}>
                          <div>{s.setNumber}</div>
                          <div>{s.weight || '-'} kg</div>
                          <div>{s.reps || '-'}</div>
                          <div className={s.isCompleted ? 'text-emerald-400' : 'text-white/30'}>
                            {s.isCompleted ? '\u2713' : '\u25CB'}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-8 text-center">
              <FiDumbbell className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start a Workout</h3>
              <p className="text-white/50 mb-6">Create a new workout to start tracking your exercises</p>
              <button onClick={() => setShowNewWorkout(true)} className="btn-primary inline-flex items-center gap-2">
                <FiPlus className="w-5 h-5" /> New Workout
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {showNewWorkout && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4">New Workout</h3>
                <input type="text" placeholder="Workout name" value={newWorkoutName} onChange={e => setNewWorkoutName(e.target.value)}
                  className="input-field mb-3" />
                <div className="flex gap-2">
                  <button onClick={createWorkout} className="btn-primary text-sm flex-1">Create</button>
                  <button onClick={() => setShowNewWorkout(false)} className="btn-ghost text-sm">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Recent Workouts</h3>
            <div className="space-y-2">
              {workouts.slice(0, 10).map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group">
                  <div>
                    <p className="text-sm font-medium text-white">{w.name}</p>
                    <p className="text-xs text-white/40">{format(new Date(w.date), 'MMM d')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      w.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                      w.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/50'
                    }`}>{w.status}</span>
                    <button onClick={() => deleteWorkout(w.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
