import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { ApiError } from '../utils/ApiError';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function isSafeOriginalName(name: string) {
  // Reject path traversal, null bytes, weird separators
  return !name.includes('\u0000') && !name.includes('..') && !name.includes('/') && !name.includes('\\');
}

function hasAllowedExt(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXT.has(ext);
}

async function looksLikeAllowedImageByMagicBytes(filePath: string) {
  const fh = await fs.open(filePath, 'r');
  try {
    const buf = Buffer.alloc(12);
    await fh.read(buf, 0, 12, 0);

    // JPEG: FF D8 FF
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a;

    // WEBP: "RIFF"...."WEBP"
    const isWebp = buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';

    return isJpeg || isPng || isWebp;
  } finally {
    await fh.close();
  }
}

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  async destination(_req, _file, cb) {
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err as any, uploadDir);
    }
  },
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const designImageUpload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isSafeOriginalName(file.originalname)) {
      return cb(new ApiError(400, 'Suspicious filename', { code: 'INVALID_FILENAME' }));
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new ApiError(400, 'Invalid file type', { code: 'INVALID_FILE_TYPE', details: { mimetype: file.mimetype } }));
    }
    if (!hasAllowedExt(file.originalname)) {
      return cb(new ApiError(400, 'Invalid file extension', { code: 'INVALID_FILE_EXTENSION' }));
    }
    cb(null, true);
  },
});

export async function validateUploadedDesignImage(req: any, _res: any, next: any) {
  try {
    if (!req.file?.path) return next();
    const ok = await looksLikeAllowedImageByMagicBytes(req.file.path);
    if (!ok) {
      await fs.unlink(req.file.path).catch(() => undefined);
      throw new ApiError(400, 'Suspicious file rejected', { code: 'SUSPICIOUS_FILE' });
    }
    next();
  } catch (err) {
    next(err);
  }
}


