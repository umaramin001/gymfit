import { Router } from 'express';
import prisma from '../utils/prisma';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    sendResponse(res, 200, notifications);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data: { isRead: true },
    });
    sendResponse(res, 200, null, 'Marked as read');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.put('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });
    sendResponse(res, 200, null, 'All notifications marked as read');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
