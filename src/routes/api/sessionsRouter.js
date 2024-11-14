import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { createHash, isValidpassword } from "../../utils/utils.js";

const router = Router();

// Ruta de registro
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        console.error("Error en login:", err);
        return res
          .status(500)
          .json({ error: "Error al iniciar sesión después de registro." });
      }

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
      };

      res
        .status(200)
        .json({
          status: "success",
          message: "Registro exitoso",
          user: req.user,
        });
    });
  }
);

router.get("/failregister", (req, res) =>
  res
    .status(400)
    .json({
      error:
        "Registro fallido. El usuario ya podría existir o falta información.",
    })
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  (req, res) => {
    if (
      req.user.email === "adminCoder@coder.com" &&
      req.body.password === "adminCod3r123"
    ) {
      req.user.role = "admin";
    } else {
      req.user.role = "user";
    }

    // Genera el token JWT
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET, // usa la clave secreta de la variable de entorno
      { expiresIn: "1h" }
    );

    // Enviar el token en una cookie y responder con JSON
    res
      .cookie("jwt", token, { httpOnly: true, secure: false }) // Cambia `secure: true` si usas HTTPS
      .status(200)
      .json({ status: "success", message: "Autenticación exitosa", token });
  }
);

router.get("/faillogin", (req, res) =>
  res
    .status(400)
    .json({ error: "Login fallido. Por favor, revisa tus credenciales." })
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado, token inválido." });
    }
    res.status(200).json({ status: "success", user: req.user });
  }
);

// Ruta de cierre de sesión
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "No se pudo cerrar la sesión" });
    }
    res.redirect("/login");
  });
});

// Autenticación de GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        console.error("Error en login:", err);
        return res
          .status(500)
          .json({ error: "Error al iniciar sesión con GitHub." });
      }

      // Asegurar que los datos de GitHub se almacenen en la sesión
      req.session.user = {
        first_name: req.user.first_name || "GitHub User",
        last_name: req.user.last_name || "",
        email: req.user.email,
        role: req.user.role || "user",
      };

      res.redirect("/profile");
    });
  }
);

export default router;
