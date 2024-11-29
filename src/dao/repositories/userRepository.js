import userModel from "../models/userModel.js";
import mongoose from "mongoose";

class UserRepository {
  async createUser(userData) {
    try {
      console.log("Datos enviados a createUser:", userData);
      const user = await userModel.create(userData);
      console.log("Usuario creado en la base de datos:", user);
      return user;
    } catch (error) {
      console.error(
        "Error al crear usuario en la base de datos:",
        error.message
      );
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  async findByEmail(email) {
    try {
      return await userModel.findOne({ email }).lean();
    } catch (error) {
      throw new Error("Error al buscar el usuario por email: " + error.message);
    }
  }

  async findById(userId) {
    try {
      // Instanciar ObjectId usando 'new'
      const objectId = new mongoose.Types.ObjectId(userId); // Usar 'new'
      const user = await userModel.findById(objectId).lean();
      console.log("Resultado de findById:", user);
      return user;
    } catch (error) {
      console.error("Error en findById:", error.message);
      throw new Error("Error al buscar el usuario por ID: " + error.message);
    }
  }

  async updateUser(userId, updateData) {
    try {
      return await userModel.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }

  async deleteUser(userId) {
    try {
      return await userModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  }
  async findAll() {
    try {
      return await userModel.find().lean();
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error.message);
      throw new Error("Error al obtener los usuarios.");
    }
  }
}

export default new UserRepository();
