import express from "express";
import passport from "passport";
import {
  getProductsFromCartByID,
  createCart,
  addProductToCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { authorizeRole } from "../middlewares/accessControl.js";

const router = express.Router();

// Ruta para obtener productos de un carrito (autenticación opcional)
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  getProductsFromCartByID
);

// Ruta para crear un carrito (solo usuarios)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  createCart
);

// Ruta para agregar producto al carrito (solo usuarios)
router.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  addProductToCart
);

// Ruta para actualizar cantidad de producto (solo usuarios)
router.put(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  updateProductQuantity
);

// Ruta para eliminar un producto del carrito (solo usuarios)
router.delete(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  deleteProductFromCart
);

// Ruta para vaciar un carrito (solo usuarios)
router.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  clearCart
);

export default router;
