import bcrypt from "bcryptjs";
import {
  generateToken,
  generatePasswordResetToken,
  verifyToken,
} from "../utils/token.js";
import userRepository from "../dao/repositories/userRepository.js";

// Registrar un nuevo usuario
export const registerUser = async (userData) => {
  console.log("Datos recibidos en registerUser:", userData);
  const { email, password } = userData;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("El usuario ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  console.log("Usuario creado exitosamente:", newUser);
  const token = generateToken(newUser);
  return { user: newUser, token };
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Validar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  // Generar token para el usuario
  const token = generateToken(user);
  return { user, token };
};

// Generar token de recuperación de contraseña
export const generateResetToken = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  return generatePasswordResetToken(user);
};

// Restablecer contraseña
export const resetPassword = async (token, newPassword) => {
  const decoded = verifyToken(token);
  const user = await userRepository.findById(decoded.id);

  if (!user) throw new Error("Usuario no encontrado.");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updateUser(user._id, { password: hashedPassword });
};

// Obtener usuario actual
export const getCurrentUser = async (token) => {
  try {
    const decoded = verifyToken(token);
    console.log("Buscando usuario con ID:", decoded.id);

    const user = await userRepository.findById(decoded.id);
    console.log("Usuario encontrado:", user);

    if (!user) throw new Error("Usuario no encontrado");
    return user;
  } catch (error) {
    throw new Error("Error al obtener el usuario actual: " + error.message);
  }
};

// Actualizar un usuario
export const updateUser = async (userId, updates) => {
  const user = await userRepository.updateUser(userId, updates);
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

// Eliminar un usuario
export const deleteUser = async (userId) => {
  const user = await userRepository.deleteUser(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};
