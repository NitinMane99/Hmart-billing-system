document.getElementById('add-product-btn').addEventListener('click', addProduct);
document.getElementById('search-btn').addEventListener('click', searchProducts);
document.getElementById('add-all-to-cart').addEventListener('click', addAllToCart);
document.getElementById('select-all-checkbox').addEventListener('change', selectAllProducts);
document.getElementById('checkout-btn').addEventListener('click', showCheckout);
document.getElementById('confirm-btn').addEventListener('click', confirmOrder);

let products = []; // Initialize an empty array for products
let cart = [];

// Sample initial products (can be loaded dynamically or from a database)
const initialProducts = [
  { id: 1, name: 'Apple', price: 1.5, quantity: 1 },
  { id: 2, name: 'Banana', price: 0.5, quantity: 1 },
  { id: 3, name: 'Carrot', price: 0.8, quantity: 1 }
];

// Function to add product to the list
function addProduct() {
  const productName = document.getElementById('product-name').value.trim();
  const productPrice = parseFloat(document.getElementById('product-price').value.trim());
  const productQuantity = parseInt(document.getElementById('product-quantity').value.trim(), 10); // Specify base 10 for parseInt

  if (productName && !isNaN(productPrice) && productPrice > 0 && productQuantity > 0) {
    // Add the new product
    const newProduct = {
      id: products.length + 1,
      name: productName,
      price: productPrice,
      quantity: productQuantity
    };
    products.push(newProduct);
    displayProducts(); // Display all products after adding a new one
    
    // Clear input fields
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-quantity').value = '1';
  } else {
    alert('Please enter valid product details.');
  }
}

// Function to search products based on input
function searchProducts() {
  const searchValue = document.getElementById('product-search').value.trim().toLowerCase();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchValue)
  );
  
  if (filteredProducts.length > 0) {
    displayProducts(filteredProducts);
  } else {
    displayProducts([]); // Display empty list when no search results
  }
}

// Function to display products
function displayProducts(productsToDisplay = products) {
  const productList = document.getElementById('product-items');
  productList.innerHTML = '';

  productsToDisplay.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="product-checkbox" data-id="${product.id}">
      <strong>${product.name}</strong> - ₹${product.price.toFixed(2)}
      <div class="quantity-buttons">
        Quantity: 
        <button onclick="decreaseQuantity(${product.id})">-</button>
        <span id="quantity-${product.id}">${product.quantity || 1}</span>
        <button onclick="increaseQuantity(${product.id})">+</button>
      </div>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(li);
  });

  // Show the product list
  document.getElementById('product-list-section').classList.remove('hidden');
}

// Function to select all products
function selectAllProducts() {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = document.getElementById('select-all-checkbox').checked;
  });
}

// Function to add all selected products to cart
function addAllToCart() {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const productId = parseInt(checkbox.getAttribute('data-id'));
      const product = products.find(item => item.id === productId);
      
      if (product) {
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
          existingProduct.quantity++; // Increase quantity if product already exists in cart
        } else {
          cart.push({ ...product, quantity: 1 }); // Add new product to cart with initial quantity 1
        }
      }
    }
  });

  updateCart(); // Update the cart display after adding products
}

// Function to add product to cart
function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (product) {
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity++; // Increase quantity if product already exists in cart
    } else {
      cart.push({ ...product, quantity: 1 }); // Add new product to cart with initial quantity 1
    }
    updateCart(); // Update the cart display
  } else {
    alert('Product not found.');
  }
}

// Function to update cart
function updateCart() {
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';
  let totalAmount = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - ₹${item.price.toFixed(2)} x 
      <div class="quantity-buttons">
        <button onclick="decreaseCartItemQuantity(${item.id})">-</button>
        <span id="cart-quantity-${item.id}">${item.quantity}</span>
        <button onclick="increaseCartItemQuantity(${item.id})">+</button>
      </div>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartList.appendChild(li);
    totalAmount += item.price * item.quantity;
  });

  document.getElementById('total-amount').textContent = `Total: ₹${totalAmount.toFixed(2)}`;
}

// Function to decrease quantity of product
function decreaseQuantity(productId) {
  const product = products.find(item => item.id === productId);
  if (product.quantity && product.quantity > 1) {
    product.quantity--;
    document.getElementById(`quantity-${productId}`).textContent = product.quantity;
  }
}

// Function to increase quantity of product
function increaseQuantity(productId) {
  const product = products.find(item => item.id === productId);
  product.quantity = (product.quantity || 1) + 1;
  document.getElementById(`quantity-${productId}`).textContent = product.quantity;
}

// Function to decrease quantity of cart item
function decreaseCartItemQuantity(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem.quantity > 1) {
    cartItem.quantity--;
    document.getElementById(`cart-quantity-${productId}`).textContent = cartItem.quantity;
  }
}

// Function to increase quantity of cart item
function increaseCartItemQuantity(productId) {
  const cartItem = cart.find(item => item.id === productId);
  cartItem.quantity++;
  document.getElementById(`cart-quantity-${productId}`).textContent = cartItem.quantity;
}

// Function to remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

// Function to show checkout section
function showCheckout() {
  document.getElementById('checkout-section').classList.remove('hidden');
}

// Function to confirm order
function confirmOrder() {
  const name = document.getElementById('customer-name').value.trim();
  const mobile = document.getElementById('customer-mobile').value.trim();
  const email = document.getElementById('customer-email').value.trim();

  if (name && cart.length > 0) {
    // Store order details in sessionStorage (you can use localStorage or pass via URL as well)
    sessionStorage.setItem('customerName', name);
    sessionStorage.setItem('customerMobile', mobile);
    sessionStorage.setItem('customerEmail', email);
    sessionStorage.setItem('cartItems', JSON.stringify(cart));
    sessionStorage.setItem('totalAmount', getTotalAmount().toFixed(2));

    // Redirect to the order summary page
    window.location.href = 'order-summary.html';
  } else {
    alert('Please fill in the customer name and add products to the cart.');
  }
}

// Function to calculate total amount
function getTotalAmount() {
  let totalAmount = 0;
  cart.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  return totalAmount;
}

// Initial display of products (without showing initialProducts by default)
displayProducts([]);
