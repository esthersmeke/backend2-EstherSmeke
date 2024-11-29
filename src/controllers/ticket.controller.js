import TicketService from "../services/ticketService.js";

// Obtener el historial de compras de un usuario
export const getPurchaseHistory = async (req, res) => {
  const { purchaser } = req.params; // Usar email del usuario como parámetro

  try {
    const tickets = await TicketService.getTicketsByPurchaser(purchaser);
    if (tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron compras para este usuario" });
    }

    return res.status(200).json({
      message: "Historial de compras",
      purchases: tickets,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el historial de compras",
      error: error.message,
    });
  }
};

// Obtener todos los tickets (solo administradores)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketService.getAllTickets(); // Obtener todos los tickets

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No hay tickets disponibles" });
    }

    return res.status(200).json({
      message: "Todos los tickets",
      tickets,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener todos los tickets",
      error: error.message,
    });
  }
};

// Obtener un ticket específico por ID
export const getTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await TicketService.getTicketById(id); // Buscar ticket por ID
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    return res.status(200).json({
      message: "Ticket encontrado",
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el ticket",
      error: error.message,
    });
  }
};

// Crear un ticket (POST /api/tickets)
export const createTicket = async (req, res) => {
  const ticketData = req.body;

  try {
    const newTicket = await TicketService.createTicket(ticketData);
    return res.status(201).json({
      message: "Ticket creado con éxito",
      ticket: newTicket,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el ticket",
      error: error.message,
    });
  }
};

// Actualizar un ticket (PUT /api/tickets/:id)
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTicket = await TicketService.updateTicket(id, updateData);
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    return res.status(200).json({
      message: "Ticket actualizado con éxito",
      ticket: updatedTicket,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el ticket",
      error: error.message,
    });
  }
};
