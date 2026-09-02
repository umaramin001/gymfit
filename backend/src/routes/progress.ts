import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const where: any = { userId: req.user!.userId };
    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const progress = await prisma.progress.findMany({ where, orderBy: { date: 'desc' } });
    sendResponse(res, 200, progress);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, value, unit, notes, date } = req.body;
    const progress = await prisma.progress.create({
      data: { userId: req.user!.userId, type, value, unit, notes, date: date ? new Date(date) : new Date() },
    });
    sendResponse(res, 201, progress, 'Progress recorded');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.get('/charts', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const [weightProgress, strengthProgress, workoutFrequency] = await Promise.all([
      prisma.progress.findMany({ where: { userId, type: 'weight' }, orderBy: { date: 'asc' } }),
      prisma.progress.findMany({ where: { userId, type: { in: ['bench_press_max', 'squat_max', 'deadlift_max'] } }, orderBy: { date: 'asc' } }),
      prisma.progress.findMany({ where: { userId, type: 'workout_frequency' }, orderBy: { date: 'asc' } }),
    ]);
    sendResponse(res, 200, { weightProgress, strengthProgress, workoutFrequency });
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
