import jwt from "jsonwebtoken";
import * as productService from "../services/productService.js";
import UserDTO from "../dto/UserDTO.js";

// Renderizar la página de inicio de sesión
export const renderLogin = (req, res) => {
  const { error } = req.query; // Extrae el mensaje de error del query string
  res.render("login", { error }); // Pasa el mensaje a la vista
};

// Renderizar la página de registro
export const renderRegister = (req, res) => {
  res.render("register");
};

// Renderizar la página actual (perfil) para usuarios autenticados
export const renderCurrent = (req, res) => {
  res.render("current", { user: req.user });
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
// Renderizar la página de productos (pública, pero personalizada si el usuario está autenticado)
export const renderProducts = async (req, res) => {
  try {
    let userDTO = null;

    // Verificar si el usuario está autenticado leyendo la cookie
    if (req.cookies && req.cookies.currentUser) {
      try {
        const token = req.cookies.currentUser;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded JWT:", decodedUser); // Log para verificar qué contiene el token

        // Procesar el usuario con el DTO
        userDTO = new UserDTO(decodedUser);

        console.log("UserDTO generado:", userDTO); // Log para confirmar el DTO
      } catch (error) {
        console.log("Error al verificar el token:", error.message);
      }
    }

    const products = await productService.getAllProducts(req.query);

    // Renderizar la vista de productos
    res.render("index", {
      products: products.docs, // Aquí puedes aplicar un DTO si lo necesitas
      user: userDTO, // Pasar los datos del usuario autenticado con DTO, si aplica
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).send("Error al cargar los productos.");
  }
};
