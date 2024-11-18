import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../../controllers/userController.js";
import passport from "passport";

const router = express.Router();

// Ruta de registro
router.post("/register", registerUser);

// Ruta de login
router.post("/login", loginUser);

// Ruta de logout
router.post("/logout", logoutUser);

// Ruta para obtener el perfil del usuario autenticado
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  getUserProfile
);

export default router;
