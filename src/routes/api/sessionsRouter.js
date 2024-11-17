import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../../controllers/userController.js";
import passport from "passport";
import { requireUserOrAdminRole } from "../../middlewares/accessControl.js";

const router = express.Router();

// Ruta de registro
router.post("/register", registerUser);

// Ruta de login
router.post("/login", loginUser);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("Usuario autenticado:", req.user); // Log para verificar req.user
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.status(200).json({
      message: "Perfil obtenido con éxito",
      user: req.user,
    });
  }
);

export default router;
