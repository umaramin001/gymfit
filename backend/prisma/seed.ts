import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default exercises
  const exercises = [
    { name: 'Bench Press', category: 'Strength', muscleGroup: 'Chest', description: 'Flat barbell bench press', difficulty: 'INTERMEDIATE' },
    { name: 'Incline Bench Press', category: 'Strength', muscleGroup: 'Chest', description: 'Incline barbell bench press', difficulty: 'INTERMEDIATE' },
    { name: 'Dumbbell Flyes', category: 'Strength', muscleGroup: 'Chest', description: 'Dumbbell chest flyes', difficulty: 'BEGINNER' },
    { name: 'Push-ups', category: 'Strength', muscleGroup: 'Chest', description: 'Standard push-ups', difficulty: 'BEGINNER' },
    { name: 'Deadlift', category: 'Strength', muscleGroup: 'Back', description: 'Conventional deadlift', difficulty: 'ADVANCED' },
    { name: 'Pull-ups', category: 'Strength', muscleGroup: 'Back', description: 'Standard pull-ups', difficulty: 'INTERMEDIATE' },
    { name: 'Barbell Rows', category: 'Strength', muscleGroup: 'Back', description: 'Bent over barbell rows', difficulty: 'INTERMEDIATE' },
    { name: 'Lat Pulldown', category: 'Strength', muscleGroup: 'Back', description: 'Cable lat pulldown', difficulty: 'BEGINNER' },
    { name: 'Squats', category: 'Strength', muscleGroup: 'Legs', description: 'Barbell back squats', difficulty: 'INTERMEDIATE' },
    { name: 'Leg Press', category: 'Strength', muscleGroup: 'Legs', description: 'Machine leg press', difficulty: 'BEGINNER' },
    { name: 'Lunges', category: 'Strength', muscleGroup: 'Legs', description: 'Walking lunges', difficulty: 'BEGINNER' },
    { name: 'Leg Curls', category: 'Strength', muscleGroup: 'Legs', description: 'Lying leg curls', difficulty: 'BEGINNER' },
    { name: 'Calf Raises', category: 'Strength', muscleGroup: 'Legs', description: 'Standing calf raises', difficulty: 'BEGINNER' },
    { name: 'Overhead Press', category: 'Strength', muscleGroup: 'Shoulders', description: 'Barbell overhead press', difficulty: 'INTERMEDIATE' },
    { name: 'Lateral Raises', category: 'Strength', muscleGroup: 'Shoulders', description: 'Dumbbell lateral raises', difficulty: 'BEGINNER' },
    { name: 'Front Raises', category: 'Strength', muscleGroup: 'Shoulders', description: 'Dumbbell front raises', difficulty: 'BEGINNER' },
    { name: 'Bicep Curls', category: 'Strength', muscleGroup: 'Arms', description: 'Barbell bicep curls', difficulty: 'BEGINNER' },
    { name: 'Tricep Dips', category: 'Strength', muscleGroup: 'Arms', description: 'Parallel bar tricep dips', difficulty: 'INTERMEDIATE' },
    { name: 'Hammer Curls', category: 'Strength', muscleGroup: 'Arms', description: 'Dumbbell hammer curls', difficulty: 'BEGINNER' },
    { name: 'Tricep Pushdowns', category: 'Strength', muscleGroup: 'Arms', description: 'Cable tricep pushdowns', difficulty: 'BEGINNER' },
    { name: 'Running', category: 'Cardio', muscleGroup: 'Full Body', description: 'Outdoor or treadmill running', difficulty: 'BEGINNER' },
    { name: 'Cycling', category: 'Cardio', muscleGroup: 'Legs', description: 'Stationary or outdoor cycling', difficulty: 'BEGINNER' },
    { name: 'Jump Rope', category: 'Cardio', muscleGroup: 'Full Body', description: 'Jump rope cardio', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing', category: 'Cardio', muscleGroup: 'Full Body', description: 'Rowing machine', difficulty: 'INTERMEDIATE' },
    { name: 'Plank', category: 'Core', muscleGroup: 'Core', description: 'Standard plank hold', difficulty: 'BEGINNER' },
    { name: 'Crunches', category: 'Core', muscleGroup: 'Core', description: 'Standard abdominal crunches', difficulty: 'BEGINNER' },
    { name: 'Russian Twists', category: 'Core', muscleGroup: 'Core', description: 'Seated Russian twists', difficulty: 'BEGINNER' },
    { name: 'Leg Raises', category: 'Core', muscleGroup: 'Core', description: 'Hanging leg raises', difficulty: 'INTERMEDIATE' },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { id: exercise.name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: {},
      create: {
        id: exercise.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ...exercise,
      },
    });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gymfit.com' },
    update: {},
    create: {
      email: 'admin@gymfit.com',
      password: adminPassword,
      name: 'GYMFIT Admin',
      role: 'ADMIN',
      isVerified: true,
      profile: {
        create: {
          age: 30,
          gender: 'Male',
          height: 180,
          weight: 85,
          fitnessGoal: 'Admin Account',
          bio: 'GYFIFIT Platform Administrator',
        },
      },
    },
  });

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@gymfit.com' },
    update: {},
    create: {
      email: 'demo@gymfit.com',
      password: demoPassword,
      name: 'Alex Johnson',
      role: 'USER',
      isVerified: true,
      profile: {
        create: {
          age: 25,
          gender: 'Male',
          height: 178,
          weight: 82,
          fitnessGoal: 'Build muscle and increase strength',
          bio: 'Fitness enthusiast | 3 years training',
        },
      },
    },
  });

  // Create demo workout schedule for demo user
  const scheduleData = [
    { dayOfWeek: 1, name: 'Chest Day', description: 'Focus on chest exercises' },
    { dayOfWeek: 2, name: 'Back Day', description: 'Focus on back exercises' },
    { dayOfWeek: 3, name: 'Leg Day', description: 'Focus on leg exercises' },
    { dayOfWeek: 4, name: 'Shoulder Day', description: 'Focus on shoulder exercises' },
    { dayOfWeek: 5, name: 'Arm Day', description: 'Focus on arm exercises' },
    { dayOfWeek: 6, name: 'Cardio Day', description: 'Cardio and conditioning' },
    { dayOfWeek: 0, name: 'Rest Day', description: 'Recovery and rest' },
  ];

  for (const schedule of scheduleData) {
    await prisma.workoutSchedule.create({
      data: {
        userId: demoUser.id,
        ...schedule,
        startTime: '07:00',
        duration: 60,
      },
    });
  }

  // Create demo workouts
  const chestExercise = await prisma.exercise.findFirst({ where: { name: 'Bench Press' } });
  const squatExercise = await prisma.exercise.findFirst({ where: { name: 'Squats' } });
  const deadliftExercise = await prisma.exercise.findFirst({ where: { name: 'Deadlift' } });

  if (chestExercise) {
    const workout = await prisma.workout.create({
      data: {
        userId: demoUser.id,
        name: 'Chest Day Workout',
        date: new Date(),
        duration: 55,
        totalCalories: 450,
        status: 'COMPLETED',
      },
    });

    const we = await prisma.workoutExercise.create({
      data: {
        workoutId: workout.id,
        exerciseId: chestExercise.id,
        order: 1,
      },
    });

    await prisma.workoutSet.createMany({
      data: [
        { workoutExerciseId: we.id, setNumber: 1, reps: 12, weight: 60, isCompleted: true, caloriesBurned: 40 },
        { workoutExerciseId: we.id, setNumber: 2, reps: 10, weight: 70, isCompleted: true, caloriesBurned: 45 },
        { workoutExerciseId: we.id, setNumber: 3, reps: 8, weight: 80, isCompleted: true, caloriesBurned: 50 },
        { workoutExerciseId: we.id, setNumber: 4, reps: 6, weight: 90, isCompleted: true, caloriesBurned: 55 },
      ],
    });
  }

  if (squatExercise) {
    const workout = await prisma.workout.create({
      data: {
        userId: demoUser.id,
        name: 'Leg Day Workout',
        date: new Date(Date.now() - 86400000),
        duration: 65,
        totalCalories: 520,
        status: 'COMPLETED',
      },
    });

    const we = await prisma.workoutExercise.create({
      data: {
        workoutId: workout.id,
        exerciseId: squatExercise.id,
        order: 1,
      },
    });

    await prisma.workoutSet.createMany({
      data: [
        { workoutExerciseId: we.id, setNumber: 1, reps: 15, weight: 80, isCompleted: true, caloriesBurned: 50 },
        { workoutExerciseId: we.id, setNumber: 2, reps: 12, weight: 100, isCompleted: true, caloriesBurned: 60 },
        { workoutExerciseId: we.id, setNumber: 3, reps: 10, weight: 120, isCompleted: true, caloriesBurned: 70 },
      ],
    });
  }

  // Create some progress data
  const progressData = [
    { type: 'weight', value: 85, unit: 'kg', date: new Date(Date.now() - 30 * 86400000) },
    { type: 'weight', value: 84, unit: 'kg', date: new Date(Date.now() - 25 * 86400000) },
    { type: 'weight', value: 83, unit: 'kg', date: new Date(Date.now() - 20 * 86400000) },
    { type: 'weight', value: 82.5, unit: 'kg', date: new Date(Date.now() - 15 * 86400000) },
    { type: 'weight', value: 82, unit: 'kg', date: new Date(Date.now() - 10 * 86400000) },
    { type: 'weight', value: 81.5, unit: 'kg', date: new Date(Date.now() - 5 * 86400000) },
    { type: 'weight', value: 82, unit: 'kg', date: new Date() },
    { type: 'bench_press_max', value: 80, unit: 'kg', date: new Date(Date.now() - 28 * 86400000) },
    { type: 'bench_press_max', value: 85, unit: 'kg', date: new Date(Date.now() - 14 * 86400000) },
    { type: 'bench_press_max', value: 90, unit: 'kg', date: new Date() },
    { type: 'squat_max', value: 100, unit: 'kg', date: new Date(Date.now() - 28 * 86400000) },
    { type: 'squat_max', value: 110, unit: 'kg', date: new Date(Date.now() - 14 * 86400000) },
    { type: 'squat_max', value: 120, unit: 'kg', date: new Date() },
    { type: 'deadlift_max', value: 120, unit: 'kg', date: new Date(Date.now() - 28 * 86400000) },
    { type: 'deadlift_max', value: 130, unit: 'kg', date: new Date(Date.now() - 14 * 86400000) },
    { type: 'deadlift_max', value: 140, unit: 'kg', date: new Date() },
    { type: 'workout_frequency', value: 4, unit: 'sessions/week', date: new Date(Date.now() - 28 * 86400000) },
    { type: 'workout_frequency', value: 5, unit: 'sessions/week', date: new Date(Date.now() - 14 * 86400000) },
    { type: 'workout_frequency', value: 5, unit: 'sessions/week', date: new Date() },
  ];

  for (const p of progressData) {
    await prisma.progress.create({
      data: {
        userId: demoUser.id,
        ...p,
      },
    });
  }

  // Create demo notifications
  await prisma.notification.createMany({
    data: [
      { userId: demoUser.id, title: 'Welcome to GYMFIT!', message: 'Start tracking your workouts today.', type: 'INFO' },
      { userId: demoUser.id, title: 'Chest Day Reminder', message: 'Your Chest Day workout starts in 30 minutes.', type: 'REMINDER' },
      { userId: demoUser.id, title: 'New Record!', message: 'You set a new bench press record: 90kg!', type: 'ACHIEVEMENT' },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Admin: admin@gymfit.com / admin123');
  console.log('Demo: demo@gymfit.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
