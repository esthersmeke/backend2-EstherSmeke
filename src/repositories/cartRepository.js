import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";
import mongoose from "mongoose";

// Obtener productos de un carrito por ID
export const getProductsFromCartByID = async (cartId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error("El ID del carrito no es válido");
    }
    const cart = await cartModel.findById(cartId).populate("products.product");
    if (!cart) {
      throw new Error(`El carrito con ID ${cartId} no existe`);
    }
    return cart;
  } catch (error) {
    throw new Error(
      `Error al obtener los productos del carrito: ${error.message}`
    );
  }
};

// Crear un nuevo carrito
export const createCart = async () => {
  try {
    const newCart = new cartModel({ products: [] });
    await newCart.save();
    return newCart;
  } catch (error) {
    throw new Error(`Error al crear el carrito: ${error.message}`);
  }
};

// Agregar un producto a un carrito
// Agregar un producto a un carrito
export const addProductToCart = async (cartId, productId) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new Error("El ID del carrito o del producto no es válido");
    }

    // Buscar el carrito por ID
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error(`El carrito con ID ${cartId} no existe`);
    }

    // Verificar si el producto existe
    const product = await productModel.findById(productId);
    if (!product) {
      throw new Error(`El producto con ID ${productId} no existe`);
    }

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Incrementar la cantidad si el producto ya existe
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Agregar el producto como nuevo si no existe
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    // Guardar el carrito actualizado
    await cart.save();

    // Devolver el carrito actualizado con populate
    return await cartModel.findById(cartId).populate("products.product");
  } catch (error) {
    throw new Error(
      `Error al agregar el producto al carrito: ${error.message}`
    );
  }
};

// Eliminar un producto de un carrito
export const deleteProductFromCart = async (cartId, productId) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(cartId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      throw new Error("El ID del carrito o del producto no es válido");
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error(`El carrito con ID ${cartId} no existe`);
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    return await cartModel.findById(cartId).populate("products.product");
  } catch (error) {
    throw new Error(
      `Error al eliminar el producto del carrito: ${error.message}`
    );
  }
};

// Vaciar un carrito
export const clearCart = async (cartId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error("El ID del carrito no es válido");
    }

    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error(`El carrito con ID ${cartId} no existe`);
    }

    cart.products = [];
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Error al vaciar el carrito: ${error.message}`);
  }
};
