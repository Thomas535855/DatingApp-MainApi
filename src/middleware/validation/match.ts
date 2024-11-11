import { NextFunction, Request, Response } from "express";

//PATH: POST /create/:userIdOne/:userIdTwo
export const postCreate = (req: Request, res: Response, next: NextFunction) => {
    next();
};