import { Router } from 'express';

import {
  requireCustomerAuth,
} from '../../middleware/customerAuth.js';
import {
  getCustomerController,
  refreshCustomerController,
  signInCustomerController,
  signOutCustomerController,
  signUpCustomerController,
} from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/sign-up', signUpCustomerController);
authRouter.post('/sign-in', signInCustomerController);
authRouter.post('/refresh', refreshCustomerController);
authRouter.get('/me', requireCustomerAuth, getCustomerController);
authRouter.post(
  '/sign-out',
  requireCustomerAuth,
  signOutCustomerController,
);
