import ProductDTO from "./ProductDTO.js";

export default class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.purchaseDate = ticket.purchase_datetime || new Date();
    this.totalAmount = ticket.amount || 0;
    this.purchaser = ticket.purchaser || "Desconocido";

    this.purchasedItems = (ticket.purchasedItems || []).map((item) => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity,
      price: item.price,
    }));

    this.unprocessedItems = (ticket.unprocessedItems || []).map((item) => ({
      product: new ProductDTO(item.product),
      requestedQuantity: item.requestedQuantity,
      availableStock: item.availableStock,
      message: item.message || "Stock insuficiente",
    }));
  }
}
