class CartDTO {
  constructor(cart) {
    this.id = cart._id;
    this.products = cart.products.map((item) => ({
      productId: item.product?._id || null,
      title: item.product?.title || "Producto eliminado",
      quantity: item.quantity,
    }));
    this.totalItems = this.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.totalPrice = cart.products.reduce(
      (sum, item) =>
        item.product ? sum + item.product.price * item.quantity : sum,
      0
    );
  }
}

export default CartDTO;
