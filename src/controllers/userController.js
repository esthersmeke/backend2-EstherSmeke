import { register, login, getProfile } from "../services/userService.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/UserDTO.js";

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
    // Llama al servicio de registro
    const newUser = await register(req.body);

    // Convierte el usuario en un DTO
    const userDTO = new UserDTO(newUser);

    // Genera el token JWT
    const token = jwt.sign(
      {
        id: userDTO.id,
        first_name: userDTO.first_name,
        last_name: userDTO.last_name,
        email: userDTO.email,
        role: userDTO.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Configura la cookie con el token
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Redirige al usuario a la vista de productos
    res.redirect("/products");
  } catch (error) {
    if (req.headers.accept.includes("text/html")) {
      // Renderizar una vista amigable para el navegador
      return res.status(400).render("register", {
        error: "El usuario ya existe. ¿Quieres iniciar sesión?",
        loginLink: "/login", // Incluye un enlace al login
      });
    }

    // Devuelve un JSON para clientes como Postman
    res.status(400).json({ message: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const user = await login(req.body.email, req.body.password);
    const userDTO = new UserDTO(user);

    // Crear payload del JWT
    const token = jwt.sign(
      {
        id: userDTO.id,
        first_name: userDTO.first_name,
        last_name: userDTO.last_name,
        email: userDTO.email,
        role: userDTO.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Almacenar JWT como cookie
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Si el cliente es un navegador, redirige a /products
    if (req.headers.accept.includes("text/html")) {
      req.session.user = userDTO; // Almacena el DTO en la sesión
      return res.redirect("/products");
    }

    // Si el cliente es Postman (o similar), devuelve un JSON con el DTO
    res.status(200).json({
      message: "Login exitoso",
      user: userDTO,
    });
  } catch (error) {
    if (req.headers.accept.includes("text/html")) {
      // Redirigir a /login con un parámetro de error
      return res.redirect(
        `/login?error=${encodeURIComponent(
          "Email o contraseña incorrectos. Por favor, intenta de nuevo o crea una cuenta."
        )}`
      );
    }
    res.status(401).json({ message: error.message });
  }
};

// Obtener perfil de usuario
export const getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.currentUser;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getProfile(decoded.id);

    res.status(200).json({
      message: "Perfil obtenido con éxito",
      user: new UserDTO(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout de usuario
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("currentUser");
    res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
