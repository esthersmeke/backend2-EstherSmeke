import * as cartRepository from "../repositories/cartRepository.js";
import * as productService from "../services/productService.js"; // Validar producto
import cartModel from "../dao/models/cartModel.js"; // Importación predeterminada

// Obtener productos de un carrito por ID
export const getProductsFromCartByID = async (cartId) => {
  try {
    return await cartRepository.getProductsFromCartByID(cartId);
  } catch (error) {
    throw new Error(
      `Error al obtener productos del carrito con ID ${cartId}: ${error.message}`
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
export const addProductToCart = async (cartId, productId) => {
  try {
    // Verificar si el producto existe
    const product = await productService.getProductByID(productId);
    if (!product) {
      throw new Error(`El producto con ID ${productId} no existe`);
    }

    return await cartRepository.addProductToCart(cartId, productId);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Actualizar un producto de un carrito
export const updateProductQuantity = async (cartId, productId, quantity) => {
  try {
    const cart = await cartModel.findById(cartId);

    if (!cart) throw new Error(`El carrito con ID ${cartId} no existe`);

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error(
        `El producto con ID ${productId} no se encuentra en el carrito`
      );
    }

    // Actualizar la cantidad del producto
    cart.products[productIndex].quantity = quantity;
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error(
      `Error al actualizar la cantidad del producto en el carrito: ${error.message}`
    );
  }
};

// Eliminar un producto de un carrito
export const deleteProductFromCart = async (cartId, productId) => {
  try {
    return await cartRepository.deleteProductFromCart(cartId, productId);
  } catch (error) {
    throw new Error(
      `Error al eliminar el producto con ID ${productId} del carrito con ID ${cartId}: ${error.message}`
    );
  }
};

// Vaciar un carrito
export const clearCart = async (cartId) => {
  try {
    return await cartRepository.clearCart(cartId);
  } catch (error) {
    throw new Error(
      `Error al vaciar el carrito con ID ${cartId}: ${error.message}`
    );
  }
};
