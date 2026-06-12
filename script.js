 const DEFAULT_FILTERS = {
   search: "",
   category: "all",
   sort: "default"
   };
   },
 //STATE//
const Store = {
  state: {
  filters: {
  search: "",
  category: "all",
  sort: "default"
    },
    cart: [],
     wishlist: [],
    products: []
  },

   // Initialization//
   init() {
        this.state.products =  this.loadProducts();
        this.state.cart = this.loadCart();
        this.state.wishlist = this.loadWishlist();
        this.state.filters = this.loadFilters();
  },

  // Loaders//
  loadCart() {
  try {
  return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
  return [];
  }
  },
  loadProducts() {
  return [...defaultProducts];
  },
  loadWishlist() {
  try {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
  return [];
  }
  },
 loadFilters() {
   try {
     return JSON.parse(
       localStorage.getItem("filters")
     ) || DEFAULT_FILTERS;
   } catch {
     return DEFAULT_FILTERS;
   }
 },
  // Savers
  saveCart() {
  localStorage.setItem("cart", JSON.stringify(this.state.cart) );
  },
  saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(this.state.wishlist));
  },
  saveFilters() {
  localStorage.setItem("filters",JSON.stringify(this.state.filters));
  },

  getProduct(id) {
  return this.state.products.find(product => product.id === id);
  },

   // Cart
  increaseQuantity(id) {
  if (getRemainingStock(id) <= 0) {
  showToast("Out of stock");
  return;
  }
  const item = this.state.cart.find(item => item.id === id);
  if (!item) return;
  item.quantity++;
  this.persistCart();
  },

  decreaseQuantity(id) {
  const item = this.state.cart.find(item => item.id === id);
  if (!item) return;
  item.quantity--;
  if (item.quantity <= 0) {
  this.removeFromCart(id);
  return;
  }
  this.persistCart();
  },

  addToCart(id) {
  const product =  getProduct(id);
  if (!product) return;
  const item = this.state.cart.find(p => p.id === id);
  if (getRemainingStock(id) <= 0) {
  showToast("Out of stock");
  return;
  }
  if (item) {
  item.quantity++;
  } else {
  this.state.cart.push({
  ...product,
  quantity: 1
  });
  }
  showToast(`${product.name} added to cart`);
  animateCart();
  this.persistCart();
  },

  removeFromCart(id) {
  this.state.cart = this.state.cart.filter(item => item.id !== id);
  this.persistCart();
  },

  clearCart() {
  this.state.cart = [];
  this.persistCart();
  },

  // Filters
  setSearch(value) {
  this.state.filters.search = value.toLowerCase();
  this.saveFilters();
  updateUI();
  },
  setCategory(value) {
  this.state.filters.category = value;
  this.saveFilters();
  updateUI();
  },
  setSort(value) {
  this.state.filters.sort = value;
  this.saveFilters();
  updateUI();
  },

  // Wishlist
  toggleWishlist(id) {
  const exists = this.state.wishlist.includes(id);
  if (exists) {
  this.state.wishlist = this.state.wishlist.filter(item => item !== id);
  } else {
  this.state.wishlist.push(id);
  }
  this.saveWishlist();
  updateUI();
  },

  clearWishlist() {
  this.state.wishlist = [];
  this.saveWishlist();
  updateUI();
  },

  // Utilities
  persistCart() {
  this.saveCart();
  updateUI();
  },
  };


