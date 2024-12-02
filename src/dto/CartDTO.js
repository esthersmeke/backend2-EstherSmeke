import ProductDTO from "./ProductDTO.js";

export default class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map((item) => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity,
      isAvailable: item.product.status && item.product.stock > 0,
    }));
    this.totalItems = this.products.reduce(
      (total, item) => total + item.quantity,
      0
    );
    this.totalPrice = this.products.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );
  }
}
