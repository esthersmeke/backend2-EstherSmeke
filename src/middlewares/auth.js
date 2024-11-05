export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Usar req.isAuthenticated() para verificar la autenticación
    return next();
  } else {
    res.redirect("/login"); // Redirige a login si no está autenticado
  }
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Verifica si el usuario NO está autenticado
    return next();
  } else {
    res.redirect("/profile"); // Redirige a perfil si ya está autenticado
  }
};
