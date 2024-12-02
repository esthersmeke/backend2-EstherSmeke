import Ticket from "../models/ticketModel.js";

class TicketRepository {
  // Crear un nuevo ticket
  async createTicket(ticketData) {
    try {
      const ticket = await Ticket.create({
        ...ticketData,
        purchasedItems: ticketData.purchasedItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      return await ticket.populate([
        { path: "purchasedItems.product" },
        { path: "unprocessedItems.product" },
      ]);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("El código del ticket ya existe. Intenta con otro.");
      }
      console.error("Error al crear el ticket:", error.message);
      throw new Error("Error al guardar el ticket en la base de datos.");
    }
  }

  // Obtener un ticket por ID
  async findTicketById(ticketId) {
    try {
      const ticket = await Ticket.findById(ticketId).populate([
        { path: "purchasedItems.product" }, // Eliminamos `select`
        { path: "unprocessedItems.product" },
      ]);

      if (!ticket) {
        throw new Error(`Ticket con ID ${ticketId} no encontrado.`);
      }
      return ticket;
    } catch (error) {
      console.error("Error al buscar el ticket por ID:", error.message);
      throw new Error("Error al buscar el ticket.");
    }
  }

  // Obtener todos los tickets
  async getAllTickets() {
    try {
      return await Ticket.find()
        .populate([
          { path: "purchasedItems.product" }, // Eliminamos `select`
          { path: "unprocessedItems.product" },
        ])
        .select("-__v");
    } catch (error) {
      console.error("Error al obtener todos los tickets:", error.message);
      throw new Error("Error al obtener los tickets.");
    }
  }

  // Actualizar un ticket por ID
  async updateTicket(ticketId, updateData) {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        updateData,
        { new: true }
      ).populate([
        { path: "purchasedItems.product" }, // Eliminamos `select`
        { path: "unprocessedItems.product" },
      ]);

      if (!updatedTicket) {
        throw new Error(`Ticket con ID ${ticketId} no encontrado.`);
      }
      return updatedTicket;
    } catch (error) {
      console.error("Error al actualizar el ticket:", error.message);
      throw new Error("Error al actualizar el ticket.");
    }
  }

  // Buscar tickets por comprador
  async findTicketsByPurchaser(purchaser) {
    try {
      const tickets = await Ticket.find({ purchaser })
        .populate([
          { path: "purchasedItems.product" }, // Eliminamos `select`
          { path: "unprocessedItems.product" },
        ])
        .select("-__v");

      if (!tickets.length) {
        throw new Error(
          `No se encontraron tickets para el comprador: ${purchaser}`
        );
      }
      return tickets;
    } catch (error) {
      console.error("Error al buscar tickets por comprador:", error.message);
      throw new Error("Error al buscar tickets por comprador.");
    }
  }
}

export default new TicketRepository();
