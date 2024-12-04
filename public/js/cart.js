document.addEventListener("DOMContentLoaded", () => {
  // Obtener el ID del carrito desde un elemento oculto
  const cartId = document.getElementById("cart-id")?.value;
  let cartData = null; // Datos del carrito en caché

  // Cargar datos iniciales del carrito
  fetchCart(cartId);

  async function fetchCart(cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener el carrito");

      const cartResponse = await response.json();

      // Validar que los productos tengan información válida
      const allProductsValid = cartResponse.products.every(
        (item) => item.product && item.product.title && item.product.price
      );

      if (!allProductsValid) throw new Error("Datos de productos inválidos");

      // Guardar los datos en caché
      cartData = cartResponse;

      // Actualizar la interfaz
      updateCartUI(cartData);
    } catch (error) {
      alert("Hubo un error al cargar el carrito.");
    }
  }

  function updateCartUI(cartData) {
    const cartContainer = document.querySelector(".products-box");
    const cartSummary = document.querySelector(".cart-summary");

    if (!cartContainer || !cartSummary) {
      alert("No se encontraron los elementos necesarios en el DOM.");
      return;
    }

    // Mostrar un mensaje si el carrito está vacío
    if (!cartData.products || cartData.products.length === 0) {
      cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
      cartSummary.innerHTML = `
        <h2>Resumen del Carrito</h2>
        <p>Total de productos: 0</p>
        <p>Total a pagar: $0</p>
      `;
      return;
    }

    // Renderizar productos en el carrito
    cartContainer.innerHTML = "";
    cartData.products.forEach((item) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-product-id", item.product._id);
      productCard.innerHTML = `
        <h3>${item.product.title}</h3>
        <p>Categoría: ${item.product.category || "Sin categoría"}</p>
        <p>Precio: $${item.product.price}</p>
        <p>Cantidad: <span class="product-quantity">${item.quantity}</span></p>
        <p>Total: <span class="product-total-price">$${(
          item.quantity * item.product.price
        ).toFixed(2)}</span></p>
        <button onclick="window.updateProductQuantity('${cartData._id}', '${
        item.product._id
      }', ${item.quantity + 1})">+</button>
        <button onclick="window.updateProductQuantity('${cartData._id}', '${
        item.product._id
      }', ${item.quantity - 1})">-</button>
        <button onclick="window.removeFromCart('${cartData._id}', '${
        item.product._id
      }')">Eliminar</button>
      `;
      cartContainer.appendChild(productCard);
    });

    // Actualizar el resumen del carrito
    const totalItems = cartData.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = cartData.products.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    cartSummary.innerHTML = `
      <h2>Resumen del Carrito</h2>
      <p>Total de productos: ${totalItems}</p>
      <p>Total a pagar: $${parseFloat(totalPrice).toFixed(2)}</p>
    `;
  }

  // Actualizar cantidad de un producto
  window.updateProductQuantity = async function (
    cartId,
    productId,
    newQuantity
  ) {
    if (newQuantity < 1) return;

    const productIndex = cartData.products.findIndex(
      (item) => item.product._id === productId
    );

    if (productIndex > -1) {
      cartData.products[productIndex].quantity = newQuantity;
      updateCartUI(cartData);
    }

    try {
      await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: "include",
      });
    } catch {
      alert("Error al sincronizar los cambios.");
      fetchCart(cartId);
    }
  };

  // Eliminar un producto del carrito
  window.removeFromCart = async function (cartId, productId) {
    cartData.products = cartData.products.filter(
      (item) => item.product._id !== productId
    );
    updateCartUI(cartData);

    try {
      await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      alert("Error al eliminar el producto.");
      fetchCart(cartId);
    }
  };

  // Vaciar el carrito
  window.clearCart = async function (cartId) {
    cartData = { products: [], totalItems: 0, totalPrice: 0 };
    updateCartUI(cartData);

    try {
      await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      alert("Error al vaciar el carrito.");
      fetchCart(cartId);
    }
  };

  // Procesar la compra
  window.proceedToCheckout = async function (cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      // Redirigir al detalle del ticket
      window.location.href = `/ticket/${data.ticket.id}`;
    } catch {
      alert("Error al procesar la compra. Intenta de nuevo.");
    }
  };
});
