import { Request, Response } from "express";
// Utils
import rj from "../../utils/res-json";
import logger from '../../utils/logger'
// Handlers
import UserHandler from "../../logic/handlers/UserHandler";
import {UserDto} from "../../interfaces/dto";

// PATH: GET /:userId/get
export default async (req: Request, res: Response): Promise<void> => {
    const {userId} = req.params

    try {
        const userHandler = new UserHandler();
        
        const user:UserDto = await userHandler.getUser(parseInt(userId))

        logger.info(`User read successfully ${userId}`);

        rj.success(res, [200, user as any]);
    } catch (error:Error) {
        logger.error(`Error creating user: ${error.message}`, { error });

        rj.error(res, [500]);
    }
};
