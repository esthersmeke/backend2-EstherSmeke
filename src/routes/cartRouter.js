import { Router } from "express";
import passport from "passport";
import { requireUserOrAdminRole } from "../middlewares/accessControl.js";
import * as cartController from "../controllers/cartController.js";

const router = Router();

// Ruta para obtener los productos de un carrito por ID
router.get("/:cid", cartController.getProductsFromCartByID);

// Ruta para crear un nuevo carrito
router.post("/", cartController.createCart);

// Ruta para agregar un producto a un carrito
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  requireUserOrAdminRole,
  cartController.addProductToCart
);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  requireUserOrAdminRole,
  cartController.updateProductQuantity
);

// Ruta para eliminar un producto de un carrito
router.delete(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  requireUserOrAdminRole,
  cartController.deleteProductFromCart
);

// Ruta para vaciar un carrito
router.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  requireUserOrAdminRole,
  cartController.clearCart
);

export default router;
