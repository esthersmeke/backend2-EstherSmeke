import { Router } from "express";
import * as viewsController from "../controllers/viewsController.js"; // Importación limpia

import { authenticateUser } from "../middlewares/auth.middleware.js"; // Middleware de autenticación

const router = Router();

// Middleware para redirigir a /products si el usuario ya está autenticado
const redirectIfAuthenticated = (req, res, next) => {
  if (req.cookies?.currentUser) {
    return res.redirect("/products");
  }
  next();
};

// Rutas de vistas
router
  .get("/login", redirectIfAuthenticated, viewsController.renderLogin) // Login

  .get("/register", redirectIfAuthenticated, viewsController.renderRegister) // Registro

  .get("/current", viewsController.renderCurrent) // Perfil actual

  .get("/products", viewsController.renderProducts) // Página de productos

  .get("/products/:id", viewsController.renderProductDetail) // Detalle de producto

  .get("/cart", authenticateUser, viewsController.renderCart); // Carrito

// Rutas combinadas para forgot-password
router
  .route("/forgot-password")
  .get(viewsController.renderForgotPassword) // Formulario de recuperación
  .post(viewsController.handleForgotPassword); // Manejo del formulario

// Rutas combinadas para reset-password/:token
router
  .route("/reset-password/:token")
  .get(viewsController.renderResetPasswordView) // Formulario de nueva contraseña
  .post(viewsController.handleResetPassword); // Procesar nueva contraseña

// Página de token expirado para restablecimiento de contraseña
router.get("/reset-password-expired", (req, res) => {
  res.render("resetPasswordExpired"); // Vista de token expirado
});

// Ruta de cierre de sesión
router.get("/logout", viewsController.handleLogout); // Cerrar sesión

export default router;
