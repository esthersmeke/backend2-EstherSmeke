import { register, login, getProfile } from "../services/userService.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/UserDTO.js";

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
    const newUser = await register(req.body);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: new UserDTO(newUser),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const user = await login(req.body.email, req.body.password);

    // Crear payload del JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("currentUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login exitoso",
      user: new UserDTO(user),
    });
  } catch (error) {
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
