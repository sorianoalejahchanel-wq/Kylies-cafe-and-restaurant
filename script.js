document.addEventListener("DOMContentLoaded", () => {
  const cart = [];
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutMessage = document.getElementById("checkout-message");

  const formatCurrency = (value) => `₱${value.toFixed(2)}`;

  const renderCart = () => {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = '<li class="empty">Your cart is empty. Start with a favorite drink or meal.</li>';
      cartTotal.textContent = formatCurrency(0);
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatCurrency(total);

    cart.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      `;
      cartItems.appendChild(listItem);
    });
  };

  document.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      const existing = cart.find((item) => item.name === name);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      renderCart();
      checkoutMessage.classList.add("hidden");
    });
  });

  clearCartButton.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
    checkoutMessage.classList.add("hidden");
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      checkoutMessage.textContent = "Please add at least one item to your cart before placing your order.";
      checkoutMessage.classList.remove("hidden");
      return;
    }

    const customerName = document.getElementById("customer-name").value.trim() || "Guest";
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    checkoutMessage.innerHTML = `Thank you, <strong>${customerName}</strong>! Your order for <strong>${totalItems}</strong> item(s) is being prepared for pickup or delivery.`;
    checkoutMessage.classList.remove("hidden");

    cart.length = 0;
    renderCart();
    checkoutForm.reset();
  });

  renderCart();
});