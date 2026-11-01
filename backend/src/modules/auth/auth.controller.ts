import type { Request, Response } from 'express';

import {
  getCustomerRequest,
} from '../../middleware/customerAuth.js';
import {
  getCustomerProfile,
  refreshCustomerSession,
  signInCustomer,
  signOutCustomer,
  signUpCustomer,
} from './auth.service.js';

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Authentication request failed';
}

export async function signUpCustomerController(
  req: Request,
  res: Response,
) {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    const result = await signUpCustomer({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      password,
    });

    return res.status(201).json({
      success: true,
      message: result.requiresEmailConfirmation
        ? 'Check your email to confirm your account'
        : 'Account created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: errorMessage(error),
    });
  }
}

export async function signInCustomerController(
  req: Request,
  res: Response,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await signInCustomer(
      String(email).trim().toLowerCase(),
      String(password),
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: errorMessage(error),
    });
  }
}

export async function refreshCustomerController(
  req: Request,
  res: Response,
) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const result = await refreshCustomerSession(
      String(refreshToken),
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: errorMessage(error),
    });
  }
}

export function getCustomerController(
  req: Request,
  res: Response,
) {
  const { customer } = getCustomerRequest(req);

  return res.status(200).json({
    success: true,
    data: getCustomerProfile(customer),
  });
}

export async function signOutCustomerController(
  req: Request,
  res: Response,
) {
  try {
    const { accessToken } = getCustomerRequest(req);

    await signOutCustomer(accessToken);

    return res.status(200).json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: errorMessage(error),
    });
  }
}
