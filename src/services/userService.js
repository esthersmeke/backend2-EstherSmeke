import {
  findByEmail,
  create,
  findById,
} from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";

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

  // Crear un nuevo usuario con rol predeterminado
  const newUser = { ...restData, password: hashedPassword, role: "user" };
  return await create(newUser);
};

// Iniciar sesión de usuario
export const login = async (email, password) => {
  const user = await findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Email o contraseña incorrectos");
  }
  return user; // Devuelve un objeto plano gracias a `.lean()`
};

// Obtener perfil del usuario
export const getProfile = async (userId) => {
  const user = await findById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return user; // El controlador se encargará de convertir a DTO si es necesario
};
