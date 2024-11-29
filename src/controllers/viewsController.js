import ProductDTO from "../dto/ProductDTO.js";
import UserDTO from "../dto/UserDTO.js";
import * as productService from "../services/productService.js";
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";

// Renderizar la página de inicio de sesión
export const renderLogin = (req, res) => {
  if (req.user) return res.redirect("/products");
  res.render("login", { error: req.query.error });
};

// Renderizar la página de registro
export const renderRegister = (req, res) => {
  if (req.user) return res.redirect("/products");
  res.render("register");
};

// Manejar el registro de usuario
export const handleRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    await userService.createUser({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });
    res.redirect("/products");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Error al registrar el usuario.");
  }
};

export const renderCurrent = (req, res) => {
  try {
    const token = req.cookies?.currentUser;
    if (!token) {
      return res.redirect("/login"); // Redirigir si no está autenticado
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = new UserDTO(decoded); // Usar el DTO para la vista

    res.render("current", { user });
  } catch (error) {
    console.error("Error al renderizar la vista de perfil:", error.message);
    res.redirect("/login"); // Redirigir en caso de error
  }
};

// Renderizar la página de productos
export const renderProducts = async (req, res) => {
  try {
    // Obtener la lista de productos
    const products = await productService.getAllProducts(req.query);

    // Configurar variables para el mensaje y el usuario
    let welcomeMessage = "Bienvenido a nuestra tienda";
    let user = null;

    // Verificar si hay una cookie con el token del usuario
    const token = req.cookies?.currentUser;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        welcomeMessage = `Bienvenido, ${decoded.first_name}!`;
        user = new UserDTO(decoded); // Transformar el usuario en un DTO
      } catch (error) {
        console.warn("Token inválido o expirado:", error.message);
      }
    }

    // Renderizar la vista con los datos necesarios
    res.render("index", {
      products: products.docs.map((product) => new ProductDTO(product)),
      welcomeMessage, // Mensaje dinámico según el estado del usuario
      user, // Información del usuario si está autenticado
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error al cargar los productos.");
  }
};

// Renderizar la página de detalle de un producto
export const renderProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Llama al servicio para obtener el producto por ID
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).render("productNotFound");
    }

    // Renderiza la vista con el producto
    res.render("productDetail", { product: new ProductDTO(product) });
  } catch (error) {
    console.error("Error al cargar el detalle del producto:", error.message);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
};

// Renderizar la página del carrito
export const renderCart = async (req, res) => {
  try {
    const cart = await userService.getCartByUserId(req.user.id);
    res.render("cart", { cart, user: new UserDTO(req.user) });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    res.status(500).send("Error al cargar el carrito.");
  }
};

// Renderizar la vista para solicitar correo de recuperación
export const renderForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

// Manejar solicitud de correo de recuperación
export const handleForgotPassword = async (req, res) => {
  try {
    console.log("Entrando a handleForgotPassword");

    const { email } = req.body;
    const token = await userService.generatePasswordResetToken(email);

    // Generar enlace de recuperación
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${token}`;
    await userService.sendMail(
      email,
      "Recuperación de contraseña",
      `Haz clic aquí para restablecer tu contraseña: ${resetLink}`
    );

    // Renderizar mensaje de éxito (NO REDIRIGIR)
    res.render("forgotPasswordSuccess", {
      title: "Correo Enviado",
      message:
        "Hemos enviado un enlace de recuperación de contraseña a tu correo.",
      linkText: "Ver productos",
      linkHref: "/products",
    });
  } catch (error) {
    console.error("Error en forgotPassword:", error.message);
    res.status(500).render("error", { message: "Error al enviar el correo." });
  }
};

export const renderResetPasswordView = (req, res) => {
  const { token } = req.params;
  res.render("resetPassword", { token });
};

export const handleResetPassword = async (req, res) => {
  const { token } = req.params; // Obtener el token desde la URL
  const { newPassword } = req.body; // Nueva contraseña desde el formulario

  console.log("Token recibido:", token);
  console.log("Nueva contraseña recibida:", newPassword);

  try {
    if (!token) {
      return res
        .status(401)
        .render("error", { message: "Token no proporcionado" });
    }

    if (!newPassword) {
      return res
        .status(400)
        .render("error", { message: "La nueva contraseña es requerida." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await userService.resetPassword(decoded.id, newPassword);

    // Mostrar mensaje de éxito
    res.render("resetPasswordSuccess", {
      title: "Contraseña Restablecida",
      message: "Tu contraseña se ha restablecido con éxito.",
      linkText: "Ver productos",
      linkHref: "/products",
    });
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "El token ha expirado, solicita uno nuevo."
        : error.message;

    res.status(400).render("error", { message });
  }
};

// Manejar el cierre de sesión
export const handleLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).send("Error al cerrar sesión.");
    }
    res.clearCookie("currentUser");
    res.redirect("/login");
  });
};
