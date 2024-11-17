// Middleware para verificar si el usuario está autenticado con JWT
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    // req.user debería estar disponible si Passport deserializa el JWT correctamente
    return next();
  } else {
    res
      .status(401)
      .json({ message: "No autenticado. Por favor, inicia sesión." });
  }
};

// Middleware para verificar si el usuario NO está autenticado con JWT
export const isNotAuthenticated = (req, res, next) => {
  if (!req.user) {
    return next();
  } else {
    res.redirect("/profile");
  }
};

// Middleware de autorización basado en el rol de admin
export const requireAdminRole = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: "Acceso denegado: Se requiere rol de administrador" });
  }
};

// Middleware de autorización basado en el rol de usuario o admin
export const requireUserOrAdminRole = (req, res, next) => {
  if (req.user && (req.user.role === "user" || req.user.role === "admin")) {
    return next();
  }
  return res.status(403).json({
    message: "Acceso denegado: Se requiere rol de usuario o administrador",
  });
};
