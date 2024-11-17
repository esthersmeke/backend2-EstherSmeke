import { Router } from "express";
import {
  isAuthenticated,
  isNotAuthenticated,
  requireAdminRole,
  requireUserOrAdminRole,
} from "../middlewares/accessControl.js";

const router = Router();

// Página de inicio de sesión
router.get("/login", isNotAuthenticated, (req, res) => res.render("login"));

// Página de registro
router.get("/register", isNotAuthenticated, (req, res) =>
  res.render("register")
);

// Ruta protegida de perfil
router.get("/profile", isAuthenticated, (req, res) => {
  console.log("Usuario en sesión:", req.session?.user); // Verificar sesión
  res.render("profile", { user: req.session?.user }); // Renderiza la vista de perfil
});

// Ruta de cierre de sesión
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "error", message: "No se pudo cerrar la sesión" });
    }
    res.clearCookie("jwt"); // Limpia la cookie JWT si existe
    res.redirect("/login"); // Redirige a la página de inicio de sesión
  });
});

export default router;
