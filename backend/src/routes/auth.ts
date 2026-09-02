import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import { sendResponse } from '../utils/helpers';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return sendResponse(res, 400, null, 'All fields are required');
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendResponse(res, 400, null, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile: { create: {} },
      },
      include: { profile: true },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    sendResponse(res, 201, {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    }, 'Account created successfully');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 401, null, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, null, 'Invalid credentials');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, null, 'Account is deactivated');
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    sendResponse(res, 200, {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    }, 'Login successful');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true, profile: true },
    });
    if (!user) return sendResponse(res, 404, null, 'User not found');
    sendResponse(res, 200, user);
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendResponse(res, 404, null, 'No account with that email');
    sendResponse(res, 200, null, 'Password reset link sent to email');
  } catch (error: any) {
    sendResponse(res, 500, null, error.message);
  }
});

export default router;
