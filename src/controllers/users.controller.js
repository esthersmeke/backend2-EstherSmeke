import * as UserService from "../services/userService.js";
import UserDTO from "../dto/UserDTO.js";
import { sendMail } from "../utils/mailer.js";

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { user, token } = await UserService.registerUser(req.body);

    res.status(201).json({
      message: "Usuario registrado con éxito",
      payload: { user: new UserDTO(user), token }, // Incluir cartId en el payload
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al registrar usuario: " + error.message,
    });
  }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.loginUser(email, password);

    // Configurar el token en una cookie
    res.cookie("currentUser", token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript del cliente
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict", // Evita que se envíe en solicitudes de otros sitios
      maxAge: 60 * 60 * 1000 * 24, // 24 horas
    });

    // Responder con los datos del usuario sin el token en el header
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      payload: { user, token }, // Usa el DTO ya preparado
    });
  } catch (error) {
    res.status(401).json({
      message: "Error al iniciar sesión: " + error.message,
    });
  }
};

// Recuperación de contraseña - Enviar correo
// forgotPassword controller

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = await UserService.generateResetToken(email);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/reset-password/${resetToken}`;

    // Crear el objeto mailOptions con todos los detalles
    const mailOptions = {
      from: process.env.MAIL_USER || "tu_correo@dominio.com", // Asegúrate de usar el correo correcto aquí
      to: email, // El correo que recibirá el mensaje
      subject: "Restablecimiento de contraseña", // Asunto del correo
      html: `<a href="${resetUrl}">Restablecer contraseña</a>`, // Cuerpo HTML del correo
    };

    // Llamar a sendMail con el objeto completo de opciones
    await sendMail(mailOptions);

    res.status(200).json({ message: "Correo de restablecimiento enviado" });
  } catch (error) {
    res.status(400).json({
      message: "Error al enviar correo: " + error.message,
    });
  }
};

// Recuperación de contraseña - Cambiar contraseña
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    await UserService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    res.status(400).json({
      message: "Error al restablecer contraseña: " + error.message,
    });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    const payload = users.map((user) => new UserDTO(user));
    res.status(200).json({ message: "Usuarios obtenidos con éxito", payload });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios: " + error.message,
    });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario obtenido con éxito",
      payload: new UserDTO(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuario: " + error.message,
    });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({
      message: "Usuario creado con éxito",
      payload: new UserDTO(user),
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al crear usuario: " + error.message,
    });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await UserService.updateUser(id, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario actualizado con éxito",
      payload: new UserDTO(updatedUser),
    });
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar usuario: " + error.message,
    });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserService.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario eliminado con éxito",
      payload: new UserDTO(deletedUser),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuario: " + error.message,
    });
  }
};

// Controlador para cerrar sesión
export const logoutUser = (req, res) => {
  try {
    // Eliminar la cookie que contiene el token
    res.clearCookie("currentUser", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Cierre de sesión exitoso" });
  } catch (error) {
    console.error("Error en logout:", error.message);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};
