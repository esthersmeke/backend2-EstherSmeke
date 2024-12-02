import { verifyToken } from "../utils/token.js";

// Middleware para verificar autenticación mediante JWT desde cookies
export const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies?.currentUser;

    if (!token) {
      console.warn("No se encontró el token en las cookies.");

      // Comportamiento para APIs
      if (req.originalUrl.startsWith("/api")) {
        return res
          .status(401)
          .json({ message: "No autenticado. Token faltante." });
      }
      // Comportamiento para vistas
      if (req.accepts("html")) {
        return res.status(401).redirect("/login");
      }
    }

    // Validar el token JWT
    const decoded = verifyToken(token);
    req.user = decoded; // Adjuntar los datos del usuario decodificado a la solicitud
    next();
  } catch (error) {
    console.error("Error en authenticateUser:", error.message);

    // Comportamiento para APIs
    if (req.originalUrl.startsWith("/api")) {
      return res.status(403).json({ message: "Token inválido o expirado." });
    }

    // Comportamiento para vistas
    if (req.accepts("html")) {
      return res.status(403).redirect("/login");
    }
  }
};

// Middleware para autorizar según el rol
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol insuficiente" });
    }
    next();
  };
};

// Middleware específico para administradores
export const isAdmin = authorizeRole("admin");

// Middleware para redirigir a /products si el usuario ya está autenticado
export const redirectIfAuthenticated = (req, res, next) => {
  if (req.cookies?.currentUser) {
    return res.redirect("/products");
  }
  next();
};
