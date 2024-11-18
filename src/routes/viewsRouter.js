import { Router } from "express";
import {
  isAuthenticated,
  isNotAuthenticated,
} from "../middlewares/accessControl.js";

const router = Router();

// Página de inicio de sesión (solo para usuarios no autenticados)
router.get("/login", isNotAuthenticated, (req, res) => res.render("login"));

// Página de registro (solo para usuarios no autenticados)
router.get("/register", isNotAuthenticated, (req, res) =>
  res.render("register")
);

// Página de perfil (solo para usuarios autenticados)
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.user }); // Renderiza la vista con los datos del usuario autenticado
});

// Ruta de cierre de sesión
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "error", message: "No se pudo cerrar la sesión" });
    }
    res.clearCookie("currentUser"); // Limpia la cookie JWT si existe
    res.redirect("/login"); // Redirige a la página de inicio de sesión
  });
});

export default router;
