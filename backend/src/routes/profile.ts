import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
    });
    sendResponse(res, 200, profile);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { age, gender, height, weight, fitnessGoal, bio, profilePicture } = req.body;
    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.userId },
      update: { age, gender, height, weight, fitnessGoal, bio, profilePicture },
      create: { userId: req.user!.userId, age, gender, height, weight, fitnessGoal, bio, profilePicture },
    });
    sendResponse(res, 200, profile, 'Profile updated');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
