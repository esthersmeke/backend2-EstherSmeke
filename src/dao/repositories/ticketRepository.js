import Ticket from "../models/ticketModel.js";

class TicketRepository {
  // Crear un nuevo ticket
  async createTicket(ticketData) {
    try {
      console.log("Datos del ticket:", ticketData); // Depuración
      const ticket = await Ticket.create(ticketData);
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error.message);
      throw new Error("Error al guardar el ticket en la base de datos.");
    }
  }

  // Obtener un ticket por ID
  async findTicketById(ticketId) {
    try {
      // No usamos .lean() si necesitamos un documento de Mongoose
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new Error("Ticket no encontrado.");
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
      // No usamos .lean() si necesitamos que sea un documento de Mongoose
      const tickets = await Ticket.find();
      return tickets;
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
      );
      return updatedTicket;
    } catch (error) {
      console.error("Error al actualizar el ticket:", error.message);
      throw new Error("Error al actualizar el ticket.");
    }
  }

  // Buscar tickets por comprador
  async findTicketsByPurchaser(purchaser) {
    try {
      // No usamos .lean() si necesitamos que sea un documento de Mongoose
      const tickets = await Ticket.find({ purchaser });
      return tickets;
    } catch (error) {
      console.error("Error al buscar tickets por comprador:", error.message);
      throw new Error("Error al buscar tickets por comprador.");
    }
  }
  async generateTicket(ticketData) {
    try {
      return await Ticket.create(ticketData);
    } catch (error) {
      console.error("Error al generar ticket:", error.message);
      throw new Error("No se pudo generar el ticket.");
    }
  }

  async findUnprocessed(ids) {
    try {
      return await this.model.find({ _id: { $in: ids }, processed: false });
    } catch (error) {
      console.error("Error al buscar productos no procesados:", error.message);
      throw new Error("Error al obtener productos no procesados.");
    }
  }
}

export default new TicketRepository();
