import cartModel from "../models/cartModel.js";
import * as productService from "../../services/productService.js";

class CartRepository {
  // Obtener productos de un carrito por ID
  async getProductsFromCartById(cid) {
    try {
      // Asegúrate de que no estás usando .lean() en este punto
      const cart = await cartModel
        .findById(cid)
        .populate("products.product", "title price stock");

      // Verifica si el carrito fue encontrado
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }

      return cart;
    } catch (error) {
      console.error("Error al obtener productos del carrito:", error.message);
      throw new Error("Error al obtener productos del carrito.");
    }
  }

  // Crear un nuevo carrito
  async createCart() {
    try {
      const newCart = new cartModel({ products: [] });
      return await newCart.save();
    } catch (error) {
      console.error("Error al crear un carrito:", error.message);
      throw new Error("Error al crear un carrito.");
    }
  }

  // Agregar un producto a un carrito
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel
        .findById(cid)
        .populate("products.product", "title price stock");

      if (!cart) throw new Error("Carrito no encontrado.");

      const product = await productService.getProductById(pid);
      if (!product) throw new Error(`Producto con ID ${pid} no encontrado`);

      // Comprobar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === pid
      );

      if (existingProductIndex >= 0) {
        // Incrementar la cantidad si el producto ya existe en el carrito
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({ product: pid, quantity: 1 });
      }

      // Guardar los cambios en el carrito
      const updatedCart = await cart.save();

      // Rehacer el populate después de guardar el carrito
      await updatedCart.populate("products.product", "title price stock");

      return updatedCart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw new Error("Error al agregar producto al carrito.");
    }
  }

  // Actualizar la cantidad de un producto en un carrito
  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");

      if (!cart) throw new Error(`El carrito con ID ${cid} no existe`);

      const productIndex = cart.products.findIndex(
        (item) => item.product && item.product._id.toString() === pid
      );

      if (productIndex === -1) {
        throw new Error(`El producto con ID ${pid} no está en el carrito`);
      }

      // Actualiza la cantidad del producto
      cart.products[productIndex].quantity = quantity;

      // Guarda los cambios en la base de datos
      await cart.save();

      // Rehacer el `populate` después de guardar
      await cart.populate("products.product");

      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad: ${error.message}`);
    }
  }

  // Eliminar un producto de un carrito
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");

      if (!cart) throw new Error(`El carrito con ID ${cid} no existe`);

      // Filtrar el producto que debe ser eliminado
      cart.products = cart.products.filter(
        (item) => item.product && item.product._id.toString() !== pid
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al eliminar producto del carrito: ${error.message}`
      );
    }
  }

  // Vaciar un carrito
  async clearCart(cid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) throw new Error(`El carrito con ID ${cid} no existe`);

      cart.products = [];
      return await cart.save();
    } catch (error) {
      console.error("Error al vaciar carrito:", error.message);
      throw new Error("Error al vaciar carrito.");
    }
  }

  // Actualizar un carrito
  async update(cid, updateData) {
    try {
      return await cartModel.findByIdAndUpdate(cid, updateData, {
        new: true,
      });
    } catch (error) {
      console.error("Error al actualizar carrito:", error.message);
      throw new Error("Error al actualizar carrito.");
    }
  }

  // Encontrar un carrito por ID
  async findById(cid) {
    try {
      // Verifica si el carrito fue encontrado
      const cart = await cartModel.findById(cid).populate("products.product");

      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado.`);
      }

      return cart;
    } catch (error) {
      console.error("Error al buscar carrito por ID:", error.message);
      throw new Error("Error al buscar carrito.");
    }
  }
  async findAll() {
    try {
      return await cartModel.find().populate("products.product");
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error.message);
      throw new Error("Error al obtener los carritos.");
    }
  }
}

export default new CartRepository();
