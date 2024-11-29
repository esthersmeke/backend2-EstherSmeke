import ticketRepository from "../dao/repositories/ticketRepository.js";
import { sendMail } from "../utils/mailer.js";

class TicketService {
  static async createTicket(ticketData) {
    if (ticketData.amount <= 0) {
      throw new Error("El monto total de la compra debe ser mayor a 0.");
    }

    try {
      // Verificar que el correo electrónico del comprador sea válido
      if (!ticketData.purchaser || !/\S+@\S+\.\S+/.test(ticketData.purchaser)) {
        throw new Error("El correo electrónico del comprador no es válido.");
      }

      // Crear el ticket en la base de datos
      const ticket = await ticketRepository.createTicket(ticketData);

      // Cambiar el estado del ticket a "completada" si la compra fue exitosa
      ticket.status = "completada"; // Cambiar el estado aquí
      await ticket.save(); // Guardar el ticket con el nuevo estado

      // Detallar los productos comprados y no comprados para el correo de confirmación
      const purchasedItems =
        ticketData.purchasedItems
          .map((item) => `${item.product.title} (Cantidad: ${item.quantity})`)
          .join("\n") || "Ninguno";

      const unprocessedItems =
        ticketData.unprocessedItems
          .map((item) => `${item.product.title} (Cantidad: ${item.quantity})`)
          .join("\n") || "Ninguno";

      // Enviar un correo de confirmación al comprador
      await sendMail({
        from: `"Entrega" <${process.env.MAIL_USER}>`, // Dirección del remitente
        to: ticketData.purchaser, // Correo del comprador
        subject: "Compra Confirmada", // Asunto del correo
        text: `¡Tu compra ha sido procesada exitosamente!\n\nDetalles de la compra:\nTicket ID: ${ticket._id}\nMonto total: ${ticket.amount}\nEstado: ${ticket.status}\n\nProductos comprados:\n${purchasedItems}\n\nProductos no comprados (por falta de stock):\n${unprocessedItems}\n\nGracias por tu compra.`,
      });

      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error.message);
      throw new Error(
        "No se pudo crear el ticket en la base de datos. Inténtalo nuevamente."
      );
    }
  }
  static async getAllTickets() {
    try {
      return await ticketRepository.getAllTickets();
    } catch (error) {
      console.error("Error al obtener todos los tickets:", error.message);
      throw new Error("No se pudieron obtener los tickets.");
    }
  }

  // Función para obtener un ticket por ID
  static async getTicketById(ticketId) {
    try {
      const ticket = await ticketRepository.findTicketById(ticketId); // Consulta al repositorio
      return ticket;
    } catch (error) {
      console.error("Error al obtener el ticket:", error.message);
      throw new Error("No se pudo obtener el ticket.");
    }
  }
}

export default TicketService;
