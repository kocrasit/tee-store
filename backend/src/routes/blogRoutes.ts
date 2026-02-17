/**
 * Blog Routes
 * Public ve Admin blog endpoint'leri
 */

import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { cloudinaryDesignUpload } from '../config/cloudinary';
import * as blogService from '../services/blogService';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// GET /api/blogs - Yayınlanmış blog yazılarını getir
router.get('/', async (req, res, next) => {
    try {
        const { category } = req.query;
        const blogs = await blogService.getPublishedBlogs(category as string);
        sendSuccess(res, { data: blogs });
    } catch (error) {
        next(error);
    }
});

// GET /api/blogs/categories - Kategorileri getir
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await blogService.getBlogCategories();
        sendSuccess(res, { data: categories });
    } catch (error) {
        next(error);
    }
});

// GET /api/blogs/:slug - Slug ile blog yazısı getir
router.get('/:slug', async (req, res, next) => {
    try {
        const blog = await blogService.getBlogBySlug(req.params.slug);
        sendSuccess(res, { data: blog });
    } catch (error) {
        next(error);
    }
});

// ==================== ADMIN ROUTES ====================

// POST /api/blogs/admin/upload-image - Blog kapak görseli yükle (admin)
router.post('/admin/upload-image', protect, adminOnly, cloudinaryDesignUpload.single('image'), (req, res, next) => {
    try {
        if (!req.file) {
            return sendError(res, { statusCode: 400, message: 'Dosya yüklenmedi' });
        }
        const imageUrl = (req.file as any).path; // Cloudinary URL
        sendSuccess(res, { data: { url: imageUrl } });
    } catch (error) {
        next(error);
    }
});

// GET /api/blogs/admin/all - Tüm blog yazılarını getir (admin)
router.get('/admin/all', protect, adminOnly, async (req, res, next) => {
    try {
        const blogs = await blogService.getAllBlogs();
        sendSuccess(res, { data: blogs });
    } catch (error) {
        next(error);
    }
});

// GET /api/blogs/admin/:id - Tek blog yazısı getir (admin)
router.get('/admin/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        sendSuccess(res, { data: blog });
    } catch (error) {
        next(error);
    }
});

// POST /api/blogs/admin - Yeni blog yazısı oluştur (admin)
router.post('/admin', protect, adminOnly, async (req, res, next) => {
    try {
        const { title, slug, excerpt, content, image, category, author, readTime, isPublished } = req.body;

        if (!title || !excerpt || !content) {
            return sendError(res, { statusCode: 400, message: 'Başlık, özet ve içerik zorunludur' });
        }

        const blog = await blogService.createBlog({
            title, slug, excerpt, content, image, category, author, readTime, isPublished
        });
        sendSuccess(res, { statusCode: 201, data: blog, message: 'Blog yazısı başarıyla oluşturuldu' });
    } catch (error) {
        next(error);
    }
});

// PUT /api/blogs/admin/:id - Blog yazısı güncelle (admin)
router.put('/admin/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const { title, slug, excerpt, content, image, category, author, readTime, isPublished } = req.body;
        const blog = await blogService.updateBlog(req.params.id, {
            title, slug, excerpt, content, image, category, author, readTime, isPublished
        });
        sendSuccess(res, { data: blog, message: 'Blog yazısı başarıyla güncellendi' });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/blogs/admin/:id - Blog yazısı sil (admin)
router.delete('/admin/:id', protect, adminOnly, async (req, res, next) => {
    try {
        await blogService.deleteBlog(req.params.id);
        sendSuccess(res, { message: 'Blog yazısı başarıyla silindi' });
    } catch (error) {
        next(error);
    }
});

export default router;
