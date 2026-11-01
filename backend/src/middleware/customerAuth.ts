import type {
  NextFunction,
  Request,
  Response,
} from 'express';
import type { User } from '@supabase/supabase-js';

import { supabase } from '../database/supabase.js';

export type CustomerRequest = Request & {
  customer: User;
  accessToken: string;
};

export async function requireCustomerAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.header('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required',
    });
  }

  const accessToken = authorization.slice(7).trim();

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required',
    });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return res.status(401).json({
      success: false,
      message: 'Your session is invalid or has expired',
    });
  }

  const customerRequest = req as CustomerRequest;
  customerRequest.customer = user;
  customerRequest.accessToken = accessToken;

  next();
}

export function getCustomerRequest(
  req: Request,
) {
  return req as CustomerRequest;
}
