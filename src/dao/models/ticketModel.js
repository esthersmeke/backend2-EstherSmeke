import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: () => `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaser: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  status: {
    type: String,
    enum: ["pendiente", "completada", "cancelada"], // Estados permitidos
    default: "pendiente", // Estado inicial por defecto
  },
});

ticketSchema.index({ purchaser: 1 });

const ticketModel = mongoose.model("tickets", ticketSchema);

export default ticketModel;