//SELECTOR//
const overlay = document.querySelector(".overlay");
const searchInput = document.getElementById("searchInput");
const clearCartBtn = document.getElementById("clearCart");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.querySelector(".cart-panel");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const shopNowBtn = document.getElementById("shopNowBtn");
let categoryFilters = document.getElementById("categoryFilters");
const showAllBtn = document.getElementById("ShowAll");
const sortHighBtn = document.getElementById("sortHigh");
const sortLowBtn = document.getElementById("sortLow");
const resultsInfo = document.getElementById("resultsInfo");
const productsGrid = document.getElementById("productsGrid");
const cartItems = document.querySelector(".cart-items");
let cartSummary = document.getElementById("cartSummary");
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
let currentProductIndex = 0;
let currentSlide = 0;
const featuredSlider = document.getElementById("featuredSlider");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const filterBtn = document.getElementById("filterBtn");
const filterModal = document.getElementById("filterModal");
const toast = document.getElementById("toast");
const wishlistGrid = document.getElementById("wishlistGrid");
const wishlistInfo = document.getElementById("wishlistInfo");
const clearWishlistBtn = document.getElementById("clearWishlist");
const moveWishlistToCartBtn = document.getElementById("moveWishlistToCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBody = document.getElementById("checkoutBody");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderModal = document.getElementById("orderModal");
const closeOrderModal = document.getElementById("closeOrderModal");
document.getElementById("wishlistCount")
  .addEventListener("click", () => {document
      .getElementById("wishlistSection")
      .scrollIntoView({
        behavior: "smooth"
      });
  });



//EVENT LISTENER//
closeOrderModal.addEventListener(
  "click",
  closeOrderSuccessModal
);
checkoutBtn.addEventListener(
  "click",
  openCheckout
);

placeOrderBtn.addEventListener("click", () => {
  if (Store.state.cart.length === 0) {
    return;
  }
  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing...";
  setTimeout(() => {
  openOrderModal();
    Store.clearCart();
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
    placeOrderBtn.textContent =
      "Place Order";

    placeOrderBtn.disabled = false;

  }, 2000);

});
clearWishlistBtn.addEventListener(
  "click",
  () => {
    if (
      Store.state.wishlist.length === 0
    ) return;

    const confirmed = confirm(
      "Clear wishlist?"
    );

    if (!confirmed) return;

    Store.clearWishlist();
  }
);
shopNowBtn.addEventListener("click", function() {
    productsGrid.scrollIntoView({
      behavior: "smooth"
    });
  }
);

filterBtn.addEventListener( "click",function() {
    filterModal.classList.toggle("open");
  }
);
closeModal.addEventListener(
  "click",
  closeProductModal
);
featuredSlider.addEventListener( "click", function(e) {
    const btn = e.target.closest(".featured-add-cart" );
    if (!btn) return;
    Store.addToCart(
      Number(btn.dataset.id)
    );
  }
);
modalBody.addEventListener("click", function(e) {
  const btn = e.target.closest(".modal-add-cart");
  if (!btn) return;
  Store.addToCart(Number(btn.dataset.id));
  closeProductModal();
});
productModal.addEventListener("click", function(e) {
  if (e.target === productModal) {
    closeProductModal();
  }
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeProductModal();
  }
});
searchInput.addEventListener("input", e => {
  Store.setSearch(e.target.value);
});

cartButton.addEventListener("click",function() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
  }
);

closeCart.addEventListener("click",function() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
  }
);

overlay.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
});

categoryFilters.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

 Store.setCategory(btn.dataset.category);
   Store.setSearch("");
    searchInput.value = "";
filterModal.classList.remove("open");
});
showAllBtn.addEventListener("click", function () {
  Store.setSort("default");
});
sortHighBtn.addEventListener("click", function () {
  Store.setSort("high");
});
sortLowBtn.addEventListener("click", function () {
  Store.setSort("low");
});
 clearCartBtn.addEventListener("click", function () {
            if (Store.state.cart.length === 0) return;
            const confirmClear = confirm("Clear all items from cart?");
            if (!confirmClear) return;
           Store.clearCart();
         });

productsGrid.addEventListener("click", function(e) {
  const wish = e.target.closest(".wishlist-btn");
  if (wish) {Store.toggleWishlist(Number(wish.dataset.id));
    return;
  }
  const cartBtn = e.target.closest(".add-to-cart");
  if (cartBtn) {Store.addToCart(Number(cartBtn.dataset.id));
    return;
  }
  const card = e.target.closest(".product-card");
  if (!card) return;
  openProductModal(
    Number(card.dataset.id)
  );
});

cartItems.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
 if (button.classList.contains("increase-btn")) {
   Store.increaseQuantity(id);
 }
 if (button.classList.contains("decrease-btn")) {
   Store.decreaseQuantity(id);
 }
 if (button.classList.contains("remove-btn")) {
   Store.removeFromCart(id);
 }
});

checkoutBtn.addEventListener("click", () => {
    showToast("Checkout coming soon");
  }
);

prevSlide.addEventListener("click", () => {
  const featured = getFeaturedProducts();
  currentSlide--;

  if (currentSlide < 0) {
    currentSlide =
      featured.length - 1;
  }
  renderFeaturedSlider();
});

