import userModel from "../dao/models/userModel.js";

class UserRepository {
  async createUser(userData) {
    try {
      return await userModel.create(userData);
    } catch (error) {
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
      return await userModel.findById(userId).lean();
    } catch (error) {
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
}

export default new UserRepository();
