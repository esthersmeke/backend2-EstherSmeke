import { register, login, getProfile } from "../services/userService.js";
import jwt from "jsonwebtoken";

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validar campos obligatorios
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Registrar usuario
    const newUser = await register({
      first_name,
      last_name,
      email,
      age,
      password,
    });
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: newUser,
    });
  } catch (error) {
    const status = error.message.includes("ya está registrado") ? 409 : 500;
    res.status(status).json({ message: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const user = await login(email, password); // Asegúrate de que login retorna el usuario completo
    console.log("Usuario logueado:", user); // Log para depuración

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Incluye el ID y el rol en el payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Guarda el token JWT en la cookie 'currentUser'
    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo seguro en producción
    });

    res.status(200).json({
      message: "Login exitoso",
      user, // Retorna también el usuario para debug
    });
  } catch (error) {
    const status = error.message.includes("incorrectos") ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
};

// Obtener perfil de usuario
export const getUserProfile = async (req, res) => {
  try {
    const user = await getProfile(req.user.id);
    res.status(200).json({
      message: "Perfil obtenido con éxito",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};

// Logout de usuario
export const logoutUser = async (req, res) => {
  try {
    // Eliminar la cookie JWT
    res.clearCookie("jwt");

    // Redirigir al login
    res.redirect("/login"); // Cambiar a una redirección estándar
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cerrar sesión", error: error.message });
  }
};