nextSlide.addEventListener("click", () => {
  const featured =
    getFeaturedProducts();
  currentSlide++;
  if (
    currentSlide >= featured.length
  ) {
    currentSlide = 0;
  }
  renderFeaturedSlider();
});

modalBody.addEventListener("click", function(e) {
  if (e.target.id === "prevProduct") {
    currentProductIndex--;
    if (currentProductIndex < 0) {
      currentProductIndex =
        Store.state.products.length - 1;
    }
    showProductByIndex(currentProductIndex);
  }
  if (e.target.id === "nextProduct") {
    currentProductIndex++;
    if (
      currentProductIndex >=
      Store.state.products.length
    ) {
      currentProductIndex = 0;
    }
    showProductByIndex(currentProductIndex);
  }
});

document.addEventListener("keydown", e => {
  if (
    !productModal.classList.contains("open")
  ) return;
  if (e.key === "ArrowRight") {
    currentProductIndex++;
    if (
      currentProductIndex >=
      Store.state.products.length
    ) {
      currentProductIndex = 0;
    }
    showProductByIndex(currentProductIndex);
  }
  if (e.key === "ArrowLeft") {
    currentProductIndex--;
    if (currentProductIndex < 0) {
      currentProductIndex =
        Store.state.products.length - 1;
    }
    showProductByIndex(currentProductIndex);
  }
});
wishlistGrid.addEventListener("click", function(e) {
    const cartBtn = e.target.closest(".wishlist-cart-btn");
    if (cartBtn) {
      Store.addToCart(
        Number(cartBtn.dataset.id)
      );
      return;
    }
    const removeBtn = e.target.closest(".wishlist-remove-btn");
    if (removeBtn) {
      Store.toggleWishlist(
        Number(removeBtn.dataset.id)
      );
    }
  }
);

function openOrderModal(){
    orderModal.classList.add("show");

    setTimeout(() => {
        showToast("🎉 Thank you for your purchase!");
    }, 300);
}
function openOrderModal(){
    orderModal.classList.add("show");
}

function closeOrderSuccessModal(){
    orderModal.classList.remove("show");
}
function updateCheckoutButton() {
  checkoutBtn.disabled =
    Store.state.cart.length === 0;
}
function showCartMessage(message) {
  const box = document.getElementById("cartMessage");

  box.textContent = message;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}
function openCheckout() {

  const totals =
    calculateCartTotals();

  checkoutBody.innerHTML = `
      <p>
        Items:
        ${totals.quantity}
      </p>

      <p>
        Total:
        $${totals.total.toFixed(2)}
      </p>
  `;

  checkoutModal.classList.add("open");
}
function placeOrder() {

  if (Store.state.cart.length === 0) {
    showToast("Cart is empty");
    return;
  }

  const {
    subtotal,
    tax,
    total,
    quantity
  } = calculateCartTotals();

  cartSummary.innerHTML = `
    <p>Total Items: ${quantity}</p>
    <p>Total: $${total.toFixed(2)}</p>
  `;

  const order = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    items: [...Store.state.cart],
    total: totals.total
  };

  const orders =
    JSON.parse(
      localStorage.getItem("orders")
    ) || [];

  orders.push(order);

  localStorage.setItem(
    "orders",
    JSON.stringify(orders)
  );
  checkoutModal.classList.remove("open");
}
function renderWishlistInfo() {
  const count = Store.state.wishlist.length;
  wishlistInfo.textContent =
    `${count} item${count !== 1 ? "s" : ""} saved`;
}
function renderWishlistCount() {
  const count = document.querySelector("#wishlistCount span");
  if (!count) return;
  count.textContent = Store.state.wishlist.length;
}

function getWishlistProducts() {
  return Store.state.products.filter(product =>
      Store.state.wishlist.includes(product.id
      )
  );
}

function renderWishlist() {
 const wishlistProducts = getWishlistProducts();
  if ( wishlistProducts.length === 0 ) {
    wishlistGrid.innerHTML = `
     <div class="empty-wishlist">
         <div class="empty-icon">
             ❤
         </div>
         <h3>Your wishlist is empty</h3>
         <p>
             Products you love will appear here.
         </p>
     </div>
    `;
    return;
  }
  wishlistGrid.innerHTML = wishlistProducts.map(product => `
        <div class="wishlist-card">
          <img
            src="${product.image}"
            alt="${product.name}"
          >
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <div class="wishlist-actions">
            <button
              class="wishlist-cart-btn"
              data-id="${product.id}">
              Add To Cart
            </button>
            <button
              class="wishlist-remove-btn"
              data-id="${product.id}">
              Remove
            </button>
          </div>
        </div>
      `)
      .join("");
}



