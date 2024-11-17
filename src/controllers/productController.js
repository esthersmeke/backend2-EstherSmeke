import * as productService from "../services/productService.js";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    // Obtener productos desde el servicio
    const products = await productService.getAllProducts(req.query);

    // Verificar si se obtuvieron productos
    if (!products.docs || !products.docs.length) {
      return res.status(404).json({
        status: "error",
        message: "No se encontraron productos para los criterios aplicados",
      });
    }

    // Respuesta exitosa con los productos
    res.status(200).json({
      status: "success",
      payload: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor: " + error.message,
    });
  }
};

export const getProductByID = async (req, res) => {
  try {
    const { pid } = req.params;

    // Validación de ID de producto
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res
        .status(400)
        .json({ status: "error", message: "El ID del producto no es válido" });
    }

    const product = await productService.getProductByID(pid);

    // Verificar si se encuentra el producto
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    // Respuesta exitosa con el producto
    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el producto por ID: " + error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title = faker.commerce.productName(), // Generar título con Faker
      description = faker.commerce.productDescription(),
      code = faker.string.uuid(), // Generar un código único
      price = faker.commerce.price(10, 1000),
      stock = faker.number.int({ min: 1, max: 100 }),
      category = faker.commerce.department(),
      thumbnails = [faker.image.url()],
    } = req.body;

    // Crear nuevo producto
    const newProduct = await productService.createProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    });

    // Respuesta exitosa con el nuevo producto
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    // Error específico al crear el producto
    res.status(400).json({
      status: "error",
      message: "Error al crear el producto: " + error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Si hay archivos, los asignamos a los thumbnails
    if (req.files) {
      req.body.thumbnails = req.files.map((file) => file.filename);
    }

    // Actualizar producto
    const updatedProduct = await productService.updateProduct(
      req.params.pid,
      req.body
    );

    // Respuesta exitosa con el producto actualizado
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    // Error específico al actualizar el producto
    res.status(400).json({
      status: "error",
      message: "Error al actualizar el producto: " + error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // Eliminar producto
    const deletedProduct = await productService.deleteProduct(req.params.pid);

    // Respuesta exitosa con el producto eliminado
    res.status(200).json({ status: "success", payload: deletedProduct });
  } catch (error) {
    // Error específico al eliminar el producto
    res.status(400).json({
      status: "error",
      message: "Error al eliminar el producto: " + error.message,
    });
  }
};
