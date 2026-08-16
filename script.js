const themeBtn = document.getElementById("themeBtn");
const searchBox = document.getElementById("searchBox");
const products = document.querySelectorAll(".product-card");
const toast = document.getElementById("toast");

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

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀";
}

searchBox.addEventListener("input", () => {
  const search = searchBox.value.toLowerCase();

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();

    product.style.display =
      name.includes(search) ? "" : "none";
  });
});

document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    showToast("Product added to cart ✓");
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}