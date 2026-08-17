const themeBtn = document.getElementById("themeBtn");
const searchBox = document.getElementById("searchBox");
const products = document.querySelectorAll(".product-card");
const toast = document.getElementById("toast");

// Dark Mode Toggle
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      themeBtn.textContent = "☀";
      localStorage.setItem("theme", "dark");
    } else {
      themeBtn.textContent = "☾";
      localStorage.setItem("theme", "light");
    }
  });
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (themeBtn) themeBtn.textContent = "☀";
}

// Search Functionality
if (searchBox) {
  searchBox.addEventListener("input", () => {
    const search = searchBox.value.toLowerCase();

    document.querySelectorAll(".product-card").forEach(product => {
      const name = product.dataset.name?.toLowerCase() || product.querySelector('h3')?.textContent?.toLowerCase() || '';
      product.style.display = name.includes(search) ? "" : "none";
    });
  });
}

// Shopping Cart System
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
  }

  addToCart(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }
    
    this.save();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.save();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
    }
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTax() {
    return Math.round(this.getTotal() * 0.18);
  }

  getFinalTotal() {
    return this.getTotal() + this.getTax();
  }

  clear() {
    this.cart = [];
    this.save();
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }
}

const cart = new ShoppingCart();

// Add to Cart Button Handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      
      const card = this.closest('.product-card');
      const name = card.querySelector('h3')?.textContent || 'Product';
      const priceText = card.querySelector('strong')?.textContent || '₹0';
      const price = parseInt(priceText.replace('₹', '').replace(',', ''));
      const emoji = card.querySelector('.product-image')?.textContent || '📦';
      const category = card.querySelector('p')?.textContent || 'Other';
      const id = card.dataset.name?.toLowerCase().replace(/\s+/g, '-') || name.toLowerCase().replace(/\s+/g, '-');
      
      const product = { id, name, price, emoji, category };
      
      cart.addToCart(product);
      showToast(`${name} added to cart ✓`);
    });
  });
});

function showToast(message) {
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
}