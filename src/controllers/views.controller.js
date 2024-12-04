import jwt from "jsonwebtoken";
import ProductDTO from "../dto/ProductDTO.js";
import UserDTO from "../dto/UserDTO.js";
import CartDTO from "../dto/CartDTO.js";
import * as productService from "../services/productService.js";
import * as cartService from "../services/cartService.js";
import * as userService from "../services/userService.js";
import TicketService from "../services/ticketService.js";
import cartRepository from "../dao/repositories/cartRepository.js"; // Importar el repositorio directamente

import { sendMail } from "../utils/mailer.js"; // Asegúrate de importar sendMail correctamente

// Renderizar la página de inicio de sesión
export const renderLogin = (req, res) => {
  res.render("login", { error: req.query.error || null });
};

// Manejar el inicio de sesión
export const handleLogin = async (req, res) => {
  try {
    // Extraer los datos del formulario de login
    const { email, password } = req.body;

    // Llamar al servicio loginUser, que ya valida el usuario y la contraseña
    const { user, token } = await userService.loginUser(email, password);

    // Configurar la cookie con el token generado en el servicio
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    // Redirigir al usuario si todo fue correcto
    return res.redirect("/products");
  } catch (error) {
    console.error("Error en handleLogin:", error.message);

    // Mostrar un mensaje adecuado dependiendo del tipo de error
    const errorMessage =
      error.message === "Usuario no encontrado"
        ? "El usuario no existe. Intenta registrarte."
        : "Error al iniciar sesión. Intenta nuevamente.";

    // Asegúrate de que no se está redirigiendo, sino renderizando con el error
    return res.render("login", { error: errorMessage, loginLink: "/register" });
  }
};

// Renderizar la página de registro
export const renderRegister = (req, res) => {
  res.render("register", { error: null });
};

// Manejar el registro de usuarios
export const handleRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Llamar al servicio de registro de usuario
    const { user, token } = await userService.registerUser({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    // Configurar la cookie con el token
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    // Redirigir a la página de productos
    return res.redirect("/products");
  } catch (error) {
    console.error("Error en handleRegister:", error.message);

    // Mostrar el mensaje adecuado en la página de registro
    const errorMessage =
      error.message === "El usuario ya está registrado"
        ? "El usuario ya existe. Intenta iniciar sesión."
        : "Error al registrar usuario. Intenta nuevamente.";
    res.render("register", { error: errorMessage, loginLink: "/login" });
  }
};

// Renderizar la página actual (perfil)
export const renderCurrent = (req, res) => {
  const user = new UserDTO(req.user);
  res.render("current", { user });
};

// Renderizar la página de productos
export const renderProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);

    let user = null;
    const token = req.cookies?.currentUser;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = new UserDTO(decoded);
      } catch (error) {
        console.warn("Token inválido o expirado:", error.message);
      }
    }

    res.render("index", {
      products: products.map((product) => new ProductDTO(product)),
      user,
    });
  } catch (error) {
    console.error("Error en renderProducts:", error.message);
    res.status(500).send("Error al cargar los productos.");
  }
};

// Renderizar el detalle de un producto
export const renderProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).render("productNotFound");
    }

    res.render("productDetail", { product: new ProductDTO(product) });
  } catch (error) {
    console.error("Error en renderProductDetail:", error.message);
    res.status(500).render("error", { message: "Error interno del servidor" });
  }
};

// Renderizar la página del carrito
export const renderCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.cart) {
      return res.redirect("/login"); // Redirigir si no hay carrito asociado
    }

    // Utilizar el repositorio para obtener los datos con populate
    const cart = await cartRepository.getProductsFromCartById(user.cart);

    if (!cart || !cart.products || !cart.products.length) {
      return res.render("cart", {
        user: new UserDTO(user),
        cart: new CartDTO({ products: [], total: 0 }),
        title: "Tu Carrito",
      });
    }

    // Renderizar la vista con los datos completos
    res.render("cart", {
      user: new UserDTO(user),
      cart: new CartDTO(cart), // DTO para asegurar que los datos sean consistentes
      title: "Tu Carrito",
    });
  } catch (error) {
    console.error("Error al renderizar la vista del carrito:", error.message);
    res.status(500).render("error", { message: "Error interno del servidor." });
  }
};

// Renderizar la página para recuperar contraseña
export const renderForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

// Manejar la recuperación de contraseña
export const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.render("forgotPassword", { error: "Correo no registrado." });
    }

    const resetToken = await userService.generateResetToken(email);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    // Crear el objeto mailOptions con todos los detalles
    const mailOptions = {
      from: process.env.MAIL_USER || "tu_correo@dominio.com", // Asegúrate de usar el correo correcto aquí
      to: email, // El correo que recibirá el mensaje
      subject: "Restablecimiento de contraseña", // Asunto del correo
      html: `<a href="${resetUrl}">Restablecer contraseña</a>`, // Cuerpo HTML del correo
    };

    // Llamar a sendMail con el objeto completo de opciones
    await sendMail(mailOptions);

    // Renderizar la vista de éxito si el correo fue enviado
    res.render("forgotPasswordSuccess", {
      message: "Enlace de recuperación enviado. Verifica tu correo.",
    });
  } catch (error) {
    console.error("Error en handleForgotPassword:", error.message);

    // Renderizar la vista de error si ocurre algún fallo
    res.render("forgotPassword", {
      error: "Error al enviar el correo. Intenta nuevamente.",
    });
  }
};

// Manejar y renderizar el reseteo de contraseña
export const renderResetPasswordView = async (req, res) => {
  const { token } = req.params;
  if (req.method === "GET") {
    return res.render("resetPassword", { token });
  }
  try {
    const { newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.render("resetPasswordSuccess", { message: "Contraseña actualizada" });
  } catch (error) {
    console.error("Error en renderResetPasswordView:", error.message);
    res.render("resetPassword", { error: "Error al actualizar la contraseña" });
  }
  // Manejar el caso de token expirado
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Restablecer la contraseña
  } catch (error) {
    return res.render("resetPasswordExpired");
  }
};

// Manejar cierre de sesión
export const handleLogout = (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/login");
};

export const renderCheckout = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.cart) {
      return res.redirect("/cart"); // Redirigir si no hay carrito asociado
    }

    const cart = await cartService.getCartById(user.cart);

    if (!cart) {
      return res
        .status(404)
        .render("error", { message: "Carrito no encontrado." });
    }

    res.render("checkout", {
      cart: new CartDTO(cart), // Asegura que los datos sean consistentes
      user: new UserDTO(user), // Asegura que `user.cartId` esté disponible
    });
  } catch (error) {
    console.error("Error al renderizar la vista de checkout:", error.message);
    res.status(500).render("error", { message: "Error interno del servidor." });
  }
};

export const renderTicketDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await TicketService.getTicketById(id);

    if (!ticket) {
      return res
        .status(404)
        .render("error", { message: "Ticket no encontrado." });
    }

    // Formatea la fecha directamente en el controlador
    ticket.formattedDate = ticket.purchase_datetime
      ? new Date(ticket.purchase_datetime).toLocaleDateString("es-MX", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Fecha no disponible";

    // Renderiza la vista con el ticket formateado
    res.render("ticketDetail", { ticket, user: req.user });
  } catch (error) {
    console.error("Error al renderizar la vista del ticket:", error.message);
    res.status(500).render("error", { message: "Error interno del servidor." });
  }
};
