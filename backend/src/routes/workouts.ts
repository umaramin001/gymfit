import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { page = '1', limit = '20', status, startDate, endDate } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = { userId: req.user!.userId };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        include: { exercises: { include: { exercise: true, sets: true } } },
        orderBy: { date: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.workout.count({ where }),
    ]);

    sendResponse(res, 200, {
      workouts,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.get('/today', authenticate, async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user!.userId,
        date: { gte: today, lt: tomorrow },
      },
      include: { exercises: { include: { exercise: true, sets: true }, orderBy: { order: 'asc' } } },
    });
    sendResponse(res, 200, workouts);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalWorkouts, weekWorkouts, monthWorkouts, recentWorkouts] = await Promise.all([
      prisma.workout.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.workout.count({ where: { userId, status: 'COMPLETED', date: { gte: startOfWeek } } }),
      prisma.workout.count({ where: { userId, status: 'COMPLETED', date: { gte: startOfMonth } } }),
      prisma.workout.findMany({
        where: { userId, status: 'COMPLETED' },
        orderBy: { date: 'desc' },
        take: 7,
      }),
    ]);

    const totalCalories = recentWorkouts.reduce((sum, w) => sum + (w.totalCalories || 0), 0);
    const totalDuration = recentWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    sendResponse(res, 200, {
      totalWorkouts,
      weekWorkouts,
      monthWorkouts,
      totalCalories,
      totalDuration,
      recentWorkouts,
    });
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, date, notes, exercises } = req.body;
    const workout = await prisma.workout.create({
      data: {
        userId: req.user!.userId,
        name: name || 'Workout',
        date: date ? new Date(date) : new Date(),
        notes,
        status: 'PLANNED',
      },
    });
    sendResponse(res, 201, workout, 'Workout created');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/:id/exercises', authenticate, async (req: AuthRequest, res) => {
  try {
    const { exerciseId, sets } = req.body;
    const workout = await prisma.workout.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!workout) return sendResponse(res, 404, null, 'Workout not found');

    const lastExercise = await prisma.workoutExercise.findFirst({
      where: { workoutId: req.params.id },
      orderBy: { order: 'desc' },
    });

    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId: req.params.id,
        exerciseId,
        order: (lastExercise?.order || 0) + 1,
        sets: sets ? { create: sets.map((s: any, i: number) => ({ ...s, setNumber: i + 1 })) } : undefined,
      },
      include: { exercise: true, sets: true },
    });
    sendResponse(res, 201, workoutExercise, 'Exercise added');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, date, notes, status, duration, totalCalories } = req.body;
    const workout = await prisma.workout.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { name, date: date ? new Date(date) : undefined, notes, status, duration, totalCalories },
    });
    sendResponse(res, 200, workout, 'Workout updated');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.workout.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } });
    sendResponse(res, 200, null, 'Workout deleted');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
