import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Design, { IDesign } from '../models/Design';
import { IUser, UserRole } from '../models/User';

// Extend Request interface locally
interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Fetch all designs
// @route   GET /api/designs
// @access  Public
const getDesigns = asyncHandler(async (req: Request, res: Response) => {
  console.time('getDesigns');
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
      title: {
        $regex: req.query.keyword as string,
        $options: 'i',
      },
    }
    : {};

  console.time('countDocuments');
  const count = await Design.countDocuments({ ...keyword, status: 'published' } as any);
  console.timeEnd('countDocuments');

  console.time('findDesigns');
  const designs = await Design.find({ ...keyword, status: 'published' } as any)
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  console.timeEnd('findDesigns');

  res.json({ designs, page, pages: Math.ceil(count / pageSize) });
  console.timeEnd('getDesigns');
});

// @desc    Fetch single design
// @route   GET /api/designs/:id
// @access  Public
const getDesignById = asyncHandler(async (req: Request, res: Response) => {
  const design = await Design.findById(req.params.id)
    .populate('uploadedBy', 'firstName lastName')
    .populate('reviews.userId', 'firstName lastName');

  if (design) {
    res.json(design);
  } else {
    res.status(404);
    throw new Error('Design not found');
  }
});

// @desc    Create a design
// @route   POST /api/designs
// @access  Private (Influencer/Designer)
const createDesign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, price, category, tags, stock } = req.body;

  let imagePath = 'placeholder.jpg';
  if (req.file) {
    imagePath = `/${req.file.path.replace(/\\/g, '/')}`; // Normalize path for Windows
  }

  const design = new Design({
    title,
    description,
    price,
    category,
    tags,
    images: {
      original: imagePath,
      thumbnail: imagePath,
      preview: imagePath
    },
    uploadedBy: req.user?._id,
    userRole: req.user?.role === UserRole.INFLUENCER ? 'influencer' : 'designer',
    status: 'published',
    stock: Number(stock) || 0,
  });

  const createdDesign = await design.save();
  res.status(201).json(createdDesign);
});

// @desc    Get all designs for admin (including unpublished)
// @route   GET /api/designs/admin
// @access  Private/Admin
const getAllDesignsAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const designs = await Design.find({})
    .populate('uploadedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });
  res.json(designs);
});

// @desc    Delete a design
// @route   DELETE /api/designs/:id
// @access  Private/Admin
const deleteDesign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const design = await Design.findById(req.params.id);

  if (design) {
    await design.deleteOne();
    res.json({ message: 'Design removed' });
  } else {
    res.status(404);
    throw new Error('Design not found');
  }
});

// @desc    Update design stock
// @route   PUT /api/designs/:id/stock
// @access  Private/Admin
const updateDesignStock = asyncHandler(async (req: AuthRequest, res: Response) => {
  const design = await Design.findById(req.params.id);

  if (design) {
    design.stock = req.body.stock ?? design.stock;
    const updatedDesign = await design.save();
    res.json(updatedDesign);
  } else {
    res.status(404);
    throw new Error('Design not found');
  }
});

// @desc    Update a design
// @route   PUT /api/designs/:id
// @access  Private (Admin or Owner)
const updateDesign = asyncHandler(async (req: AuthRequest, res: Response) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    res.status(404);
    throw new Error('Design not found');
  }

  // Check if user is admin or the owner of the design
  const isAdmin = req.user?.role === 'admin';
  const isOwner = design.uploadedBy.toString() === req.user?._id.toString();

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to update this design');
  }

  // Update fields
  design.title = req.body.title || design.title;
  design.description = req.body.description || design.description;
  design.price = req.body.price !== undefined ? req.body.price : design.price;
  design.category = req.body.category || design.category;
  design.stock = req.body.stock !== undefined ? req.body.stock : design.stock;

  // Only admin can change status
  if (isAdmin && req.body.status) {
    design.status = req.body.status;
  }

  const updatedDesign = await design.save();
  res.json(updatedDesign);
});

export { getDesigns, getDesignById, createDesign, getAllDesignsAdmin, deleteDesign, updateDesignStock, updateDesign };

