import { Router } from "express";
import {
  getPurchaseHistory,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { authenticateUser, isAdmin } from "../middlewares/auth.middleware.js";
import {
  validateCreateTicket,
  validateUpdateTicket,
  validateMongoId,
} from "../middlewares/validations.js";

const router = Router();

// Ruta para obtener el historial de compras de un usuario
// Requiere autenticación
router.get(
  "/history/:purchaser",
  authenticateUser, // Verifica que el usuario esté autenticado
  validateMongoId("purchaser"), // Valida que el parámetro purchaser sea un ID válido si es necesario
  getPurchaseHistory
);

// Ruta para obtener todos los tickets (solo administradores)
router.get(
  "/",
  authenticateUser, // Verifica que el usuario esté autenticado
  isAdmin, // Verifica que el usuario sea administrador
  getAllTickets
);

// Ruta para obtener un ticket por ID
router.get(
  "/:id",
  authenticateUser, // Verifica que el usuario esté autenticado
  validateMongoId("id"), // Valida que el ID sea un ID de MongoDB válido
  getTicketById
);

// Ruta para crear un nuevo ticket
router.post(
  "/",
  authenticateUser, // Verifica que el usuario esté autenticado
  validateCreateTicket, // Valida el cuerpo de la solicitud
  createTicket
);

// Ruta para actualizar un ticket (solo administradores)
router.put(
  "/:id",
  authenticateUser, // Verifica que el usuario esté autenticado
  isAdmin, // Verifica que el usuario sea administrador
  validateUpdateTicket, // Valida el cuerpo de la solicitud
  updateTicket
);

export default router;
