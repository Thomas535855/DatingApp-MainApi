import { NextFunction, Request, Response } from "express";
import { createUserSchema } from "../schemas/user"; 

export const postCreate = (req: Request, res: Response, next: NextFunction) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: result.error.errors });
    }

    next();
};