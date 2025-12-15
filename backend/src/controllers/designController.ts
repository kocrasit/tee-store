import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUser } from '../models/User';
import { sendSuccess } from '../utils/apiResponse';
import {
  createDesign as createDesignService,
  deleteDesign as deleteDesignService,
  getDesignById as getDesignByIdService,
  listAllDesignsAdmin,
  listDesigns,
  updateDesign as updateDesignService,
  updateDesignStock as updateDesignStockService,
} from '../services/designService';

// Extend Request interface locally
interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Fetch all designs
// @route   GET /api/designs
// @access  Public
const getDesigns = asyncHandler(async (req: Request, res: Response) => {
  const result = await listDesigns({
    pageNumber: (req.query as any).pageNumber,
    keyword: (req.query as any).keyword,
    filter: (req.query as any).filter,
  });
  sendSuccess(res, { data: result });
});

// @desc    Fetch single design
// @route   GET /api/designs/:id
// @access  Public
const getDesignById = asyncHandler(async (req: Request, res: Response) => {
  const design = await getDesignByIdService(req.params.id);
  sendSuccess(res, { data: design });
});

// @desc    Create a design
// @route   POST /api/designs
// @access  Private (Influencer/Designer)
const createDesign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const createdDesign = await createDesignService({
    user: req.user as any,
    body: req.body,
    file: (req as any).file,
  });
  sendSuccess(res, { statusCode: 201, data: createdDesign });
});

// @desc    Get all designs for admin (including unpublished)
// @route   GET /api/designs/admin
// @access  Private/Admin
const getAllDesignsAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const designs = await listAllDesignsAdmin();
  sendSuccess(res, { data: designs });
});

// @desc    Delete a design
// @route   DELETE /api/designs/:id
// @access  Private/Admin
const deleteDesign = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteDesignService(req.params.id);
  sendSuccess(res, { message: 'Design removed' });
});

// @desc    Update design stock
// @route   PUT /api/designs/:id/stock
// @access  Private/Admin
const updateDesignStock = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updatedDesign = await updateDesignStockService(req.params.id, req.body.stock);
  sendSuccess(res, { data: updatedDesign });
});

// @desc    Update a design
// @route   PUT /api/designs/:id
// @access  Private (Admin or Owner)
const updateDesign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updatedDesign = await updateDesignService({
    id: req.params.id,
    body: req.body,
    user: req.user as any,
  });
  sendSuccess(res, { data: updatedDesign });
});

export { getDesigns, getDesignById, createDesign, getAllDesignsAdmin, deleteDesign, updateDesignStock, updateDesign };

