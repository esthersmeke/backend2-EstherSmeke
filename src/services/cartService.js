import cartRepository from "../dao/repositories/cartRepository.js";
import ProductDTO from "../dto/ProductDTO.js";
import CartDTO from "../dto/CartDTO.js";
import ticketService from "./ticketService.js";

export const createCart = async (userId) => {
  try {
    const newCart = await cartRepository.createCart(userId); // Usar el repositorio para crear el carrito
    return newCart; // Devolver el carrito creado
  } catch (error) {
    throw new Error(`Error al crear un carrito: ${error.message}`);
  }
};
export const getCartById = async (cartId) => {
  try {
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error(`Carrito con ID ${cartId} no encontrado`);
    }

    // Aplicar DTO solo al final del flujo
    cart.products = cart.products.map((item) => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity,
    }));

    return new CartDTO(cart);
  } catch (error) {
    throw new Error(
      `Error al obtener el carrito con ID ${cartId}: ${error.message}`
    );
  }
};

// En el servicio, cambia el código para usar `userId` como argumento:
export const addProductToCart = async (userId, cid, pid) => {
  try {
    const cart = await cartRepository.getCartById(cid); // Obtén el carrito por el `cid`
    if (!cart) {
      throw new Error("No se pudo encontrar el carrito.");
    }

    // Verifica si el carrito pertenece al usuario actual
    if (cart.userId.toString() !== userId) {
      throw new Error("Este carrito no pertenece al usuario.");
    }

    const updatedCart = await cartRepository.addProductToCart(cid, pid); // Agrega el producto al carrito

    // Aplicar DTO solo al final del flujo
    updatedCart.products = updatedCart.products.map((item) => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity,
    }));

    return new CartDTO(updatedCart); // Retorna el carrito con el DTO aplicado
  } catch (error) {
    throw new Error(`Error al agregar producto al carrito: ${error.message}`);
  }
};

export const updateProductQuantity = async (cid, pid, quantity) => {
  try {
    const cart = await cartRepository.updateProductQuantity(cid, pid, quantity);
    if (!cart) {
      throw new Error(`No se encontró el carrito o el producto con ID ${pid}`);
    }

    // Aplicar DTO solo al final del flujo
    cart.products = cart.products.map((item) => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity,
    }));

    return new CartDTO(cart);
  } catch (error) {
    throw new Error(
      `Error al actualizar la cantidad del producto: ${error.message}`
    );
  }
};

export const deleteProductFromCart = async (cid, pid) => {
  try {
    const cart = await cartRepository.deleteProductFromCart(cid, pid);
    if (!cart) {
      throw new Error(`No se encontró el carrito con ID ${cid}`);
    }

    // Aplicar DTO solo al final del flujo
    cart.products = cart.products.map((item) => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity,
    }));

    return new CartDTO(cart);
  } catch (error) {
    throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
  }
};

export const clearCart = async (cid) => {
  try {
    const cart = await cartRepository.clearCart(cid);
    if (!cart) {
      throw new Error(`No se encontró el carrito con ID ${cid}`);
    }

    // Aplicar DTO solo al final del flujo
    cart.products = [];
    return new CartDTO(cart);
  } catch (error) {
    throw new Error(
      `Error al vaciar el carrito con ID ${cid}: ${error.message}`
    );
  }
};

export const processPurchase = async (cid, purchaserEmail) => {
  try {
    const cart = await cartRepository.getCartById(cid);
    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    let totalAmount = 0;
    const purchasedItems = [];
    const nonProcessedItems = [];

    for (const item of cart.products) {
      const product = item.product;

      // Manejar productos con precios inválidos
      if (!product.price || product.price <= 0) {
        nonProcessedItems.push({
          product,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
          message: "Precio inválido", // Añadir mensaje indicando el problema
        });
        continue; // Saltar al siguiente producto
      }

      // Procesar productos con stock suficiente
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        totalAmount += product.price * item.quantity;

        purchasedItems.push({
          product,
          quantity: item.quantity,
          price: product.price,
        });

        await product.save(); // Guardar cambios en el stock del producto
      } else {
        // Productos con stock insuficiente
        nonProcessedItems.push({
          product,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
        });
      }
    }

    // Validar que se hayan procesado productos con un monto válido
    if (totalAmount <= 0) {
      throw new Error("El monto total de la compra debe ser mayor a 0.");
    }

    // Actualizar el carrito con productos no procesados
    cart.products = nonProcessedItems.map((item) => ({
      product: item.product.id,
      quantity: item.requestedQuantity,
    }));
    await cart.save();

    // Preparar datos del ticket
    const ticketData = {
      amount: totalAmount,
      purchaser: purchaserEmail,
      purchasedItems: purchasedItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      unprocessedItems: nonProcessedItems.map((item) => ({
        product: item.product._id,
        availableStock: item.availableStock,
        requestedQuantity: item.requestedQuantity,
        message: item.message || "Stock insuficiente",
      })),
    };

    const ticket = await ticketService.createTicket(ticketData);

    return {
      message: "Compra procesada exitosamente.",
      ticket,
      nonProcessedItems: ticketData.unprocessedItems,
      messageForNonProcessedItems: nonProcessedItems.length
        ? "Algunos productos no pudieron ser procesados por falta de stock o precio inválido."
        : null,
    };
  } catch (error) {
    throw new Error(`Error al procesar la compra: ${error.message}`);
  }
};
