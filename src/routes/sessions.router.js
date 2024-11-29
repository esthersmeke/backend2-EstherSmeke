import { Router } from "express";
import { currentUser } from "../controllers/sessions.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Obtener usuario actual
router.get("/current", authenticateUser, currentUser);

export default router;
