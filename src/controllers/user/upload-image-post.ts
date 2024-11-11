import { Request, Response } from "express";
import rj from "../../utils/res-json";
import multer from 'multer' //used for typing
import logger from "../../utils/logger";
import ImageHandler from "../../logic/handlers/imageHandler";

const uploadImageHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
           rj.error(res, [400, "No image file provided"]);
           return;
        }

        const imageHandler = new ImageHandler();
        const result = await imageHandler.uploadImageToImgur(req.file.buffer);

        rj.success(res, [200, { imageUrl: result } as any]);
    } catch (error: any) {
        logger.error(`Error uploading image: ${error.message}`, { error });
        rj.error(res, [500, "Image upload failed"]);
    }
};

export default uploadImageHandler;
