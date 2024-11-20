import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.currentUser; // Extrae el token de las cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "No autenticado. Por favor, inicia sesión." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agrega la información del usuario al objeto req
    next();
  } catch (error) {
    console.error("Error al verificar la autenticación:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role === role) {
      return next();
    }
    return res
      .status(403)
      .json({ message: `Acceso denegado. Requiere rol ${role}.` });
  };
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      message: `Acceso denegado. Permisos insuficientes. Se requiere uno de los siguientes roles: ${roles.join(
        ", "
      )}`,
    });
  };
};
