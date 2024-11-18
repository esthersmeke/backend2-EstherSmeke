import * as cartService from "../services/cartService.js";
import mongoose from "mongoose";
import CartDTO from "../dto/CartDTO.js";

// Obtener todos los productos de un carrito por ID
export const getProductsFromCartByID = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res
        .status(400)
        .json({ status: "error", message: "El ID del carrito no es válido" });
    }

    const cart = await cartService.getProductsFromCartByID(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: new CartDTO(cart),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener productos del carrito: " + error.message,
    });
  }
};

// Crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json({
      status: "success",
      payload: new CartDTO(newCart),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito: " + error.message,
    });
  }
};

// Agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Uno o ambos IDs no son válidos" });
    }

    const updatedCart = await cartService.addProductToCart(cid, pid);

    res.status(200).json({
      status: "success",
      payload: new CartDTO(updatedCart),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar el producto al carrito: " + error.message,
    });
  }
};

// Actualizar cantidad de producto en el carrito
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "La cantidad debe ser mayor a 0" });
    }

    const updatedCart = await cartService.updateProductQuantity(
      cid,
      pid,
      quantity
    );

    res.status(200).json({
      status: "success",
      payload: new CartDTO(updatedCart),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
};

// Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await cartService.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );

    if (!cart) {
      return res.status(404).json({
        message:
          "El carrito o el producto especificado no existe o son inválidos",
      });
    }

    res.status(200).json({
      status: "success",
      payload: new CartDTO(cart),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito",
    });
  }
};

// Vaciar un carrito
export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.cid);

    if (!cart) {
      return res.status(404).json({
        message: "El carrito especificado no existe o el ID es inválido",
      });
    }

    res.status(200).json({
      status: "success",
      payload: new CartDTO(cart),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al vaciar el carrito",
    });
  }
};
