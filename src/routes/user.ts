import { Router } from "express";

// Middleware
import * as validate from "../middleware/validation/user";

//controllers
import * as user from "../controllers/user";

const router = Router();

router.post('/create', validate.postCreate, user.postCreate)

export default router;