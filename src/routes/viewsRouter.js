import { Router } from "express";
import {
  renderLogin,
  renderRegister,
  renderCurrent,
  renderProducts,
  handleLogout,
} from "../controllers/viewsController.js";

import {
  isAuthenticated,
  isNotAuthenticated,
} from "../middlewares/accessControl.js";

const router = Router();

// Página de inicio de sesión (solo para usuarios no autenticados)
router.get("/login", isNotAuthenticated, renderLogin);

// Página de registro (solo para usuarios no autenticados)
router.get("/register", isNotAuthenticated, renderRegister);

// Página actual (perfil) para usuarios autenticados
router.get("/current", isAuthenticated, renderCurrent);

// Ruta de cierre de sesión
router.get("/logout", handleLogout);

// Página de productos (pública, pero personalizada si el usuario está autenticado)
router.get("/products", renderProducts);

export default router;
