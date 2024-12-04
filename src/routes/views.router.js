import { Router } from "express";
import * as viewsController from "../controllers/views.controller.js";
import passport from "passport";
import {
  authenticateUser,
  redirectIfAuthenticated,
} from "../middlewares/auth.middleware.js";
import {
  login,
  register,
  githubCallback,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

// Rutas de login
router
  .route("/login")
  .get(redirectIfAuthenticated, viewsController.renderLogin)
  .post(login);

// Rutas de registro
router.route("/register").get(viewsController.renderRegister).post(register);

// Rutas para recuperación de contraseña
router
  .route("/forgot-password")
  .get(viewsController.renderForgotPassword)
  .post(viewsController.handleForgotPassword);

router
  .route("/reset-password/:token")
  .get(viewsController.renderResetPasswordView)
  .post(viewsController.renderResetPasswordView);

// Perfil del usuario (vista protegida)
router.get("/current", authenticateUser, viewsController.renderCurrent);

// Productos
router.get("/products", viewsController.renderProducts);
router.get("/products/:id", viewsController.renderProductDetail);

// Carrito (vista protegida)
router.get("/cart", authenticateUser, viewsController.renderCart);

// Cierre de sesión
router.get("/logout", logout);

// Autenticación de GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);
// Vista para finalizar la compra (checkout)
router.get("/checkout", authenticateUser, viewsController.renderCheckout);

// Vista para detalles del ticket de compra
router.get("/ticket/:id", authenticateUser, viewsController.renderTicketDetail);
export default router;
