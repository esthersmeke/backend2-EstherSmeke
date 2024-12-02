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
      // Crear el ticket en la base de datos (la validación del correo la realiza el modelo)
      const ticket = await ticketRepository.createTicket(ticketData);

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
          from: `"Entrega" <${process.env.MAIL_USER}>`, // Dirección del remitente
          to: ticket.purchaser, // Correo del comprador
          subject: "Compra Confirmada", // Asunto del correo
          text: `¡Tu compra ha sido procesada exitosamente!\n\nDetalles de la compra:\nTicket ID: ${ticket.code}\nMonto total: ${ticket.amount}\nEstado: ${ticket.status}\n\nProductos comprados:\n${purchasedItems}\n\nProductos no comprados (por falta de stock):\n${unprocessedItems}\n\nGracias por tu compra.`,
        });
      } catch (emailError) {
        console.error("Error al enviar el correo:", emailError.message);
      }

      // Retornar el ticket estructurado con TicketDTO
      return ticket; // Este objeto contiene el monto correcto desde la base de datos
    } catch (error) {
      console.error("Error al crear el ticket:", error.message);
      throw new Error("No se pudo crear el ticket.");
    }
  }

  // Obtener todos los tickets sin estructurar con TicketDTO
  static async getAllTickets() {
    try {
      const tickets = await ticketRepository.getAllTickets();

      // Retorna directamente la lista de tickets desde el repositorio
      return tickets;
    } catch (error) {
      console.error("Error al obtener todos los tickets:", error.message);
      throw new Error("No se pudieron obtener los tickets.");
    }
  }

  // Obtener un ticket por ID sin estructurar con TicketDTO
  static async getTicketById(ticketId) {
    try {
      const ticket = await ticketRepository.findTicketById(ticketId);
      if (!ticket) {
        throw new Error(`El ticket con ID ${ticketId} no fue encontrado.`);
      }

      // Retorna directamente el ticket recuperado del repositorio
      return ticket;
    } catch (error) {
      console.error("Error al obtener el ticket:", error.message);
      throw new Error("No se pudo obtener el ticket.");
    }
  }
}

export default TicketService;
