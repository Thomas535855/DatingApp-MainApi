import { Request, Response } from "express";
// Utils
import rj from "../../utils/res-json";
import logger from '../../utils/logger'
// Handlers
import UserHandler from "../../logic/handlers/userHandler";
import {createUserSchema} from "../../interfaces/schemas";

// PATH: POST /create
export default async (req: Request, res: Response): Promise<void> => {
    const { userData, genres } = req.body as createUserSchema

    try {
        const userHandler = new UserHandler();

        await userHandler.createUser(userData, genres);
        
        logger.info(`User created successfully: ${JSON.stringify(userData)}`);

        rj.success(res, [200]);
    } catch (error:any) {
        logger.error(`Error creating user: ${error.message}`, { error });

        rj.error(res, [500]);
    }
};
