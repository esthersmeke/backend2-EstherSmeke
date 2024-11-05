import mongoose from "mongoose";
const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" }, // Referencia al carrito
  role: { type: String, default: "user" }, // Rol del usuario, con valor por defecto 'user'
});

const User = mongoose.model(userCollection, userSchema);

export default User;
