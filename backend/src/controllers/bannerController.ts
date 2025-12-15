import { Request, Response } from 'express';
import * as bannerService from '../services/bannerService';
import { ApiError } from '../utils/ApiError';

export const getPublicBanners = async (req: Request, res: Response) => {
    const banners = await bannerService.listBanners();
    res.json(banners);
};

export const getAllBanners = async (req: Request, res: Response) => {
    const banners = await bannerService.listAllBannersAdmin();
    res.json(banners);
};

export const createBanner = async (req: Request, res: Response) => {
    const banner = await bannerService.createBanner(req.body, req.file);
    res.status(201).json(banner);
};

export const updateBanner = async (req: Request, res: Response) => {
    const banner = await bannerService.updateBanner(req.params.id, req.body, req.file);
    res.json(banner);
};

export const deleteBanner = async (req: Request, res: Response) => {
    await bannerService.deleteBanner(req.params.id);
    res.status(204).send();
};
