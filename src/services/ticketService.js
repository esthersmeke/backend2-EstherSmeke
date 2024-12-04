import ticketRepository from "../dao/repositories/ticketRepository.js";
import { sendMail } from "../utils/mailer.js";
import TicketDTO from "../dto/TicketDTO.js";

class TicketService {
  // Crear un nuevo ticket
  static async createTicket(ticketData) {
    if (ticketData.amount <= 0) {
      throw new Error("El monto total de la compra debe ser mayor a 0.");
    }
    if (!ticketData.purchasedItems.every((item) => item.price >= 0)) {
      throw new Error(
        "Todos los productos comprados deben tener un precio válido."
      );
    }
    try {
      const ticket = await ticketRepository.createTicket(ticketData); // Crear el ticket

      // Transformar productos para el correo de confirmación
      const purchasedItems =
        ticket.purchasedItems
          .map((item) => `${item.product.title} (Cantidad: ${item.quantity})`)
          .join("\n") || "Ninguno";

      const unprocessedItems =
        ticket.unprocessedItems
          .map(
            (item) =>
              `${item.product.title} (Solicitado: ${item.requestedQuantity}, Disponible: ${item.availableStock})`
          )
          .join("\n") || "Ninguno";

      // Enviar un correo de confirmación al comprador
      try {
        await sendMail({
          from: `"Entrega" <${process.env.MAIL_USER}>`,
          to: ticket.purchaser,
          subject: "Compra Confirmada",
          text: `¡Tu compra ha sido procesada exitosamente!\n\nDetalles de la compra:\nTicket ID: ${ticket.code}\nMonto total: ${ticket.amount}\nEstado: ${ticket.status}\n\nProductos comprados:\n${purchasedItems}\n\nProductos no comprados (por falta de stock):\n${unprocessedItems}\n\nGracias por tu compra.`,
        });
      } catch (emailError) {
        // Error al enviar el correo
        console.error("Error al enviar el correo:", emailError.message);
      }

      // Retornar el ticket estructurado con TicketDTO
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error.message);
      throw new Error("No se pudo crear el ticket.");
    }
  }

  // Obtener todos los tickets
  static async getAllTickets() {
    try {
      const tickets = await ticketRepository.getAllTickets();
      return tickets; // Retorna los tickets directamente
    } catch (error) {
      console.error("Error al obtener todos los tickets:", error.message);
      throw new Error("No se pudieron obtener los tickets.");
    }
  }

  // Obtener un ticket por ID
  static async getTicketById(ticketId) {
    try {
      const ticket = await ticketRepository.findTicketById(ticketId);
      if (!ticket) {
        throw new Error(`El ticket con ID ${ticketId} no fue encontrado.`);
      }
      return ticket; // Retorna el ticket recuperado
    } catch (error) {
      console.error("Error al obtener el ticket:", error.message);
      throw new Error("No se pudo obtener el ticket.");
    }
  }
}

export default TicketService;
