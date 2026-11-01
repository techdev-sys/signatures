import type { Request, Response } from 'express';

import { getBranches } from './branch.service.js';

export async function listBranches(
  _req: Request,
  res: Response,
) {
  try {
    const branches = await getBranches();

    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    console.error('Failed to load branches:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load branches',
    });
  }
}
