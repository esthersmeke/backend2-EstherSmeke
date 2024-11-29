import { Router } from "express";
import {
  getPurchaseHistory,
  getAllTickets,
  getTicketById,
  updateTicket,
} from "../controllers/ticket.controller.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Ruta para obtener el historial de compras de un usuario
// Requiere autenticación de usuario
router.get("/history/:purchaser", authenticateUser, getPurchaseHistory);

// Ruta para obtener todos los tickets (solo administradores)
// Requiere que el usuario sea administrador
router.get("/", authenticateUser, authorizeRole("admin"), getAllTickets);

// Ruta para obtener un ticket específico por ID (usuario o admin)
// Requiere autenticación de usuario o ser admin
router.get("/:id", authenticateUser, getTicketById);

// Ruta para actualizar un ticket (solo administradores)
router.put("/:id", authenticateUser, authorizeRole("admin"), updateTicket);

export default router;
