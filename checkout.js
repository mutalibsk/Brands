// Checkout Page Functionality
document.addEventListener('DOMContentLoaded', () => {
  renderOrderReview();
  setupPaymentMethodToggle();
  setupCardNumberFormatting();
  setupExpiryFormatting();
  setupCheckoutForm();
});

function renderOrderReview() {
  const cartItems = cart.getCart();
  const reviewItems = document.getElementById('reviewItems');
  const subtotal = cart.getTotal();
  const tax = cart.getTax();
  const total = cart.getFinalTotal();

  if (cartItems.length === 0) {
    if (reviewItems) reviewItems.innerHTML = '<p>No items in cart</p>';
    return;
  }

  if (reviewItems) {
    reviewItems.innerHTML = cartItems.map(item => `
      <div class="review-item">
        <span>${item.emoji} ${item.name} x${item.quantity}</span>
        <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join('');
  }

  if (document.getElementById('reviewSubtotal')) document.getElementById('reviewSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (document.getElementById('reviewTax')) document.getElementById('reviewTax').textContent = `₹${tax.toLocaleString('en-IN')}`;
  if (document.getElementById('reviewTotal')) document.getElementById('reviewTotal').textContent = `₹${total.toLocaleString('en-IN')}`;

  const orderSummary = document.getElementById('orderSummary');
  if (orderSummary) {
    orderSummary.innerHTML = reviewItems?.innerHTML || '';
  }
}

function setupPaymentMethodToggle() {
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const cardPayment = document.getElementById('cardPayment');
  const upiPayment = document.getElementById('upiPayment');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (cardPayment && upiPayment) {
        if (e.target.value === 'card') {
          cardPayment.style.display = 'block';
          upiPayment.style.display = 'none';
        } else if (e.target.value === 'upi') {
          cardPayment.style.display = 'none';
          upiPayment.style.display = 'block';
        } else {
          cardPayment.style.display = 'none';
          upiPayment.style.display = 'none';
        }
      }
    });
  });
}

function setupCardNumberFormatting() {
  const cardNumber = document.getElementById('cardNumber');
  if (!cardNumber) return;

  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formattedValue.substring(0, 19);
  });
}

function setupExpiryFormatting() {
  const expiry = document.getElementById('expiry');
  if (!expiry) return;

  expiry.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  });
}

function setupCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const orderData = {
      customer: {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country')
      },
      payment: {
        method: formData.get('paymentMethod')
      },
      cart: cart.getCart(),
      subtotal: cart.getTotal(),
      tax: cart.getTax(),
      total: cart.getFinalTotal(),
      timestamp: new Date().toISOString()
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart.clear();
    showToast('✅ Order placed successfully!');

    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 1500);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}