import jwt from "jsonwebtoken";

/**
 * Middleware para verificar autenticación sin usar Passport.
 * Se asegura de que un token JWT válido esté presente en las cookies.
 */
export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.currentUser; // Extrae el token de las cookies
    if (!token) {
      console.warn("No se encontró el token en las cookies.");
      return res
        .status(401)
        .json({ message: "No autenticado. Por favor, inicia sesión." });
    }

    // Verifica el token y lo decodifica
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agrega la información del usuario al objeto req
    next(); // Permite que la solicitud continúe
  } catch (error) {
    console.error("Error al verificar la autenticación:", error.message);

    const message =
      error.name === "TokenExpiredError"
        ? "El token ha expirado. Por favor, inicia sesión nuevamente."
        : "Token inválido o expirado.";

    return res.status(401).json({ message });
  }
};

/**
 * Middleware para autorización de roles específicos.
 * Verifica si el usuario tiene el rol necesario para acceder al endpoint.
 */
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role === role) {
      return next(); // Permite continuar si el rol coincide
    }
    console.warn(
      `Acceso denegado. Se requiere rol ${role}. Usuario tiene rol: ${req.user?.role}`
    );
    return res
      .status(403)
      .json({ message: `Acceso denegado. Requiere rol ${role}.` });
  };
};

/**
 * Middleware para autorización de múltiples roles.
 * Permite el acceso si el rol del usuario coincide con uno de los permitidos.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next(); // Permite continuar si el rol coincide
    }
    console.warn(
      `Acceso denegado. Usuario tiene rol: ${
        req.user?.role
      }. Roles requeridos: ${roles.join(", ")}`
    );
    return res.status(403).json({
      message: `Acceso denegado. Permisos insuficientes. Se requiere uno de los siguientes roles: ${roles.join(
        ", "
      )}`,
    });
  };
};
