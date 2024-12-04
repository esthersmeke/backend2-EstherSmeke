import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+\@.+\..+/, // Validación básica de formato de email
  },
  age: {
    type: Number,
    required: true,
    min: [0, "La edad debe ser un número positivo"], // Validación de número positivo
  },
  password: { type: String, required: true }, // Será encriptada antes de guardar
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" }, // Referencia al carrito
  role: {
    type: String,
    enum: ["admin", "user"], // Rol permitido: admin o user
    default: "user",
  },
  githubId: {
    type: String,
    unique: true, // GitHub ID único
    sparse: true, // Permite que algunos usuarios no tengan GitHub ID
  },
  githubEmail: {
    type: String,
    sparse: true, // También permite que no todos tengan este campo
  },
});

// Crear índice en el campo 'email' para optimizar búsquedas
userSchema.index({ email: 1 });

const userModel = mongoose.model("users", userSchema);

export default userModel;
