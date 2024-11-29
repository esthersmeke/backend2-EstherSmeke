// Exportar modelos
import cartModel from "./models/cartModel.js";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";

// Exportar funciones de los repositorios
import * as cartRepository from "./repositories/cartRepository.js";
import * as productRepository from "./repositories/productRepository.js";
import UserRepository from "./repositories/userRepository.js";

export default {
  models: {
    cartModel,
    productModel,
    userModel,
  },
  repositories: {
    cartRepository,
    productRepository,
    UserRepository,
  },
};
