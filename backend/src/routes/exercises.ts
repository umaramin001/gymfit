import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { category, muscleGroup, search } = req.query;
    const where: any = { OR: [{ isCustom: false }, { userId: req.user!.userId }] };
    if (category) where.category = category as string;
    if (muscleGroup) where.muscleGroup = muscleGroup as string;
    if (search) where.name = { contains: search as string, mode: 'insensitive' };

    const exercises = await prisma.exercise.findMany({ where, orderBy: { name: 'asc' } });
    sendResponse(res, 200, exercises);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, category, muscleGroup, description, difficulty } = req.body;
    const exercise = await prisma.exercise.create({
      data: { name, category, muscleGroup, description, difficulty, isCustom: true, userId: req.user!.userId },
    });
    sendResponse(res, 201, exercise, 'Exercise created');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
