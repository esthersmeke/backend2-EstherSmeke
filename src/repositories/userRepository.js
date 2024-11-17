import User from "../dao/models/userModel.js";

// Crear un usuario
export const create = async (userData) => {
  try {
    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("El correo electrónico ya está registrado.");
    }
    throw new Error("Error al crear el usuario: " + error.message);
  }
};

// Buscar un usuario por email
export const findByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error("Error al buscar el usuario por email: " + error.message);
  }
};

// Buscar un usuario por ID
export const findById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  } catch (error) {
    throw new Error("Error al buscar el usuario por ID: " + error.message);
  }
};
