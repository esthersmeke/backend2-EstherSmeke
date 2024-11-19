import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  if (req.cookies && req.cookies.currentUser) {
    try {
      const decoded = jwt.verify(
        req.cookies.currentUser,
        process.env.JWT_SECRET
      );
      req.user = decoded; // Agregar el usuario decodificado al objeto req
      return next();
    } catch (error) {
      console.log("Error al verificar el token:", error.message);
    }
  }

  // Si no está autenticado, redirige al login en caso de HTML o responde con JSON
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect("/login");
  }
  res
    .status(401)
    .json({ message: "No autenticado. Por favor, inicia sesión." });
};

// Middleware para verificar si el usuario NO está autenticado
export const isNotAuthenticated = (req, res, next) => {
  if (!req.user) {
    return next();
  }
  res.redirect("/current"); // Redirigir a perfil si ya está autenticado
};

// Middleware para roles específicos
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res
      .status(403)
      .json({ message: `Acceso denegado: Se requiere rol ${role}` });
  };
};

// Middleware para roles múltiples (admin o user)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    res.status(403).json({
      message: "Acceso denegado: Permisos insuficientes.",
    });
  };
};
