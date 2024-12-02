import * as CartService from "../services/cartService.js";
import TicketDTO from "../dto/TicketDTO.js";

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

    res.status(200).json({ status: "success", payload: cart }); // El servicio ya devuelve CartDTO
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
    res.status(200).json({ status: "success", payload: cart }); // CartDTO aplicado en el servicio
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito: " + error.message,
    });
  }
};

// Agregar un producto al carrito (solo usuario autenticado)
// En el controlador, pasa `req.user.id` como argumento al servicio:
export const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Obtén el `userId` del JWT en el controlador
    const { cid, pid } = req.params;

    // Llamamos al servicio pasando `userId`, `cid` y `pid`
    const updatedCart = await CartService.addProductToCart(userId, cid, pid);

    res.status(200).json({
      status: "success",
      message: "Producto agregado al carrito",
      payload: updatedCart, // El DTO ya aplicado en el servicio
    });
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
        .json({ status: "error", message: "La cantidad debe ser mayor a 0" });
    }

    const updatedCart = await CartService.updateProductQuantity(
      cid,
      pid,
      quantity
    );

    res.status(200).json({
      status: "success",
      payload: updatedCart, // CartDTO aplicado en el servicio
    });
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

    res.status(200).json({
      status: "success",
      payload: updatedCart, // CartDTO aplicado en el servicio
    });
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

    res.status(200).json({
      status: "success",
      payload: clearedCart, // CartDTO aplicado en el servicio
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al vaciar el carrito: " + error.message,
    });
  }
};

// Procesar la compra del carrito
export const processPurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email;

    const result = await CartService.processPurchase(cid, purchaserEmail);

    res.status(200).json({
      status: "success",
      message: result.message,
      ticket: result.ticket ? new TicketDTO(result.ticket) : null,
      nonProcessedItems: result.nonProcessedItems,
      messageForNonProcessedItems: result.messageForNonProcessedItems,
    });
  } catch (error) {
    console.error("Error al procesar la compra:", error.message);
    res.status(500).json({
      status: "error",
      message: "Hubo un error al procesar la compra. Inténtalo de nuevo.",
      error: error.message,
    });
  }
};