function animateCart(){
cartButton.classList.add("bounce");
setTimeout(()=>{
cartButton.classList.remove("bounce");
},500);
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function getRemainingStock(productId) {
  const product = Store.state.products.find(
    p => p.id === productId
  );
  const cartItem = Store.state.cart.find(
    item => item.id === productId
  );
  const quantityInCart = cartItem
    ? cartItem.quantity
    : 0;
  return product.stock - quantityInCart;
}
function getFeaturedProducts() {
  return Store.state.products.filter(
    product => product.featured
  );
}

function renderFeaturedSlider() {
  const featured = getFeaturedProducts();
  if (featured.length === 0) return;
  const product = featured[currentSlide];

  featuredSlider.innerHTML = `
    <div class="featured-card">
      <img
        src="${product.image}"
        alt="${product.name}"
      >
      <div class="featured-content">
        <h2>${product.name}</h2>
        <p>
          ${product.description}
        </p>
        <h3>$${product.price}</h3>
        <button
          class="featured-add-cart"
          data-id="${product.id}">
          Add To Cart
        </button>
      </div>
    </div>
  `;
}
setInterval(() => {
  const featured = getFeaturedProducts();
  if (featured.length === 0) return;
  currentSlide++;
  if (currentSlide >= featured.length) {
    currentSlide = 0;
  }
  renderFeaturedSlider();
}, 5000);


function showProductByIndex(index) {
  currentProductIndex = index;
  const product = Store.state.products[index];
  openProductModal(product.id);
}

   function openProductModal(id) {
     const product = Store.state.products.find(
       p => p.id === id
     );
     currentProductIndex = Store.state.products.findIndex(
         p => p.id === id
       );
     if (!product) return;
    modalBody.innerHTML = `
      <div class="modal-navigation">
        <button id="prevProduct">
          ←
        </button>
        <img src="${product.image}" alt="${product.name}">
        <button id="nextProduct">
          →
        </button>
      </div>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>Category: ${product.category}</p>
      <h3>$${product.price}</h3>
      <p>Stock:
      ${getRemainingStock(product.id)}
      </p>
        ${
          getRemainingStock(product.id) > 0
          ? `
              <button
                class="modal-add-cart"
                data-id="${product.id}">
                Add To Cart
              </button>
            `
          : `
              <button disabled>
                Out of Stock
              </button>
            `
        }
    `;
     productModal.classList.add("open");
   }
   function closeProductModal() {
     productModal.classList.remove("open");
   }


  // CATEGORY
function getFilteredProducts() {
  let data = [...Store.state.products];
  const { search, category, sort } = Store.state.filters;

  if (search) {
    data = data.filter(p =>
      p.name.toLowerCase().includes(search)
    );
  }
  if (category !== "all") {
    data = data.filter(p => p.category === category);
  }
  if (sort === "high") {
    data.sort((a, b) => b.price - a.price);
  }
  if (sort === "low") {
    data.sort((a, b) => a.price - b.price);
  }
  return data;
}
function getCategories() {
  const categories = Store.state.products.map(p => p.category);
  return ["all", ...new Set(categories)];
  }

function renderCategories() {

  const categoryFilters = document.getElementById("categoryFilters");
  let html = "";
  getCategories().forEach(category => {
    const isActive = Store.state.filters.category === category;
    const label = category === "all" ? "All Products" : category;
    html += `
      <button
        class="category-btn ${isActive ? "active" : ""}"
        data-category="${category}">
       ${label}
      </button>
    `;
  });
  categoryFilters.innerHTML = html;
}
function updateSortButtons() {
  document
    .querySelectorAll(".sort-btn")
    .forEach(button => {
      button.classList.remove("active");
    });
  if (Store.state.filters.sort === "default") {
    showAllBtn.classList.add("active");
  }
  if (Store.state.filters.sort === "high") {
    sortHighBtn.classList.add("active");
  }
  if (Store.state.filters.sort === "low") {
    sortLowBtn.classList.add("active");
  }
  }

 function renderEmptyProducts() {
   productsGrid.innerHTML = `
     <div class="empty-products">
       <h3>No products found</h3>
       <p>Try another search or category.</p>
     </div>
   `;
 }
//RENDERING//
function renderProducts() {
  const filteredProducts = getFilteredProducts();
  if (filteredProducts.length === 0) {
    renderEmptyProducts();
    return;
  }
  productsGrid.innerHTML = filteredProducts
    .map(product => {
      const img = product.image?.trim()
        ? product.image
        : "images/fallback.jpg";
         const inWishlist = Store.state.wishlist.includes(product.id);

      return `
        <div class="product-card"
        data-id="${product.id}">
          <div class="product-image">
            <img src="${img}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            ${
            product.featured
            ? `<span class="featured-badge">Featured</span>`
            : ""
            }
            <p>Category: ${product.category}</p>
            <p>$${product.price}</p>
            <p>
              ${renderStars(product.rating)}
              (${product.rating})
            </p>
            <p>
              ${product.reviews} reviews
            </p>
            <p>
            ${
          getRemainingStock(product.id) <= 3
          ? `⚠ Only ${getRemainingStock(product.id)} left`
          : `Stock: ${getRemainingStock(product.id)}`
            }
            </p>
          </div>
         ${
           getRemainingStock(product.id) > 0
           ? `
             <button
               class="add-to-cart"
               data-id="${product.id}">
               Add to Cart
             </button>
           `
           : `
             <button disabled>
               Out of Stock
             </button>
           `
         }
         <button
           class="wishlist-btn ${inWishlist ? "active" : ""}"
           data-id="${product.id}">
           ❤
         </button>
        </div>
      `;
    })
    .join("");
}

function renderStars(rating = 0) {
  const fullStars = Math.floor(rating);
  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += "⭐";
  }
  return stars;
}

