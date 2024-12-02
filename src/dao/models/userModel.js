import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+\@.+\..+/, // Validación de formato de email
  },
  age: {
    type: Number,
    required: true,
    min: [0, "La edad debe ser un número positivo"], // Validación de número positivo
  },
  password: { type: String, required: true }, // Será encriptada antes de guardar
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  role: {
    type: String,
    enum: ["admin", "user"], // Solo permite admin o user
    default: "user",
  },
  githubId: {
    type: String,
    unique: true, // GitHub ID único
    sparse: true, // Permite que algunos usuarios no tengan GitHub ID
  },
  githubEmail: {
    type: String,
    sparse: true, // También permitimos que no todos tengan este campo
  },
});

// Crear índice en el campo 'email'
userSchema.index({ email: 1 });

const userModel = mongoose.model("users", userSchema);

export default userModel;
