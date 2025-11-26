import express from 'express';
import { getDesigns, getDesignById, createDesign, getAllDesignsAdmin, deleteDesign, updateDesignStock, updateDesign } from '../controllers/designController';
import { createProductReview } from '../controllers/reviewController';
import { protect, checkRole } from '../middleware/authMiddleware';

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    },
});

const router = express.Router();

console.log('Design Routes Loaded - Roles: influencer, designer, admin');

// Admin routes
router.route('/admin')
    .get(protect, checkRole(['admin']), getAllDesignsAdmin);

router.route('/')
    .get(getDesigns)
    .post(protect, checkRole(['influencer', 'designer', 'admin']), upload.single('image'), createDesign);

router.route('/:id/reviews').post(protect, createProductReview);

router.route('/:id/stock')
    .put(protect, checkRole(['admin']), updateDesignStock);

router.route('/:id')
    .get(getDesignById)
    .put(protect, updateDesign)
    .delete(protect, checkRole(['admin']), deleteDesign);

export default router;

