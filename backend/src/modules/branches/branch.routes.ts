import { Router } from 'express';

import { listBranches } from './branch.controller.js';

export const branchRouter = Router();

branchRouter.get('/', listBranches);
