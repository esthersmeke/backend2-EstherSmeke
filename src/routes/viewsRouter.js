import { Router } from "express";
import {
  renderLogin,
  renderRegister,
  renderCurrent,
  renderProducts,
  handleLogout,
  renderResetPasswordView,
} from "../controllers/viewsController.js";

import { isAuthenticated } from "../middlewares/accessControl.js";

const router = Router();

// Página de inicio de sesión (solo para usuarios no autenticados)
router.get("/login", renderLogin);

// Página de registro (solo para usuarios no autenticados)
router.get("/register", renderRegister);

// Página actual (perfil) para usuarios autenticados
router.get("/current", isAuthenticated, renderCurrent);

// Ruta de cierre de sesión
router.get("/logout", handleLogout);

// Página de productos (pública, pero personalizada si el usuario está autenticado)
router.get("/products", renderProducts);

// Ruta para servir la vista de restablecimiento de contraseña
router.get("/reset-password/:token", renderResetPasswordView);

export default router;
