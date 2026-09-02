import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import exerciseRoutes from './routes/exercises';
import workoutRoutes from './routes/workouts';
import scheduleRoutes from './routes/schedules';
import progressRoutes from './routes/progress';
import notificationRoutes from './routes/notifications';
import adminRoutes from './routes/admin';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'GYMFIT API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

async function seedDatabase() {
  const userCount = await prisma.user.count();
  if (userCount > 0) return;

  console.log('Seeding database...');
  const bcrypt = await import('bcryptjs');

  const adminPass = await bcrypt.hash('admin123', 10);
  const demoPass = await bcrypt.hash('demo123', 10);

  await prisma.user.create({ data: { email: 'admin@gymfit.com', password: adminPass, name: 'Admin', role: 'ADMIN' } });
  const demoUser = await prisma.user.create({ data: { email: 'demo@gymfit.com', password: demoPass, name: 'Alex Johnson', role: 'USER' } });

  const exercises = [
    { id: 'bench-press', name: 'Bench Press', category: 'Strength', muscleGroup: 'Chest', description: 'Flat barbell bench press', difficulty: 'INTERMEDIATE' },
    { id: 'incline-bench-press', name: 'Incline Bench Press', category: 'Strength', muscleGroup: 'Chest', description: 'Incline barbell bench press', difficulty: 'INTERMEDIATE' },
    { id: 'push-ups', name: 'Push-ups', category: 'Strength', muscleGroup: 'Chest', description: 'Standard push-ups', difficulty: 'BEGINNER' },
    { id: 'dumbbell-flyes', name: 'Dumbbell Flyes', category: 'Strength', muscleGroup: 'Chest', description: 'Dumbbell chest flyes', difficulty: 'BEGINNER' },
    { id: 'squats', name: 'Squats', category: 'Strength', muscleGroup: 'Legs', description: 'Barbell back squats', difficulty: 'INTERMEDIATE' },
    { id: 'leg-press', name: 'Leg Press', category: 'Strength', muscleGroup: 'Legs', description: 'Machine leg press', difficulty: 'BEGINNER' },
    { id: 'lunges', name: 'Lunges', category: 'Strength', muscleGroup: 'Legs', description: 'Walking lunges', difficulty: 'BEGINNER' },
    { id: 'leg-curls', name: 'Leg Curls', category: 'Strength', muscleGroup: 'Legs', description: 'Lying leg curls', difficulty: 'BEGINNER' },
    { id: 'calf-raises', name: 'Calf Raises', category: 'Strength', muscleGroup: 'Legs', description: 'Standing calf raises', difficulty: 'BEGINNER' },
    { id: 'deadlift', name: 'Deadlift', category: 'Strength', muscleGroup: 'Back', description: 'Conventional deadlift', difficulty: 'ADVANCED' },
    { id: 'barbell-rows', name: 'Barbell Rows', category: 'Strength', muscleGroup: 'Back', description: 'Bent over barbell rows', difficulty: 'INTERMEDIATE' },
    { id: 'pull-ups', name: 'Pull-ups', category: 'Strength', muscleGroup: 'Back', description: 'Standard pull-ups', difficulty: 'INTERMEDIATE' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'Strength', muscleGroup: 'Back', description: 'Cable lat pulldown', difficulty: 'BEGINNER' },
    { id: 'overhead-press', name: 'Overhead Press', category: 'Strength', muscleGroup: 'Shoulders', description: 'Barbell overhead press', difficulty: 'INTERMEDIATE' },
    { id: 'lateral-raises', name: 'Lateral Raises', category: 'Strength', muscleGroup: 'Shoulders', description: 'Dumbbell lateral raises', difficulty: 'BEGINNER' },
    { id: 'front-raises', name: 'Front Raises', category: 'Strength', muscleGroup: 'Shoulders', description: 'Dumbbell front raises', difficulty: 'BEGINNER' },
    { id: 'bicep-curls', name: 'Bicep Curls', category: 'Strength', muscleGroup: 'Arms', description: 'Barbell bicep curls', difficulty: 'BEGINNER' },
    { id: 'hammer-curls', name: 'Hammer Curls', category: 'Strength', muscleGroup: 'Arms', description: 'Dumbbell hammer curls', difficulty: 'BEGINNER' },
    { id: 'tricep-pushdowns', name: 'Tricep Pushdowns', category: 'Strength', muscleGroup: 'Arms', description: 'Cable tricep pushdowns', difficulty: 'BEGINNER' },
    { id: 'tricep-dips', name: 'Tricep Dips', category: 'Strength', muscleGroup: 'Arms', description: 'Parallel bar tricep dips', difficulty: 'INTERMEDIATE' },
    { id: 'plank', name: 'Plank', category: 'Core', muscleGroup: 'Core', description: 'Standard plank hold', difficulty: 'BEGINNER' },
    { id: 'crunches', name: 'Crunches', category: 'Core', muscleGroup: 'Core', description: 'Standard abdominal crunches', difficulty: 'BEGINNER' },
    { id: 'russian-twists', name: 'Russian Twists', category: 'Core', muscleGroup: 'Core', description: 'Seated Russian twists', difficulty: 'BEGINNER' },
    { id: 'leg-raises', name: 'Leg Raises', category: 'Core', muscleGroup: 'Core', description: 'Hanging leg raises', difficulty: 'INTERMEDIATE' },
    { id: 'running', name: 'Running', category: 'Cardio', muscleGroup: 'Full Body', description: 'Outdoor or treadmill running', difficulty: 'BEGINNER' },
    { id: 'cycling', name: 'Cycling', category: 'Cardio', muscleGroup: 'Legs', description: 'Stationary or outdoor cycling', difficulty: 'BEGINNER' },
    { id: 'rowing', name: 'Rowing', category: 'Cardio', muscleGroup: 'Full Body', description: 'Rowing machine', difficulty: 'INTERMEDIATE' },
    { id: 'jump-rope', name: 'Jump Rope', category: 'Cardio', muscleGroup: 'Full Body', description: 'Jump rope cardio', difficulty: 'INTERMEDIATE' },
  ];

  await prisma.exercise.createMany({ data: exercises.map(e => ({ ...e, isCustom: false })) });

  const days = ['Rest Day', 'Chest Day', 'Back Day', 'Leg Day', 'Shoulder Day', 'Arm Day', 'Cardio Day'];
  const descs = ['Recovery and rest', 'Focus on chest exercises', 'Focus on back exercises', 'Focus on leg exercises', 'Focus on shoulder exercises', 'Focus on arm exercises', 'Cardio and conditioning'];
  for (let i = 0; i < 7; i++) {
    await prisma.workoutSchedule.create({ data: { userId: demoUser.id, dayOfWeek: i, name: days[i], description: descs[i], startTime: '07:00', duration: 60, isActive: true } });
  }

  const now = new Date();
  const progressData = [
    { userId: demoUser.id, type: 'weight', value: 85, unit: 'kg', date: new Date(now.getTime() - 60 * 86400000) },
    { userId: demoUser.id, type: 'weight', value: 84, unit: 'kg', date: new Date(now.getTime() - 45 * 86400000) },
    { userId: demoUser.id, type: 'weight', value: 83, unit: 'kg', date: new Date(now.getTime() - 30 * 86400000) },
    { userId: demoUser.id, type: 'weight', value: 82.5, unit: 'kg', date: new Date(now.getTime() - 15 * 86400000) },
    { userId: demoUser.id, type: 'weight', value: 82, unit: 'kg', date: now },
    { userId: demoUser.id, type: 'bench_press_max', value: 80, unit: 'kg', date: new Date(now.getTime() - 30 * 86400000) },
    { userId: demoUser.id, type: 'bench_press_max', value: 85, unit: 'kg', date: new Date(now.getTime() - 15 * 86400000) },
    { userId: demoUser.id, type: 'bench_press_max', value: 90, unit: 'kg', date: now },
    { userId: demoUser.id, type: 'squat_max', value: 100, unit: 'kg', date: new Date(now.getTime() - 30 * 86400000) },
    { userId: demoUser.id, type: 'squat_max', value: 110, unit: 'kg', date: new Date(now.getTime() - 15 * 86400000) },
    { userId: demoUser.id, type: 'squat_max', value: 120, unit: 'kg', date: now },
    { userId: demoUser.id, type: 'deadlift_max', value: 120, unit: 'kg', date: new Date(now.getTime() - 30 * 86400000) },
    { userId: demoUser.id, type: 'deadlift_max', value: 130, unit: 'kg', date: new Date(now.getTime() - 15 * 86400000) },
    { userId: demoUser.id, type: 'deadlift_max', value: 140, unit: 'kg', date: now },
    { userId: demoUser.id, type: 'workout_frequency', value: 5, unit: 'sessions/week', date: now },
  ];
  await prisma.progress.createMany({ data: progressData });

  console.log('Database seeded successfully!');
}

async function main() {
  await prisma.$executeRawUnsafe('SELECT 1');
  if (process.env.NODE_ENV === 'production') {
    const { execSync } = await import('child_process');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  }
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`GYMFIT API running on port ${PORT}`);
  });
}

main().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});

export default app;
