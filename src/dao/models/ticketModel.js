import mongoose from "mongoose";

// Función para generar un código único y legible
const generateUniqueCode = () =>
  `TICKET-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 8)
    .toUpperCase()}`;

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: generateUniqueCode,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "El monto no puede ser negativo."],
  },
  purchaser: {
    type: String,
    required: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "El correo electrónico proporcionado no es válido.",
    ],
  },
  status: {
    type: String,
    enum: ["pendiente", "completada", "cancelada"],
    default: "completada",
  },
  purchasedItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", // Referencia al modelo de productos
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "La cantidad debe ser al menos 1."],
      },
      price: {
        type: Number,
        required: true,
        min: [0, "El precio no puede ser negativo."],
      },
    },
  ],
  unprocessedItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      requestedQuantity: Number,
      availableStock: Number,
      message: String,
    },
  ],
});

// Índices para optimización
ticketSchema.index({ purchaser: 1 });
ticketSchema.index({ purchaser: 1, status: 1 }); // Índice compuesto para búsquedas combinadas

// Middleware: Antes de guardar, verificar integridad de los datos
ticketSchema.pre("save", function (next) {
  if (this.purchasedItems.length === 0 && this.status === "completada") {
    return next(
      new Error("No se puede completar un ticket sin productos comprados.")
    );
  }
  next();
});

const ticketModel = mongoose.model("tickets", ticketSchema);

export default ticketModel;
