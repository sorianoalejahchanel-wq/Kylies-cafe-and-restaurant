document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // CART ELEMENTS
  // =========================
  const cart = [];

  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");

  // =========================
  // CHECKOUT ELEMENTS
  // =========================
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutMessage = document.getElementById("checkout-message");

  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotalPrice = document.getElementById("checkout-total-price");

  const deliveryFields = document.getElementById("delivery-fields");
  const pickupFields = document.getElementById("pickup-fields");

  const customerAddress = document.getElementById("customer-address");

  const formatCurrency = (value) => {
    return `₱${value.toFixed(2)}`;
  };


  // =========================
  // GET CART TOTAL
  // =========================
  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };


  // =========================
  // GET TOTAL ITEMS
  // =========================
  const getTotalItems = () => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  };


  // =========================
  // RENDER CART
  // =========================
  const renderCart = () => {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

      cartItems.innerHTML =
        '<li class="empty">Your cart is empty. Start with a favorite drink or meal.</li>';

      cartTotal.textContent = formatCurrency(0);

      renderCheckoutPreview();

      return;
    }


    const total = getCartTotal();

    cartTotal.textContent =
      formatCurrency(total);


    cart.forEach((item, index) => {

      const listItem =
        document.createElement("li");

      listItem.innerHTML = `

        <div class="cart-item-info">

          <span>
            ${item.name} × ${item.quantity}
          </span>

          <strong>
            ${formatCurrency(
              item.price * item.quantity
            )}
          </strong>

        </div>

        <div class="cart-item-controls">

          <button
            type="button"
            class="quantity-btn"
            data-action="decrease"
            data-index="${index}">
            −
          </button>

          <span>${item.quantity}</span>

          <button
            type="button"
            class="quantity-btn"
            data-action="increase"
            data-index="${index}">
            +
          </button>

        </div>

      `;

      cartItems.appendChild(listItem);

    });


    // UPDATE CHECKOUT
    renderCheckoutPreview();

  };


  // =========================
  // RENDER CHECKOUT PREVIEW
  // =========================
  const renderCheckoutPreview = () => {

    if (!checkoutItems || !checkoutTotalPrice) {
      return;
    }


    checkoutItems.innerHTML = "";


    if (cart.length === 0) {

      checkoutItems.innerHTML =
        "<p>Your cart is currently empty.</p>";

      checkoutTotalPrice.textContent =
        formatCurrency(0);

      return;

    }


    cart.forEach((item) => {

      const itemElement =
        document.createElement("div");

      itemElement.className =
        "checkout-item";


      itemElement.innerHTML = `

        <span>
          ${item.name} × ${item.quantity}
        </span>

        <strong>
          ${formatCurrency(
            item.price * item.quantity
          )}
        </strong>

      `;


      checkoutItems.appendChild(
        itemElement
      );

    });


    updateCheckoutTotal();

  };


  // =========================
  // UPDATE CHECKOUT TOTAL
  // =========================
  const updateCheckoutTotal = () => {

    const subtotal =
      getCartTotal();


    const selectedOrderType =
      document.querySelector(
        'input[name="order-type"]:checked'
      );


    let deliveryFee = 0;


    if (
      selectedOrderType &&
      selectedOrderType.value === "delivery"
    ) {

      deliveryFee = 50;

    }


    const finalTotal =
      subtotal + deliveryFee;


    checkoutTotalPrice.innerHTML = `

      <div>
        Subtotal:
        <strong>
          ${formatCurrency(subtotal)}
        </strong>
      </div>

      <div>
        Delivery Fee:
        <strong>
          ${formatCurrency(deliveryFee)}
        </strong>
      </div>

      <hr>

      <div>
        Total:
        <strong>
          ${formatCurrency(finalTotal)}
        </strong>
      </div>

    `;

  };


  // =========================
  // ADD TO CART
  // =========================
  document
    .querySelectorAll(".add-cart-btn")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const name =
            button.dataset.name;

          const price =
            Number(button.dataset.price);


          const existing =
            cart.find(
              (item) =>
                item.name === name
            );


          if (existing) {

            existing.quantity += 1;

          } else {

            cart.push({
              name,
              price,
              quantity: 1
            });

          }


          renderCart();


          if (checkoutMessage) {

            checkoutMessage.classList.add(
              "hidden"
            );

          }

        }
      );

    });


  // =========================
  // CART QUANTITY BUTTONS
  // =========================
  cartItems.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".quantity-btn"
        );


      if (!button) {
        return;
      }


      const index =
        Number(button.dataset.index);


      const action =
        button.dataset.action;


      if (action === "increase") {

        cart[index].quantity += 1;

      }


      if (action === "decrease") {

        cart[index].quantity -= 1;


        if (
          cart[index].quantity <= 0
        ) {

          cart.splice(index, 1);

        }

      }


      renderCart();

    }
  );


  // =========================
  // CLEAR CART
  // =========================
  clearCartButton.addEventListener(
    "click",
    () => {

      cart.length = 0;

      renderCart();


      if (checkoutMessage) {

        checkoutMessage.classList.add(
          "hidden"
        );

      }

    }
  );


  // =========================
  // DELIVERY / PICKUP SWITCH
  // =========================
  const orderTypeRadios =
    document.querySelectorAll(
      'input[name="order-type"]'
    );


  orderTypeRadios.forEach(
    (radio) => {

      radio.addEventListener(
        "change",
        () => {

          if (
            radio.value === "delivery"
          ) {

            deliveryFields.classList.remove(
              "hidden"
            );

            pickupFields.classList.add(
              "hidden"
            );


            customerAddress.required =
              true;

          }


          if (
            radio.value === "pickup"
          ) {

            deliveryFields.classList.add(
              "hidden"
            );

            pickupFields.classList.remove(
              "hidden"
            );


            customerAddress.required =
              false;

          }


          updateCheckoutTotal();

        }
      );

    }
  );


  // =========================
  // CHECKOUT FORM
  // =========================
  checkoutForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      // CHECK EMPTY CART
      if (cart.length === 0) {

        checkoutMessage.textContent =
          "Please add at least one item to your cart before placing your order.";

        checkoutMessage.classList.remove(
          "hidden"
        );

        return;

      }


      // CUSTOMER DETAILS
      const customerName =
        document
          .getElementById(
            "customer-name"
          )
          .value
          .trim() || "Guest";


      const customerPhone =
        document
          .getElementById(
            "customer-phone"
          )
          .value
          .trim();


      // ORDER TYPE
      const orderType =
        document.querySelector(
          'input[name="order-type"]:checked'
        ).value;


      // PAYMENT
      const paymentMethod =
        document
          .getElementById(
            "payment-method"
          )
          .value;


      // ORDER NUMBER
      const orderNumber =
        "KYLIE-" +
        Date.now()
          .toString()
          .slice(-6);


      // TOTALS
      const subtotal =
        getCartTotal();


      const deliveryFee =
        orderType === "delivery"
          ? 50
          : 0;


      const finalTotal =
        subtotal +
        deliveryFee;


      // TOTAL ITEMS
      const totalItems =
        getTotalItems();


      // =========================
