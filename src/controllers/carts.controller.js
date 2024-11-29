import * as CartService from "../services/cartService.js";
import CartDTO from "../dto/CartDTO.js";

// Obtener productos de un carrito por ID
export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.status(200).json({ status: "success", payload: new CartDTO(cart) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el carrito: " + error.message,
    });
  }
};

// Crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Usuario no autenticado" });
    }

    const cart = await CartService.createCart(req.user.id); // Asociar carrito al usuario
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito: " + error.message,
    });
  }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Usar los nombres correctos

    if (!cid || !pid) {
      return res
        .status(400)
        .json({ status: "error", message: "Faltan IDs requeridos" });
    }

    const updatedCart = await CartService.addProductToCart(cid, pid);

    res
      .status(200)
      .json({ status: "success", payload: new CartDTO(updatedCart) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al agregar el producto al carrito: " + error.message,
    });
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "La cantidad debe ser mayor a 0" });
    }

    const updatedCart = await CartService.updateProductQuantity(
      cid,
      pid,
      quantity
    );

    res
      .status(200)
      .json({ status: "success", payload: new CartDTO(updatedCart) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        "Error al actualizar la cantidad del producto en el carrito: " +
        error.message,
    });
  }
};

// Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await CartService.deleteProductFromCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });
    }

    res
      .status(200)
      .json({ status: "success", payload: new CartDTO(updatedCart) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar el producto del carrito: " + error.message,
    });
  }
};

// Vaciar un carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const clearedCart = await CartService.clearCart(cid);

    if (!clearedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res
      .status(200)
      .json({ status: "success", payload: new CartDTO(clearedCart) });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al vaciar el carrito: " + error.message,
    });
  }
};

// Función para procesar la compra del carrito
export const processPurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email; // Obtén el email del usuario autenticado

    // Procesamos la compra utilizando el servicio de carrito
    const result = await CartService.processPurchase(
      cid, // Pasar solo el cid
      purchaserEmail // Pasar el email del comprador
    );

    res.status(200).json({
      message: result.message, // Usar result en lugar de purchaseResult
      ticket: result.ticket,
      nonProcessedItems: result.nonProcessedItems,
      messageForNonProcessedItems: result.messageForNonProcessedItems,
    });
  } catch (error) {
    console.error("Error al procesar la compra:", error.message);
    res.status(500).json({
      message: "Hubo un error al procesar la compra. Inténtalo de nuevo.",
    });
  }
};
