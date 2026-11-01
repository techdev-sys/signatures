import type { Request, Response } from 'express';

import {
  getCustomerRequest,
} from '../../middleware/customerAuth.js';
import {
  createOrder,
  getBranchOrders,
  getCustomerOrders,
  getOrderTracking,
  updateOrderStatus,
} from './order.service.js';

export async function createOrderController(
  req: Request,
  res: Response,
) {
  try {
    const {
      branchCode,
      orderType,
      deliveryAddress,
      paymentMethod,
      notes,
      items,
    } = req.body;

    if (!branchCode) {
      return res.status(400).json({
        success: false,
        message: 'branchCode is required',
      });
    }

    if (orderType !== 'delivery' && orderType !== 'pickup') {
      return res.status(400).json({
        success: false,
        message: 'orderType must be delivery or pickup',
      });
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'deliveryAddress is required for delivery orders',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one order item is required',
      });
    }

    const { customer } = getCustomerRequest(req);
    const metadata = customer.user_metadata ?? {};
    const customerName =
      typeof metadata.full_name === 'string'
        ? metadata.full_name
        : customer.email?.split('@')[0] ?? 'Customer';
    const customerPhone =
      customer.phone ??
      (typeof metadata.phone === 'string'
        ? metadata.phone
        : undefined);

    const order = await createOrder({
      branchCode,
      customerId: customer.id,
      customerName,
      customerPhone,
      orderType,
      deliveryAddress,
      paymentMethod,
      notes,
      items,
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to create order';

    console.error('Failed to create order:', error);

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function getBranchOrdersController(
  req: Request,
  res: Response,
) {
  try {
    const branchCode = Array.isArray(req.params.branchCode)
      ? req.params.branchCode[0]
      : req.params.branchCode;

    if (!branchCode) {
      return res.status(400).json({
        success: false,
        message: 'Branch code is required',
      });
    }

    const result = await getBranchOrders(branchCode);

    return res.status(200).json({
      success: true,
      count: result.orders.length,
      branch: result.branch,
      data: result.orders,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load branch orders';

    console.error('Failed to load branch orders:', error);

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function updateOrderStatusController(
  req: Request,
  res: Response,
) {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber)
      ? req.params.orderNumber[0]
      : req.params.orderNumber;
    const { status } = req.body;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required',
      });
    }

    const order = await updateOrderStatus(
      orderNumber,
      status,
    );

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to update order status';

    console.error(
      'Failed to update order status:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function getOrderTrackingController(
  req: Request,
  res: Response,
) {
  try {
    const orderNumber = Array.isArray(req.params.orderNumber)
      ? req.params.orderNumber[0]
      : req.params.orderNumber;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required',
      });
    }

    const { customer } = getCustomerRequest(req);
    const order = await getOrderTracking(
      orderNumber,
      customer.id,
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load order tracking';

    console.error(
      'Failed to load order tracking:',
      error,
    );

    return res.status(404).json({
      success: false,
      message,
    });
  }
}

export async function listCustomerOrdersController(
  req: Request,
  res: Response,
) {
  try {
    const { customer } = getCustomerRequest(req);
    const orders = await getCustomerOrders(customer.id);

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load customer orders';

    console.error(
      'Failed to load customer orders:',
      error,
    );

    return res.status(400).json({
      success: false,
      message,
    });
  }
}
