import TicketService from "../services/ticketService.js";
import TicketDTO from "../dto/TicketDTO.js";

// Obtener el historial de compras de un usuario
export const getPurchaseHistory = async (req, res) => {
  const { purchaser } = req.params;

  try {
    const tickets = await TicketService.getTicketsByPurchaser(purchaser);
    if (tickets.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron compras para este usuario.",
      });
    }

    const purchases = tickets.map((ticket) => new TicketDTO(ticket));
    return res.status(200).json({
      status: "success",
      message: "Historial de compras obtenido exitosamente.",
      purchases,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el historial de compras.",
      error: error.message,
    });
  }
};

// Obtener todos los tickets (solo administradores)
export const getAllTickets = [
  async (req, res) => {
    try {
      const tickets = await TicketService.getAllTickets();
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No hay tickets disponibles.",
        });
      }

      const formattedTickets = tickets.map((ticket) => new TicketDTO(ticket));
      return res.status(200).json({
        status: "success",
        message: "Tickets obtenidos exitosamente.",
        tickets: formattedTickets,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al obtener los tickets.",
        error: error.message,
      });
    }
  },
];

// Obtener un ticket específico por ID
export const getTicketById = [
  async (req, res) => {
    const { id } = req.params;

    try {
      const ticket = await TicketService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({
          status: "error",
          message: "Ticket no encontrado.",
        });
      }

      const formattedTicket = new TicketDTO(ticket);
      return res.status(200).json({
        status: "success",
        message: "Ticket encontrado exitosamente.",
        ticket: formattedTicket,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al obtener el ticket.",
        error: error.message,
      });
    }
  },
];

// Crear un ticket
export const createTicket = [
  async (req, res) => {
    try {
      const newTicket = await TicketService.createTicket(req.body);
      // Retorna directamente el ticket desde el servicio
      return res.status(201).json({
        status: "success",
        message: "Ticket creado exitosamente.",
        ticket: newTicket, // Usa el ticket sin modificar
      });
    } catch (error) {
      console.error("Error en el controlador:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error al crear el ticket.",
        error: error.message,
      });
    }
  },
];

// Actualizar un ticket
export const updateTicket = [
  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedTicket = await TicketService.updateTicket(id, updateData);
      if (!updatedTicket) {
        return res.status(404).json({
          status: "error",
          message: "Ticket no encontrado.",
        });
      }

      const formattedTicket = new TicketDTO(updatedTicket);
      return res.status(200).json({
        status: "success",
        message: "Ticket actualizado exitosamente.",
        ticket: formattedTicket,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al actualizar el ticket.",
        error: error.message,
      });
    }
  },
];