function renderCart() {
  if (Store.state.cart.length === 0) {
    cartItems.innerHTML = "<p>Cart is empty</p>";
    cartSummary.innerHTML = `
      <h3>Cart Summary</h3>
      <p>No items yet</p>
    `;
    return;
  }
  let html = "<h3>Cart</h3>";
  Store.state.cart.forEach(item => {
  html += `
    <div class="cart-item">
      <h4>${item.name}</h4>
      <p>
        ${item.quantity} x $${item.price}
      </p>
      <p>
        Total: $${item.price * item.quantity}
      </p>
      <div class="cart-controls">
        <button
          class="increase-btn"
          data-id="${item.id}"
        >
          +
        </button>
        <button
          class="decrease-btn"
          data-id="${item.id}"
        >
          -
        </button>
        <button
          class="remove-btn"
          data-id="${item.id}"
        >
          Remove
        </button>
      </div>
    </div>
  `;
  });
  cartItems.innerHTML = html;
}
function renderCartCount() {
  let totalItems = 0;
  Store.state.cart.forEach(item => {
    totalItems += item.quantity;
  });
  cartCount.textContent = totalItems;
}
function renderResultsInfo() {
  const filteredProducts = getFilteredProducts();
  let label = "All Products";
  if (Store.state.filters.category !== "all") {
    label = Store.state.filters.category;
  }
  resultsInfo.innerHTML = `
    ${label} •
    Showing ${filteredProducts.length}
    products
  `;
}
function calculateCartTotals() {
  let subtotal = 0;
  let quantity = 0;
  Store.state.cart.forEach(item => {
    subtotal += item.price * item.quantity;
    quantity += item.quantity;
  });
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  return {
    subtotal,
    tax,
    total,
    quantity
  };
}
function renderCartSummary() {
  const {
    subtotal,
    tax,
    total,
    quantity
  } = calculateCartTotals();
  cartSummary.innerHTML = `
    <h3>Cart Summary</h3>
    <p>Total Items: ${quantity}</p>
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Tax: $${tax.toFixed(2)}</p>
    <hr>
    <h2>Total: $${total.toFixed(2)}</h2>
  `;
}

function updateProductsUI() {
  renderProducts();
  renderResultsInfo();
}
function updateCartUI() {
  renderCart();
  renderCartSummary();
  renderCartCount();
}
function updateFilterUI() {
  renderCategories();
  updateSortButtons();
}
function updateUI()  {
updateProductsUI();
updateCartUI();
updateFilterUI();

renderWishlistCount();
renderWishlist();
renderWishlistInfo();
updateCheckoutButton();
}
function initializeApp() {
  Store.init();
  searchInput.value = Store.state.filters.search;
  renderFeaturedSlider();
  updateUI();
}
initializeApp();