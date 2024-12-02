import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5, // Longitud mínima
    maxlength: 100, // Longitud máxima
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10, // Longitud mínima
    maxlength: 500, // Longitud máxima
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value >= 0,
      message: "El precio debe ser un número positivo.",
    },
  },
  stock: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => Number.isInteger(value) && value >= 0,
      message: "El stock debe ser un número entero positivo.",
    },
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnails: {
    type: [String],
    default: [],
    validate: {
      validator: (array) =>
        array.every(
          (url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url) // Validación básica de URL
        ),
      message: "Todos los thumbnails deben ser URLs válidas.",
    },
  },
  status: {
    type: Boolean,
    default: true,
  },
});

// Crear índice en el campo 'title' para optimizar búsquedas
productSchema.index({ title: 1 });

const productModel = mongoose.model("products", productSchema);
export default productModel;
