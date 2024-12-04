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

// Obtener historial de compras de un usuario
router.get(
  "/history/:purchaser",
  authenticateUser, // Verifica que el usuario esté autenticado
  validateMongoId("purchaser"), // Valida el parámetro purchaser
  getPurchaseHistory
);

// Obtener todos los tickets (solo administradores)
router.get(
  "/",
  authenticateUser, // Verifica que el usuario esté autenticado
  isAdmin, // Verifica que el usuario sea administrador
  getAllTickets
);

// Obtener un ticket por ID
router.get(
  "/:id",
  authenticateUser, // Verifica que el usuario esté autenticado
  validateMongoId("id"), // Valida que el ID sea un ID de MongoDB válido
  getTicketById
);

// Crear un nuevo ticket
router.post(
  "/",
  authenticateUser, // Verifica que el usuario esté autenticado
  validateCreateTicket, // Valida el cuerpo de la solicitud
  createTicket
);

// Actualizar un ticket (solo administradores)
router.put(
  "/:id",
  authenticateUser, // Verifica que el usuario esté autenticado
  isAdmin, // Verifica que el usuario sea administrador
  validateUpdateTicket, // Valida el cuerpo de la solicitud
  updateTicket
);

export default router;
