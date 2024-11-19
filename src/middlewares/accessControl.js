// Middleware para verificar si el usuario está autenticado con JWT
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
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
