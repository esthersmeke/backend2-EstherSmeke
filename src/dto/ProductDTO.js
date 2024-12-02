export default class ProductDTO {
  constructor(product) {
    this._id = product?._id || null;
    this.title = product?.title || "Título no disponible";
    this.description = product?.description || "Descripción no disponible";
    this.code = product?.code || "Código no disponible";
    this.price = product?.price || 0;
    this.stock = product?.stock || 0;
    this.category = product?.category || "Categoría no disponible";
    this.thumbnails = product?.thumbnails?.length
      ? product.thumbnails
      : ["default-thumbnail.jpg"];
    this.status = product?.status || true;
  }
}
