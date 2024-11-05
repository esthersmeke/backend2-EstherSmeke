import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.get("/login", isNotAuthenticated, (req, res) => res.render("login"));
router.get("/register", isNotAuthenticated, (req, res) =>
  res.render("register")
);
// Ruta protegida de perfil
router.get("/profile", isAuthenticated, (req, res) => {
  console.log("Usuario en sesión:", req.session.user); // Log para verificar que el usuario está en sesión
  res.render("profile", { user: req.session.user }); // Renderiza la vista de perfil con los datos del usuario desde la sesión
});

// Ruta de cierre de sesión
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "error", message: "No se pudo cerrar la sesión" });
    }
    res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
  });
});

export default router;
