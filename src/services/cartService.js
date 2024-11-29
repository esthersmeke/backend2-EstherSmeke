import cartRepository from "../dao/repositories/cartRepository.js";
import * as productService from "../services/productService.js";
import TicketService from "./ticketService.js";

export const getCartById = async (cid) => {
  try {
    return await cartRepository.getProductsFromCartById(cid); // Usamos la lógica existente
  } catch (error) {
    throw new Error(
      `Error al obtener el carrito con ID ${cid}: ${error.message}`
    );
  }
};

// Crear un nuevo carrito
export const createCart = async () => {
  try {
    return await cartRepository.createCart();
  } catch (error) {
    throw new Error("Error al crear un nuevo carrito: " + error.message);
  }
};

// Agregar un producto a un carrito
export const addProductToCart = async (cid, pid) => {
  try {
    const product = await productService.getProductById(pid);
    if (!product) {
      throw new Error(`El producto con ID ${pid} no existe`);
    }

    return await cartRepository.addProductToCart(cid, pid);
  } catch (error) {
    throw new Error(
      `Error al agregar el producto al carrito: ${error.message}`
    );
  }
};

// Actualizar un producto de un carrito
export const updateProductQuantity = async (cid, pid, quantity) => {
  try {
    const cart = await cartRepository.updateProductQuantity(cid, pid, quantity);

    if (!cart)
      throw new Error(
        "El carrito no existe o el producto no está en el carrito."
      );

    // Recalcular el precio total
    const totalPrice = cart.products.reduce((sum, item) => {
      if (item.product && item.product.price) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);

    return { ...cart.toObject(), totalPrice };
  } catch (error) {
    throw new Error(
      `Error al actualizar la cantidad del producto: ${error.message}`
    );
  }
};

// Eliminar un producto de un carrito
export const deleteProductFromCart = async (cid, pid) => {
  try {
    // Eliminar el producto del carrito
    const cart = await cartRepository.deleteProductFromCart(cid, pid);

    if (!cart) throw new Error("Carrito no encontrado");

    // Recalcular el precio total
    const totalPrice = cart.products.reduce((sum, item) => {
      if (item.product && item.product.price) {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);

    return { ...cart.toObject(), totalPrice };
  } catch (error) {
    throw new Error(
      `Error al eliminar el producto del carrito: ${error.message}`
    );
  }
};

// Vaciar un carrito
export const clearCart = async (cid) => {
  try {
    return await cartRepository.clearCart(cid);
  } catch (error) {
    throw new Error(
      `Error al vaciar el carrito con ID ${cid}: ${error.message}`
    );
  }
};

// Procesar una compra
// Procesar una compra
export const processPurchase = async (cid, purchaserEmail) => {
  try {
    // Obtener el carrito con los productos y sus detalles
    const cart = await cartRepository.findById(cid);
    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    const nonProcessedItems = [];
    const purchasedItems = [];
    let totalAmount = 0;

    // Verificar disponibilidad de stock y actualizar el stock de los productos comprados
    for (const item of cart.products) {
      const product = item.product;

      if (product.stock >= item.quantity) {
        // Reducir stock del producto
        product.stock -= item.quantity;
        await product.save();

        // Calcular el total de la compra
        totalAmount += product.price * item.quantity;

        // Agregar a los productos comprados
        purchasedItems.push({
          product: {
            id: product._id,
            title: product.title,
          },
          quantity: item.quantity,
          price: product.price,
        });
      } else {
        // Agregar a los productos no procesados si no hay stock suficiente
        nonProcessedItems.push({
          productId: product._id,
          title: product.title,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
          message: "Stock insuficiente",
        });
      }
    }

    // Crear ticket solo si se procesaron productos
    let ticketData = null;
    if (purchasedItems.length > 0) {
      ticketData = await TicketService.createTicket({
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: purchaserEmail,
        purchasedItems,
        unprocessedItems: nonProcessedItems, // Pasamos los productos no procesados
      });
    }

    // Actualizar el carrito con los productos no procesados
    cart.products = nonProcessedItems.map((item) => ({
      product: item.productId,
      quantity: item.requestedQuantity,
    }));
    await cart.save();

    return {
      message: "Compra procesada exitosamente",
      ticket: ticketData,
      nonProcessedItems,
      messageForNonProcessedItems:
        nonProcessedItems.length > 0
          ? "Algunos productos no pudieron ser comprados debido a la falta de stock."
          : null,
    };
  } catch (error) {
    console.error("Error al procesar la compra:", error.message);
    throw new Error("Error al procesar la compra. Inténtalo nuevamente.");
  }
};
