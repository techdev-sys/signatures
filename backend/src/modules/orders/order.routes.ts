import { Router } from 'express';

import {
  requireCustomerAuth,
} from '../../middleware/customerAuth.js';
import {
  createOrderController,
  getBranchOrdersController,
  getOrderTrackingController,
  listCustomerOrdersController,
  updateOrderStatusController,
} from './order.controller.js';

export const orderRouter = Router();

orderRouter.post(
  '/',
  requireCustomerAuth,
  createOrderController,
);

orderRouter.get(
  '/branch/:branchCode',
  getBranchOrdersController,
);

orderRouter.get(
  '/mine',
  requireCustomerAuth,
  listCustomerOrdersController,
);

orderRouter.get(
  '/:orderNumber/tracking',
  requireCustomerAuth,
  getOrderTrackingController,
);

orderRouter.patch(
  '/:orderNumber/status',
  updateOrderStatusController,
);
