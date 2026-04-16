import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { validate, authValidation, loginValidation } from '../middleware/validation';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response } from 'express';

const router = Router();

router.post('/register', authValidation, validate, (req: unknown, res: unknown) =>
  AuthController.register(req as AuthenticatedRequest, res as Response)
);

router.post('/login', loginValidation, validate, (req: unknown, res: unknown) =>
  AuthController.login(req as AuthenticatedRequest, res as Response)
);

router.get('/profile', authenticate, (_req: unknown, res: unknown) =>
  AuthController.getProfile(_req as AuthenticatedRequest, res as Response)
);

router.put('/profile', authenticate, (req: unknown, res: unknown) =>
  AuthController.updateProfile(req as AuthenticatedRequest, res as Response)
);

export default router;