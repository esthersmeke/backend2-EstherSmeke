import { verifyToken } from "../utils/token.js";

// Middleware para verificar autenticación mediante JWT desde cookies
export const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies?.currentUser;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No autenticado: Falta el token" });
    }

    // Validar el token JWT
    const decoded = verifyToken(token);
    req.user = decoded; // Adjuntar los datos del usuario decodificado a la solicitud
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error en authenticateUser:", error.message);
    }
    return res.status(403).json({
      message: "Error al verificar la autenticación: Token inválido o expirado",
    });
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
