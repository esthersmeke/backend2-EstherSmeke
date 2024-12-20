import { Router } from "express";
import {
  getCartById,
  createCart,
  addProductToCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
  processPurchase,
} from "../controllers/carts.controller.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  validateCreateCart,
  validateAddProductToCart,
  validateUpdateProductQuantity,
  validateCartPurchase,
} from "../middlewares/validations.js";

const router = Router();

// Obtener carrito por ID (solo usuario autenticado)
router.get("/:cid", authenticateUser, authorizeRole("user"), getCartById);

// Crear un nuevo carrito
router.post("/", authenticateUser, validateCreateCart, createCart);

// Agregar producto al carrito
router.post(
  "/:cid/products/:pid",
  authenticateUser,
  authorizeRole("user"),
  validateAddProductToCart,
  addProductToCart
);

// Actualizar cantidad de un producto en el carrito
router.put(
  "/:cid/products/:pid",
  authenticateUser,
  authorizeRole("user"),
  validateUpdateProductQuantity,
  updateProductQuantity
);

// Eliminar producto del carrito
router.delete(
  "/:cid/products/:pid",
  authenticateUser,
  authorizeRole("user"),
  deleteProductFromCart
);

// Vaciar carrito
router.delete("/:cid", authenticateUser, authorizeRole("user"), clearCart);

// Procesar la compra de un carrito
router.post(
  "/:cid/purchase",
  authenticateUser,
  validateCartPurchase,
  processPurchase
);

export default router;
