import {
  findByEmail,
  create,
  findById,
} from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/UserDTO.js";

// Registrar un usuario
export const register = async (userData) => {
  const { password, ...restData } = userData;

  // Verificar si el usuario ya existe
  const existingUser = await findByEmail(restData.email);
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  // Hashear la contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Crear un nuevo usuario
  const newUser = { ...restData, password: hashedPassword };
  return await create(newUser); // Llamar directamente a 'create'
};

// Iniciar sesión de usuario
export const login = async (email, password) => {
  const user = await findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Email o contraseña incorrectos");
  }
  return user;
};

// Obtener perfil del usuario
export const getProfile = async (userId) => {
  const user = await findById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return new UserDTO(user); // Retornar el DTO para ocultar información sensible
};
