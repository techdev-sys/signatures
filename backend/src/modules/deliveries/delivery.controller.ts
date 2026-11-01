import type {
  Request,
  Response,
} from 'express';

import {
  acceptDelivery,
  getAvailableDeliveries,
  getDriverActiveDeliveries,
  getDriverCompletedDeliveries,
  requestDriver,
  type DriverDeliveryStatus,
  updateDeliveryStatus,
} from './delivery.service.js';

export async function requestDriverController(
  req: Request,
  res: Response,
) {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'orderNumber is required',
      });
    }

    const result =
      await requestDriver(orderNumber);

    return res.status(201).json({
      success: true,
      message:
        'Driver requested successfully',
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to request driver';

    console.error(
      'Request driver failed:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function getAvailableDeliveriesController(
  req: Request,
  res: Response,
) {
  try {
    const driverCode = Array.isArray(req.params.driverCode)
      ? req.params.driverCode[0]
      : req.params.driverCode;

    if (!driverCode) {
      return res.status(400).json({
        success: false,
        message: 'Driver code is required',
      });
    }

    const result =
      await getAvailableDeliveries(driverCode);

    return res.status(200).json({
      success: true,
      count: result.deliveries.length,
      driver: result.driver,
      data: result.deliveries,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load deliveries';

    console.error(
      'Failed to load available deliveries:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function acceptDeliveryController(
  req: Request,
  res: Response,
) {
  try {
    const deliveryId = Array.isArray(req.params.deliveryId)
      ? req.params.deliveryId[0]
      : req.params.deliveryId;
    const { driverCode } = req.body;

    if (!deliveryId) {
      return res.status(400).json({
        success: false,
        message: 'Delivery ID is required',
      });
    }

    if (!driverCode) {
      return res.status(400).json({
        success: false,
        message: 'driverCode is required',
      });
    }

    const result = await acceptDelivery(
      deliveryId,
      driverCode,
    );

    return res.status(200).json({
      success: true,
      message:
        'Delivery accepted successfully',
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to accept delivery';

    console.error(
      'Accept delivery failed:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function updateDeliveryStatusController(
  req: Request,
  res: Response,
) {
  try {
    const deliveryId = Array.isArray(req.params.deliveryId)
      ? req.params.deliveryId[0]
      : req.params.deliveryId;

    const {
      driverCode,
      status,
    } = req.body;

    if (!deliveryId) {
      return res.status(400).json({
        success: false,
        message:
          'Delivery ID is required',
      });
    }

    if (!driverCode) {
      return res.status(400).json({
        success: false,
        message:
          'driverCode is required',
      });
    }

    const allowedStatuses = [
      'arrived_at_restaurant',
      'picked_up',
      'on_the_way',
      'delivered',
    ] as const;

    if (
      typeof status !== 'string' ||
      !allowedStatuses.some(
        (value) => value === status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid delivery status',
      });
    }

    const newStatus =
      status as DriverDeliveryStatus;

    const delivery =
      await updateDeliveryStatus(
        deliveryId,
        driverCode,
        newStatus,
      );

    return res.status(200).json({
      success: true,
      message:
        'Delivery status updated successfully',
      data: delivery,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to update delivery';

    console.error(
      'Delivery status update failed:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function getDriverActiveDeliveriesController(
  req: Request,
  res: Response,
) {
  try {
    const driverCode = Array.isArray(req.params.driverCode)
      ? req.params.driverCode[0]
      : req.params.driverCode;

    if (!driverCode) {
      return res.status(400).json({
        success: false,
        message: 'Driver code is required',
      });
    }

    const result =
      await getDriverActiveDeliveries(
        driverCode,
      );

    return res.status(200).json({
      success: true,
      count: result.deliveries.length,
      driver: result.driver,
      data: result.deliveries,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load active deliveries';

    console.error(
      'Failed to load active deliveries:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function getDriverCompletedDeliveriesController(
  req: Request,
  res: Response,
) {
  try {
    const driverCode = Array.isArray(req.params.driverCode)
      ? req.params.driverCode[0]
      : req.params.driverCode;

    if (!driverCode) {
      return res.status(400).json({
        success: false,
        message: 'Driver code is required',
      });
    }

    const result =
      await getDriverCompletedDeliveries(
        driverCode,
      );

    return res.status(200).json({
      success: true,
      count: result.deliveries.length,
      driver: result.driver,
      data: result.deliveries,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load completed deliveries';

    console.error(
      'Failed to load completed deliveries:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}
