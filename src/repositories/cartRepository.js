import cartModel from "../dao/models/cartModel.js"; // Importación predeterminada

// Obtener todos los productos de un carrito por ID
export const getProductsFromCartByID = async (cartId) => {
  try {
    const cart = await cartModel.findById(cartId).populate("products.product");
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  } catch (error) {
    throw new Error("Error al obtener productos del carrito: " + error.message);
  }
};

// Crear un nuevo carrito
export const createCart = async () => {
  try {
    const newCart = await cartModel.create({ products: [] });
    return newCart;
  } catch (error) {
    throw new Error("Error al crear el carrito: " + error.message);
  }
};

// Agregar un producto a un carrito
export const addProductToCart = async (cartId, productId) => {
  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(
      "Error al agregar el producto al carrito: " + error.message
    );
  }
};

export const deleteProductFromCart = async (cartId, productId) => {
  try {
    // Busca el carrito por su ID
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // Filtra los productos para eliminar el que coincide con productId
    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    // Guarda los cambios
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(
      `Error al eliminar el producto con ID ${productId} del carrito con ID ${cartId}: ${error.message}`
    );
  }
};

export const clearCart = async (cartId) => {
  try {
    // Busca el carrito por su ID
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // Limpia el array de productos
    cart.products = [];

    // Guarda los cambios
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(
      `Error al vaciar el carrito con ID ${cartId}: ${error.message}`
    );
  }
};
