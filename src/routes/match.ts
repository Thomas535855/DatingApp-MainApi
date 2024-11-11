import { Router } from "express";

// Middleware
import * as validate from "../middleware/validation/match";

//controllers
import * as match from "../controllers/match";

const router = Router();

router.post('/create/:userOneId/:userTwoId', validate.postCreate, match.postCreate)

export default router;