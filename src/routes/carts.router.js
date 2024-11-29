import { Router } from "express";
import {
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  clearCart,
  processPurchase,
  updateProductQuantity,
} from "../controllers/carts.controller.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  validateCreateCart,
  validateAddProductToCart,
  validateCartPurchase,
} from "../middlewares/validations.js";

const router = Router();

// Obtener carrito por ID (solo usuario autenticado)
router.get("/:cid", authenticateUser, authorizeRole("user"), getCartById);

// Crear un nuevo carrito
router.post("/", authenticateUser, validateCreateCart, createCart);

// Agregar producto al carrito (solo usuario autenticado)
router.post(
  "/:cid/products/:pid",
  authenticateUser,
  authorizeRole("user"),
  validateAddProductToCart,
  addProductToCart
);

// Actualizar producto del carrito (solo usuario autenticado)
router.put(
  "/:cid/products/:pid",
  authenticateUser,
  authorizeRole("user"),
  updateProductQuantity
);

// Eliminar producto de un carrito
router.delete(
  "/:cid/products/:pid",
  authenticateUser,
  authorizeRole("user"),
  deleteProductFromCart
);

// Vaciar carrito (solo usuario autenticado)
router.delete("/:cid", authenticateUser, authorizeRole("user"), clearCart);

// Procesar la compra de un carrito por ID
router.post(
  "/:cid/purchase",
  authenticateUser,
  validateCartPurchase,
  processPurchase
);

export default router;
