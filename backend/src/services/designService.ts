import Design from '../models/Design';
import { IUser, UserRole } from '../models/User';
import { ApiError } from '../utils/ApiError';

export async function listDesigns(input: { pageNumber?: number; keyword?: string }) {
  const pageSize = 10;
  const page = input.pageNumber || 1;

  const keyword = input.keyword
    ? {
        title: { $regex: input.keyword, $options: 'i' },
      }
    : {};

  const count = await Design.countDocuments({ ...keyword, status: 'published' } as any);
  const designs = await Design.find({ ...keyword, status: 'published' } as any)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return { designs, page, pages: Math.ceil(count / pageSize) };
}

export async function getDesignById(id: string) {
  const design = await Design.findById(id)
    .populate('uploadedBy', 'firstName lastName')
    .populate('reviews.userId', 'firstName lastName');

  if (!design) throw new ApiError(404, 'Design not found', { code: 'DESIGN_NOT_FOUND' });
  return design;
}

export async function createDesign(input: {
  user: IUser;
  body: any;
  file?: Express.Multer.File;
}) {
  const { title, description, price, category, tags, stock } = input.body;

  let imagePath = 'placeholder.jpg';
  if (input.file) {
    imagePath = `/${input.file.path.replace(/\\/g, '/')}`;
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
      preview: imagePath,
    },
    uploadedBy: input.user._id,
    userRole: input.user.role === UserRole.INFLUENCER ? 'influencer' : 'designer',
    status: 'published',
    stock: Number(stock) || 0,
  });

  return await design.save();
}

export async function listAllDesignsAdmin() {
  return await Design.find({}).populate('uploadedBy', 'firstName lastName email').sort({ createdAt: -1 });
}

export async function deleteDesign(id: string) {
  const design = await Design.findById(id);
  if (!design) throw new ApiError(404, 'Design not found', { code: 'DESIGN_NOT_FOUND' });
  await design.deleteOne();
}

export async function updateDesignStock(id: string, stock: number) {
  const design = await Design.findById(id);
  if (!design) throw new ApiError(404, 'Design not found', { code: 'DESIGN_NOT_FOUND' });
  design.stock = stock;
  return await design.save();
}

export async function updateDesign(input: { id: string; body: any; user: IUser }) {
  const design = await Design.findById(input.id);
  if (!design) throw new ApiError(404, 'Design not found', { code: 'DESIGN_NOT_FOUND' });

  const isAdmin = input.user.role === 'admin';
  const isOwner = design.uploadedBy.toString() === input.user._id.toString();
  if (!isAdmin && !isOwner) throw new ApiError(403, 'Not authorized to update this design', { code: 'FORBIDDEN' });

  if (input.body.title !== undefined) design.title = input.body.title;
  if (input.body.description !== undefined) design.description = input.body.description;
  if (input.body.price !== undefined) design.price = input.body.price;
  if (input.body.category !== undefined) design.category = input.body.category;
  if (input.body.stock !== undefined) design.stock = input.body.stock;
  if (isAdmin && input.body.status) design.status = input.body.status;

  return await design.save();
}


