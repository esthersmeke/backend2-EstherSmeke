import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true, // Cambiamos a `required` para mayor claridad
    trim: true, // Elimina espacios en blanco al inicio y final
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true, // Garantiza que el campo sea único en MongoDB
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => value >= 0, // Asegura que el precio sea positivo
      message: "El precio debe ser un número positivo.",
    },
  },
  stock: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => Number.isInteger(value) && value >= 0, // Solo números enteros positivos
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
    default: [], // Si no se provee, inicializa como array vacío
  },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