// SAVE ORDER DETAILS BEFORE CLEARING CART
// =========================

// Create a copy of the cart before clearing it
const orderedItems = cart.map((item) => ({
  name: item.name,
  price: item.price,
  quantity: item.quantity
}));


// Get delivery address
const deliveryAddress =
  document
    .getElementById("customer-address")
    .value
    .trim();


// Get delivery instructions
const deliveryInstructions =
  document
    .getElementById("delivery-instructions")
    .value
    .trim();


// Get pickup time
const pickupTime =
  document
    .getElementById("pickup-time")
    .value;


// =========================
// CREATE ORDER ITEMS HTML
// =========================

const orderItemsHTML =
  orderedItems
    .map((item) => {

      return `
        <div class="order-confirmation-item">

          <span>
            ${item.name} × ${item.quantity}
          </span>

          <strong>
            ${formatCurrency(
              item.price * item.quantity
            )}
          </strong>

        </div>
      `;

    })
    .join("");


// =========================
// DELIVERY OR PICKUP DETAILS
// =========================

let fulfillmentDetails = "";


if (orderType === "delivery") {

  fulfillmentDetails = `

    <p>
      <strong>
        🛵 Order Type:
      </strong>
      Delivery
    </p>

    <p>
      <strong>
        📍 Delivery Address:
      </strong>
      ${deliveryAddress}
    </p>

    ${
      deliveryInstructions
        ? `
          <p>
            <strong>
              📝 Instructions:
            </strong>
            ${deliveryInstructions}
          </p>
        `
        : ""
    }

  `;

} else {

  fulfillmentDetails = `

    <p>
      <strong>
        🏪 Order Type:
      </strong>
      Pick-Up
    </p>

    <p>
      <strong>
        📍 Pick-Up Location:
      </strong>
      Kylie's Cafe & Restaurant
    </p>

    <p>
      <strong>
        ⏰ Pick-Up Time:
      </strong>
      ${pickupTime}
    </p>

  `;

}


// =========================
// CONFIRMATION MESSAGE
// =========================

let message = `

  <h3>🎉 Order Confirmed!</h3>

  <p>
    Thank you,
    <strong>
      ${customerName}
    </strong>!
  </p>

  <p>
    Your order has been successfully placed.
  </p>

  <hr>

  <h4>Your Order</h4>

  <div class="order-confirmation-items">

    ${orderItemsHTML}

  </div>

  <hr>

  <p>
    <strong>
      Subtotal:
    </strong>
    ${formatCurrency(subtotal)}
  </p>

  <p>
    <strong>
      Delivery Fee:
    </strong>
    ${formatCurrency(deliveryFee)}
  </p>

  <p>
    <strong>
      Total:
    </strong>
    ${formatCurrency(finalTotal)}
  </p>

  <hr>

  <p>
    <strong>
      Order Number:
    </strong>
    ${orderNumber}
  </p>

  <p>
    <strong>
      📱 Phone:
    </strong>
    ${customerPhone}
  </p>

  ${fulfillmentDetails}

  <p>
    <strong>
      💵 Payment:
    </strong>
    ${paymentMethod}
  </p>

  <hr>

  <p>
    <strong>
      Order Status:
    </strong>
    🟡 Order Received
  </p>

`;

      checkoutMessage.innerHTML =
        message;


      checkoutMessage.classList.remove(
        "hidden"
      );


      // CLEAR CART
      cart.length = 0;


      renderCart();


      // RESET FORM
      checkoutForm.reset();


      // RESET DELIVERY/PICKUP
      deliveryFields.classList.remove(
        "hidden"
      );

      pickupFields.classList.add(
        "hidden"
      );


      customerAddress.required =
        true;


      // SCROLL TO CONFIRMATION
      checkoutMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }
  );


  // =========================
  // INITIAL DISPLAY
  // =========================
  renderCart();


  // UPDATE CHECKOUT TOTAL
  updateCheckoutTotal();

});
