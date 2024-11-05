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
        return res.redirect("/api/sessions/login");
      }

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
      };

      res.redirect("/profile");
    });
  }
);

router.get("/failregister", (req, res) =>
  res.send({ error: "Registro fallido" })
);

// Ruta de inicio de sesión con JWT
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

    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET, // usa la clave secreta de la variable de entorno
      { expiresIn: "1h" }
    );

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      token: token,
    };

    res.redirect("/profile");
  }
);

router.get("/failregister", (req, res) =>
  res.send({ error: "Registro fallido" })
);
router.get("/faillogin", (req, res) => res.send({ error: "Login fallido" }));

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ status: "success", user: req.user });
  }
);

// Ruta de cierre de sesión
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "error", message: "No se pudo cerrar la sesión" });
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
        return res.redirect("/login");
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
