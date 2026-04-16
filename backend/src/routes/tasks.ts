import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticate } from '../middleware/auth';
import { validate, taskValidation, taskUpdateValidation, idValidation } from '../middleware/validation';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response } from 'express';

const router = Router();

router.use(authenticate);

router.post('/', taskValidation, validate, (req: unknown, res: unknown) =>
  TaskController.create(req as AuthenticatedRequest, res as Response)
);

router.get('/', (_req: unknown, res: unknown) =>
  TaskController.getAll(_req as AuthenticatedRequest, res as Response)
);

router.get('/:id', idValidation, validate, (req: unknown, res: unknown) =>
  TaskController.getById(req as AuthenticatedRequest, res as Response)
);

router.put('/:id', taskUpdateValidation, validate, (req: unknown, res: unknown) =>
  TaskController.update(req as AuthenticatedRequest, res as Response)
);

router.delete('/:id', idValidation, validate, (req: unknown, res: unknown) =>
  TaskController.delete(req as AuthenticatedRequest, res as Response)
);

export default router;