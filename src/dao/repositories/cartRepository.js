import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js"; // Para consultas relacionadas a productos

class CartRepository {
  // Obtener productos de un carrito por ID
  async getProductsFromCartById(cid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }
      return cart; // Devolver datos "en bruto" al servicio
    } catch (error) {
      console.error(`Error al buscar carrito por ID: ${error.message}`);
      throw new Error(
        "Error al buscar el carrito. ID inválido o no encontrado."
      );
    }
  }

  // Crear un nuevo carrito
  async createCart(userId) {
    try {
      const newCart = new cartModel({ userId, products: [] });
      return await newCart.save(); // Devolver el carrito creado directamente
    } catch (error) {
      console.error(`Error al crear un carrito: ${error.message}`);
      throw new Error(
        "Error al crear un carrito. Por favor, inténtelo de nuevo."
      );
    }
  }

  // Agregar un producto a un carrito
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

      const product = await productModel.findById(pid);
      if (!product || !product.status) {
        throw new Error(`Producto con ID ${pid} no encontrado o inactivo.`);
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === pid
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      console.error(`Error al agregar producto al carrito: ${error.message}`);
      throw new Error(
        "Error al agregar producto al carrito. Inténtelo de nuevo."
      );
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === pid
      );

      if (productIndex === -1) {
        throw new Error(`Producto con ID ${pid} no encontrado en el carrito.`);
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      return await cart.populate("products.product");
    } catch (error) {
      console.error(
        `Error al actualizar la cantidad del producto: ${error.message}`
      );
      throw new Error(
        "Error al actualizar la cantidad del producto. Inténtelo de nuevo."
      );
    }
  }

  // Eliminar un producto de un carrito
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== pid
      );

      await cart.save();
      return cart;
    } catch (error) {
      console.error(`Error al eliminar producto del carrito: ${error.message}`);
      throw new Error(
        "Error al eliminar producto del carrito. Inténtelo de nuevo."
      );
    }
  }

  // Vaciar un carrito
  async clearCart(cid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado.`);

      cart.products = [];
      return await cart.save();
    } catch (error) {
      console.error(`Error al vaciar carrito: ${error.message}`);
      throw new Error("Error al vaciar el carrito. Inténtelo de nuevo.");
    }
  }

  // Actualizar un carrito
  async update(cid, updateData) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cid, updateData, {
        new: true,
      });
      if (!updatedCart) {
        throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }
      return updatedCart;
    } catch (error) {
      console.error(`Error al actualizar carrito: ${error.message}`);
      throw new Error("Error al actualizar el carrito. Inténtelo de nuevo.");
    }
  }

  // Encontrar un carrito por ID
  async getCartById(cid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }
      return cart;
    } catch (error) {
      console.error(`Error al buscar carrito por ID: ${error.message}`);
      throw new Error(
        "Error al buscar el carrito. ID inválido o no encontrado."
      );
    }
  }

  // Obtener todos los carritos
  async findAll() {
    try {
      return await cartModel.find().populate("products.product"); // Eliminamos `select`
    } catch (error) {
      console.error(`Error al obtener todos los carritos: ${error.message}`);
      throw new Error("Error al obtener los carritos. Inténtelo de nuevo.");
    }
  }
}

export default new CartRepository();
