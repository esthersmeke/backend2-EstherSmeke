import { Router } from "express";
import {
  renderLogin,
  renderRegister,
  renderProducts,
  renderCart,
  renderResetPasswordView,
  handleLogout,
  renderCurrent,
} from "../controllers/viewsController.js";
import { isAuthenticated } from "../middlewares/accessControl.js";

const router = Router();

// Middleware para redirigir a /products si el usuario ya está autenticado
const redirectIfAuthenticated = (req, res, next) => {
  if (req.cookies?.currentUser) {
    return res.redirect("/products");
  }
  next();
};

// Rutas de vistas
// Página de inicio de sesión (redirige si ya está autenticado)
router.get("/login", redirectIfAuthenticated, renderLogin);

// Página de registro (redirige si ya está autenticado)
router.get("/register", redirectIfAuthenticated, renderRegister);

// Página de perfil del usuario actual (requiere autenticación)
router.get("/current", renderCurrent);

// Página de productos (vista pública, personalizada si el usuario está logueado)
router.get("/products", renderProducts);

// Página del carrito (protegida, requiere autenticación)
router.get("/cart", isAuthenticated, renderCart);

// Página de restablecimiento de contraseña
router.get("/reset-password/:token", renderResetPasswordView);

// Página de token expirado para restablecimiento de contraseña
router.get("/reset-password-expired", (req, res) => {
  res.render("resetPasswordExpired");
});

// Ruta de cierre de sesión
router.get("/logout", handleLogout);

export default router;
