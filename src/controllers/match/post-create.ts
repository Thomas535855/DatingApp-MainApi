import { Request, Response } from "express";
// Utils
import rj from "../../utils/res-json";
import logger from '../../utils/logger'
import MatchHandler from "../../logic/handlers/matchHandler";
// Handlers

// PATH: POST /create/:userOneId/:userTwoId
export default async (req: Request, res: Response): Promise<void> => {
    const { userOneId, userTwoId } = req.params;

    try {
        const matchHandler = new MatchHandler();
        
        await matchHandler.createUser(parseInt(userOneId), parseInt(userTwoId));

        logger.info(`Match created successfully: ${JSON.stringify({userOneId, userTwoId})}`);

        rj.success(res, [200]);
    } catch (error: any) {
        logger.error(`Error creating user: ${error.message}`, { error });

        rj.error(res, [500]);
    }
};
