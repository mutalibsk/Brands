// Cart Page Functionality
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  renderOrderSummary();
});

function renderCart() {
  const cartList = document.getElementById('cartList');
  const emptyCart = document.getElementById('emptyCart');
  const cartItems = cart.getCart();

  if (cartItems.length === 0) {
    cartList.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  
  cartList.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <div class="item-image">${item.emoji}</div>
      <div class="item-details">
        <h4>${item.name}</h4>
        <p class="item-category">${item.category}</p>
        <p class="item-price">₹${item.price.toLocaleString('en-IN')}</p>
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick="updateQty('${item.id}', ${item.quantity - 1})">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="updateQty('${item.id}', ${item.quantity + 1})">+</button>
      </div>
      <div class="item-total">
        <strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong>
      </div>
      <button class="remove-btn" onclick="removeItem('${item.id}')">🗑️</button>
    </div>
  `).join('');
}

function updateQty(productId, newQuantity) {
  if (newQuantity < 1) return;
  cart.updateQuantity(productId, newQuantity);
  renderCart();
  renderOrderSummary();
}

function removeItem(productId) {
  cart.removeFromCart(productId);
  renderCart();
  renderOrderSummary();
  showToast('Item removed from cart');
}

function renderOrderSummary() {
  const subtotal = cart.getTotal();
  const tax = cart.getTax();
  const total = cart.getFinalTotal();

  if (document.getElementById('subtotal')) document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (document.getElementById('tax')) document.getElementById('tax').textContent = `₹${tax.toLocaleString('en-IN')}`;
  if (document.getElementById('total')) document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }
}