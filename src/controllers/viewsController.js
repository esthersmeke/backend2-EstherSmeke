import jwt from "jsonwebtoken";
import * as productService from "../services/productService.js";
import UserDTO from "../dto/UserDTO.js";
import ProductDTO from "../dto/ProductDTO.js";

// Renderizar la página de inicio de sesión
export const renderLogin = (req, res) => {
  const { error } = req.query; // Extrae el mensaje de error del query string
  res.render("login", { error }); // Pasa el mensaje a la vista
};

// Renderizar la página de registro
export const renderRegister = (req, res) => {
  res.render("register");
};

export const renderCurrent = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login"); // Asegurarse de redirigir si no hay usuario
    }

    res.render("current", {
      user: req.user, // Pasar los datos del usuario autenticado
    });
  } catch (error) {
    console.error("Error al renderizar el perfil:", error);
    res.status(500).send("Error interno del servidor.");
  }
};

// Manejar el cierre de sesión
export const handleLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .send({ status: "error", message: "No se pudo cerrar la sesión" });
    }
    res.clearCookie("currentUser");
    res.redirect("/login");
  });
};
// Renderizar la página de productos para el navegador
export const renderProducts = async (req, res) => {
  try {
    let userDTO = null;

    // Verificar si el usuario está autenticado leyendo la cookie
    if (req.cookies && req.cookies.currentUser) {
      try {
        const token = req.cookies.currentUser;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        userDTO = new UserDTO(decodedUser); // Procesar el usuario con el DTO
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          console.log("El token ha expirado, limpiando cookie.");
          res.clearCookie("currentUser"); // Limpia la cookie si el token expiró
        } else {
          console.log("Error al verificar el token:", error.message);
        }
      }
    }

    // Obtener los productos desde el servicio
    const products = await productService.getAllProducts(req.query);

    // Renderizar la vista de productos
    res.render("index", {
      products: products.docs.map((product) => new ProductDTO(product)), // DTO para los productos
      user: userDTO, // Usuario autenticado (si aplica), o null
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).send("Error al cargar los productos.");
  }
};

export const renderResetPasswordView = (req, res) => {
  const { token } = req.params;

  try {
    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET);

    // Servir la vista de restablecimiento
    res.render("resetPassword", { token });
  } catch (error) {
    console.error("Token de recuperación inválido o expirado:", error.message);
    res.render("resetPasswordExpired");
  }
};
