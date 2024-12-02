import bcrypt from "bcryptjs";
import User from "../dao/models/userModel.js";
import * as CartService from "../services/cartService.js"; // Importar el servicio de carrito

// Función para crear el usuario administrador si no existe
export const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "adminCoder@coder.com" });
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync("adminCod3r123", 10);
      const newAdmin = new User({
        first_name: "Admin",
        last_name: "Coder",
        email: "adminCoder@coder.com",
        age: 30,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();

      // Crear un carrito vacío para el administrador
      const newCart = await CartService.createCart(newAdmin._id);

      // Asignar el cartId al administrador
      newAdmin.cart = newCart._id;
      await newAdmin.save();
      console.log("Usuario admin creado exitosamente.");
    } else {
      console.log("El usuario admin ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el usuario admin:", error);
  }
};
