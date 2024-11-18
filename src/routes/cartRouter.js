import express from "express";
import {
  getProductsFromCartByID,
  createCart,
  addProductToCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
} from "../controllers/cartController.js";
import passport from "passport";
import { authorizeRole } from "../middlewares/accessControl.js";

const router = express.Router();

// Ruta para obtener los productos de un carrito por ID (autenticación opcional)
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  getProductsFromCartByID
);

// Ruta para crear un nuevo carrito (solo usuarios)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  createCart
);

// Ruta para agregar un producto a un carrito (solo usuarios)
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  addProductToCart
);

// Ruta para actualizar la cantidad de un producto en el carrito (solo usuarios)
router.put(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRole("user"),
  updateProductQuantity
);

// Ruta para eliminar un producto de un carrito (solo usuarios)
router.delete(
  "/:cid/product/:pid",
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
