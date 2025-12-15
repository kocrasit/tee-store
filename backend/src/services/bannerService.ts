import Banner from '../models/Banner';

export const listBanners = async () => {
    return await Banner.find({ isActive: true }).sort({ order: 1 });
};

export const listAllBannersAdmin = async () => {
    return await Banner.find({}).sort({ order: 1 });
};

export const createBanner = async (data: any, file?: Express.Multer.File) => {
    let imagePath = '';
    if (file) {
        imagePath = `/${file.path.replace(/\\/g, '/')}`;
    }

    const banner = new Banner({
        ...data,
        image: imagePath || data.image, // Fallback if url provided directly (rare)
    });
    return await banner.save();
};

export const updateBanner = async (id: string, data: any, file?: Express.Multer.File) => {
    const banner = await Banner.findById(id);
    if (!banner) throw new Error('Banner not found');

    if (file) {
        banner.image = `/${file.path.replace(/\\/g, '/')}`;
    }

    if (data.title) banner.title = data.title;
    if (data.description) banner.description = data.description;
    if (data.link) banner.link = data.link;
    if (data.isActive !== undefined) banner.isActive = data.isActive;
    if (data.order !== undefined) banner.order = data.order;

    return await banner.save();
};

export const deleteBanner = async (id: string) => {
    return await Banner.findByIdAndDelete(id);
};
