import UserService from "../services/userService.js";
import { sendMail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(201).json({ message: "Usuario registrado con éxito", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await UserService.loginUser(email, password);

    // Configura la cookie con el token
    res.cookie("currentUser", token, { httpOnly: true });
    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await UserService.getUserProfile(req.user.id); // `req.user` ya validado por el middleware
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const token = await UserService.generatePasswordResetToken(email);

    // Enviar correo de recuperación
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${token}`;
    await sendMail(
      email,
      "Recuperación de contraseña",
      `Haz clic aquí para restablecer tu contraseña: ${resetLink}`
    );

    res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.params.token;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Actualizar la contraseña
    await UserService.resetPassword(decoded.id, newPassword);

    res.status(200).json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ message: "El token ha expirado" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};
