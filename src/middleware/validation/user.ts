import { NextFunction, Request, Response } from "express";
import { createUserSchema } from "../schemas/user"; 

export const postCreate = (req: Request, res: Response, next: NextFunction) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: result.error.errors });
    }

    next();
};

export const userIdGet = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    if(!userId && typeof parseInt(userId) !== 'number'){
        return res.status(400).json({ message: "invalid userId provided"})
    }
    
    next();
}

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({ message: "no image provided"})
    }
    
    next();
}