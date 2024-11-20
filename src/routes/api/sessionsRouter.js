import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from "../../controllers/userController.js";
import { isAuthenticated } from "../../middlewares/accessControl.js";

const router = Router();

// Rutas públicas
router.post("/register", registerUser); // Registro de usuario
router.post("/login", loginUser); // Inicio de sesión
router.post("/forgot-password", forgotPassword); // Solicitar recuperación de contraseña
router.post("/reset-password", resetPassword); // Con token en Authorization
router.post("/reset-password/:token", resetPassword); // Con token en el path

// Rutas protegidas
router.get("/current", isAuthenticated, getUserProfile); // Perfil de usuario actual
router.post("/logout", isAuthenticated, (req, res) => {
  res.clearCookie("currentUser");
  res.status(200).json({ message: "Sesión cerrada correctamente" });
});

export default router;
