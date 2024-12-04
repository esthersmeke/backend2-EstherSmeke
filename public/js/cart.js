document.addEventListener("DOMContentLoaded", () => {
  const cartId = document.getElementById("cart-id")?.value;
  let cartData = null; // Cache cart data locally

  fetchCart(cartId);

  async function fetchCart(cartId) {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Error al obtener el carrito");

    const cartResponse = await response.json();

    // Validar que los productos estén populados
    const allProductsValid = cartResponse.products.every(
      (item) => item.product && item.product.title && item.product.price
    );

    // Guardar cartData localmente para usar en otras funciones
    cartData = cartResponse;

    // Renderizar los datos en la UI
    updateCartUI(cartData);
  }

  function updateCartUI(cartData) {
    const cartContainer = document.querySelector(".products-box");
    const cartSummary = document.querySelector(".cart-summary");

    if (!cartContainer || !cartSummary) {
      console.error("Error: Faltan elementos en el DOM.");
      return;
    }

    if (!cartData.products || cartData.products.length === 0) {
      cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
      cartSummary.innerHTML = `
        <h2>Resumen del Carrito</h2>
        <p>Total de productos: 0</p>
        <p>Total a pagar: $0</p>
      `;
      return;
    }

    // Actualizar productos individualmente
    cartData.products.forEach((item) => {
      const existingProductCard = document.querySelector(
        `[data-product-id="${item.product._id}"]`
      );

      if (existingProductCard) {
        existingProductCard.querySelector(".product-quantity").textContent =
          item.quantity;
        existingProductCard.querySelector(
          ".product-total-price"
        ).textContent = `$ ${(item.quantity * item.product.price).toFixed(2)}`;
      } else {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-product-id", item.product._id);
        productCard.innerHTML = `
          <h3>${item.product.title}</h3>
          <p>Categoría: ${item.product.category || "Sin categoría"}</p>
          <p>Precio: $${item.product.price}</p>
          <p>Cantidad: <span class="product-quantity">${
            item.quantity
          }</span></p>
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
      }
    });

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
    } catch (error) {
      console.error("Error al actualizar cantidad:", error.message);
      alert("Hubo un error al sincronizar los cambios.");
      fetchCart(cartId);
    }
  };

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
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      fetchCart(cartId);
    }
  };

  window.clearCart = async function (cartId) {
    cartData = { products: [], totalItems: 0, totalPrice: 0 };
    updateCartUI(cartData);

    try {
      await fetch(`/api/carts/${cartId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al vaciar el carrito:", error.message);
      fetchCart(cartId);
    }
  };

  window.proceedToCheckout = async function (cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al procesar la compra");

      const data = await response.json();

      // Redirige al usuario al detalle del ticket
      window.location.href = `/ticket/${data.ticket.id}`;
    } catch (error) {
      console.error("Error al finalizar la compra:", error.message);
      alert(
        "Hubo un error al procesar tu compra. Por favor, intenta de nuevo."
      );
    }
  };
});
