import userModel from "../models/userModel.js";
import mongoose from "mongoose";

class UserRepository {
  async createUser(userData) {
    try {
      const user = await userModel.create(userData);
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          "El correo ya está registrado. Por favor, utiliza otro."
        );
      }
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  async findByEmail(email, populateFields = null) {
    try {
      let query = userModel.findOne({ email }); // Crear consulta base
      if (populateFields) {
        query = query.populate(populateFields); // Agregar populate si es necesario
      }
      const user = await query;
      if (!user) {
        throw new Error("Usuario no encontrado con el email proporcionado.");
      }
      console.log("Usuario con carrito populado:", user); // Log para verificar populate
      return user;
    } catch (error) {
      throw new Error("Error al buscar el usuario por email: " + error.message);
    }
  }

  async findById(userId, populateFields = null) {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      let query = userModel.findById(objectId); // Crea la consulta de Mongoose
      if (populateFields) {
        query = query.populate(populateFields); // Aplica populate si se especifica
      }
      const user = await query; // Ejecuta la consulta
      if (!user) {
        throw new Error("Usuario no encontrado con el ID proporcionado.");
      }
      return user;
    } catch (error) {
      throw new Error("Error al buscar el usuario por ID: " + error.message);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
        }
      );
      if (!updatedUser) {
        throw new Error("Usuario no encontrado al intentar actualizar.");
      }
      return updatedUser;
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error("Usuario no encontrado al intentar eliminar.");
      }
      return deletedUser;
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  }

  async findAll(populateFields = null) {
    try {
      let query = userModel.find();
      if (populateFields) {
        query = query.populate(populateFields); // Agregar populate si se especifica
      }
      const users = await query; // No usamos .lean() para mayor flexibilidad
      if (users.length === 0) {
        throw new Error("No se encontraron usuarios en la base de datos.");
      }
      return users;
    } catch (error) {
      throw new Error("Error al obtener los usuarios: " + error.message);
    }
  }
}

export default new UserRepository();
