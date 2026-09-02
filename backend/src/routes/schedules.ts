import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const schedules = await prisma.workoutSchedule.findMany({
      where: { userId: req.user!.userId },
      orderBy: { dayOfWeek: 'asc' },
    });
    sendResponse(res, 200, schedules);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { dayOfWeek, name, description, startTime, duration } = req.body;
    const schedule = await prisma.workoutSchedule.create({
      data: { userId: req.user!.userId, dayOfWeek, name, description, startTime, duration },
    });
    sendResponse(res, 201, schedule, 'Schedule created');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { dayOfWeek, name, description, startTime, duration, isActive } = req.body;
    const schedule = await prisma.workoutSchedule.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { dayOfWeek, name, description, startTime, duration, isActive },
    });
    sendResponse(res, 200, schedule, 'Schedule updated');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.workoutSchedule.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } });
    sendResponse(res, 200, null, 'Schedule deleted');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
