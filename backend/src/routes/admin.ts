import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const [totalUsers, activeUsers, totalWorkouts, totalExercises, recentUsers, recentWorkouts] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.workout.count(),
      prisma.exercise.count(),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }),
      prisma.workout.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { name: true, email: true } } } }),
    ]);
    sendResponse(res, 200, { totalUsers, activeUsers, totalWorkouts, totalExercises, recentUsers, recentWorkouts });
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.get('/users', async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, profile: true },
      orderBy: { createdAt: 'desc' },
    });
    sendResponse(res, 200, users);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/users/:id', async (req: AuthRequest, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role, isActive } });
    sendResponse(res, 200, user, 'User updated');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.delete('/users/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    sendResponse(res, 200, null, 'User deleted');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.get('/exercises', async (req: AuthRequest, res) => {
  try {
    const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } });
    sendResponse(res, 200, exercises);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/exercises', async (req: AuthRequest, res) => {
  try {
    const { name, category, muscleGroup, description, difficulty } = req.body;
    const exercise = await prisma.exercise.create({ data: { name, category, muscleGroup, description, difficulty } });
    sendResponse(res, 201, exercise, 'Exercise created');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/exercises/:id', async (req: AuthRequest, res) => {
  try {
    const exercise = await prisma.exercise.update({ where: { id: req.params.id }, data: req.body });
    sendResponse(res, 200, exercise, 'Exercise updated');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.delete('/exercises/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.exercise.delete({ where: { id: req.params.id } });
    sendResponse(res, 200, null, 'Exercise deleted');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
