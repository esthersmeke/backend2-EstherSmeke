import bcrypt from "bcryptjs";
import {
  generateToken,
  generatePasswordResetToken,
  verifyToken,
} from "../utils/token.js";
import userRepository from "../dao/repositories/userRepository.js";
import UserDTO from "../dto/UserDTO.js"; // Importar el DTO para formatear las respuestas
import * as CartService from "./cartService.js";

export const findByEmail = async (email) => {
  try {
    // Buscar usuario y asegurarse de incluir el carrito en la consulta
    const user = await userRepository.findByEmail(email, "cart"); // Popula el campo cart
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return new UserDTO(user); // Formatear con UserDTO, ahora incluye el carrito populado
  } catch (error) {
    throw new Error("Error al buscar el usuario por email: " + error.message);
  }
};

// Registrar un nuevo usuario
export const registerUser = async (userData) => {
  console.log("Datos recibidos en registerUser:", userData);
  // Crear usuario
  const { email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser({
    ...userData,
    password: hashedPassword,
  });

  console.log("Usuario creado exitosamente:", newUser);

  // Crear un carrito vacío para el usuario
  const newCart = await CartService.createCart(newUser._id);
  console.log("Carrito creado:", newCart);

  // Asignar el carrito al usuario
  newUser.cart = newCart._id;

  // Guardar el usuario con la referencia al carrito actualizada
  await newUser.save();
  console.log("Usuario actualizado con carrito:", newUser);

  // Generar el token para el nuevo usuario
  const token = generateToken(newUser);

  // Recuperar usuario con cart populado
  const updatedUser = await userRepository.findById(newUser._id, "cart");
  console.log("Usuario completo con carrito populado:", updatedUser);

  return { user: updatedUser, token };
};

export const loginUser = async (email, password) => {
  try {
    const user = await userRepository.findByEmail(email, "cart");
    console.log("Usuario recuperado con carrito:", user); // Log para inspeccionar el usuario completo

    if (!user.cart || !user.cart._id) {
      throw new Error("El usuario no tiene un carrito asignado.");
    }
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
    console.log("Usuario recuperado con populate:", user);

    return { user: new UserDTO(user), token }; // Formatear con UserDTO
  } catch (error) {
    throw new Error("Error al iniciar sesión: " + error.message);
  }
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
    return new UserDTO(user); // Formatear con UserDTO
  } catch (error) {
    throw new Error("Error al obtener el usuario actual: " + error.message);
  }
};

// Actualizar un usuario
export const updateUser = async (userId, updates) => {
  const user = await userRepository.updateUser(userId, updates);
  if (!user) throw new Error("Usuario no encontrado");
  return new UserDTO(user); // Formatear con UserDTO
};

// Eliminar un usuario
export const deleteUser = async (userId) => {
  const user = await userRepository.deleteUser(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return new UserDTO(user); // Formatear con UserDTO
};
