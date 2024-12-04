import { loginUser, registerUser } from "../services/userService.js";
import jwt from "jsonwebtoken";

// Controlador para el Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Llama al servicio para autenticar al usuario
    const { user, token } = await loginUser(email, password);

    // Configurar cookie con el token
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirigir a la página de productos
    res.redirect("/products");
  } catch (error) {
    res.status(401).render("login", { error: "Credenciales inválidas" });
  }
};

// Controlador para el Registro
export const register = async (req, res) => {
  try {
    // Llama al servicio para registrar al usuario
    const { user, token } = await registerUser(req.body);

    // Configurar cookie con el token
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirigir a la página de productos
    res.redirect("/products");
  } catch (error) {
    res.status(400).render("register", { error: error.message });
  }
};

// Controlador para GitHub OAuth Callback
export const githubCallback = (req, res) => {
  try {
    // Generar token JWT con los datos del usuario autenticado
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Configurar cookie con el token
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirigir al perfil del usuario
    res.redirect("/current");
  } catch (error) {
    console.error("Error en githubCallback:", error.message);
    res.status(500).json({ message: "Error en el callback de GitHub" });
  }
};

// Controlador para el cierre de sesión
export const logout = (req, res) => {
  try {
    res.clearCookie("currentUser"); // Limpia la cookie
    res.redirect("/login"); // Redirige al login
  } catch (error) {
    console.error("Error en logout:", error.message);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};
