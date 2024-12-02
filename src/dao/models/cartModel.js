import mongoose from "mongoose";
import productModel from "./productModel.js";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

// Middleware: limpiar productos con cantidad <= 0 antes de guardar
cartSchema.pre("save", function (next) {
  this.products = this.products.filter((item) => item.quantity > 0);
  next();
});
const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
