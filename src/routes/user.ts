import { Router } from "express";
import multer from "multer";

// Middleware
import * as validate from "../middleware/validation/user";

//controllers
import * as user from "../controllers/user";

const router = Router();
const upload = multer();

router.post('/create', validate.postCreate, user.postCreate);
router.get('/:userId/get', validate.userIdGet, user.userIdGet);
router.post('/upload-image', upload.single('image'), validate.uploadImage, user.uploadImage);

export default router;