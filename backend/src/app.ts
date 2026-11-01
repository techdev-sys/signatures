import cors from 'cors';
import express from 'express';

import { authRouter } from './modules/auth/auth.routes.js';
import { branchRouter } from './modules/branches/branch.routes.js';
import { deliveryRouter } from './modules/deliveries/delivery.routes.js';
import { orderRouter } from './modules/orders/order.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'Signatures API',
    version: '1.0.0',
    status: 'running',
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'signatures-api',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/branches', branchRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use(
  '/api/deliveries',
  deliveryRouter,
);
