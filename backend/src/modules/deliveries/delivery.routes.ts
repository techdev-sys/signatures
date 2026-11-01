import { Router } from 'express';

import {
  acceptDeliveryController,
  getAvailableDeliveriesController,
  getDriverActiveDeliveriesController,
  getDriverCompletedDeliveriesController,
  requestDriverController,
  updateDeliveryStatusController,
} from './delivery.controller.js';

export const deliveryRouter = Router();

deliveryRouter.post(
  '/request',
  requestDriverController,
);

deliveryRouter.get(
  '/available/:driverCode',
  getAvailableDeliveriesController,
);

deliveryRouter.get(
  '/driver/:driverCode/active',
  getDriverActiveDeliveriesController,
);

deliveryRouter.get(
  '/driver/:driverCode/completed',
  getDriverCompletedDeliveriesController,
);

deliveryRouter.post(
  '/:deliveryId/accept',
  acceptDeliveryController,
);

deliveryRouter.patch(
  '/:deliveryId/status',
  updateDeliveryStatusController,
);
