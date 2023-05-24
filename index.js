//fetch all products
//const fetch = require('node-fetch');
const products_url = 'https://fakestoreapi.com/products'
let cartCount = 0; // Variable to track the cart count
async function fetchProducts() {
    try {
        let response = await fetch(products_url);
        console.log(response);
        let products = await response.json();
        console.log(products);

        let productsContainer = document.getElementById('products');

        // Display all products
        products.forEach(product => {
            let productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                  
                  <img src="${product.image}" />
                  <h3>${product.title}</h3>
                  <p>${product.price}$</p>
                  <button onclick="addToCart(${product.id})">Add to Cart</button>
                  <button onclick="viewProduct(${product.id})">View Product</button>
                `;
            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.log('Error fetching products:', error);
    }
}
//fetchProducts();

// Fetch products by category
async function fetchProductsByCategory(category) {
    try {
        let response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        let products = await response.json();

        let productsContainer = document.getElementById('products');
        productsContainer.innerHTML = ''; // Clear previous products

        // Display products from the specified category
        products.forEach(product => {
            let productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
          <img src="${product.image}" />
          <h3>${product.title}</h3>
          <p>${product.price}$</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
          <button onclick="viewProduct(${product.id})">View Product</button>
        `;
            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.log('Error fetching products by category:', error);
    }
}
//fetchProductsByCategory();

// Fetch and display a single product
async function viewProduct(productId) {
    try {
        let response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        let product = await response.json();

        // Create HTML markup for the product
        let productHtml = `

      <img src="${product.image}" />
      <p>Category: ${product.category}</p>
      <h1>${product.title}</h1>
      <h2>Price: ${product.price}$</h2>  
      <p>Description: ${product.description}</p>
      
    `;

        // Display the product in the popup
        let popupProductElement = document.getElementById('popupProduct');
        popupProductElement.innerHTML = productHtml;

        // Show the popup
        let productPopup = document.getElementById('productPopup');
        productPopup.style.display = 'block';



    } catch (error) {
        console.log('Error fetching product:', error);
    }

    //     let productContainer = document.getElementById('products');
    //     productContainer.innerHTML = ''; // Clear previous products

    //     let productElement = document.createElement('div');
    //     productElement.className = 'product';
    //     productElement.innerHTML = `

    //         <img src="${product.image}" />
    //         <h3>${product.title}</h3>
    //         <p>${product.price}$</p>
    //         <p>${product.description}</p>
    //         <button onclick="addToCart(${product.id})">Add to Cart</button>
    //       `;
    //     productContainer.appendChild(productElement);
    // } catch (error) {
    //     console.log('Error fetching product:', error);
    // }
}
// Close the product popup
function closeProductPopup() {
    let productPopup = document.getElementById('productPopup');
    productPopup.style.display = 'none';
}

// Set the click event for the close button
let closeButton = document.getElementsByClassName('close');
closeButton.onclick = closeProductPopup;

// Fetch and display cart items
function displayCart() {
    let cartCountElement = document.getElementById('cartCount');
    let cartTotalElement = document.getElementById('cartTotal');
    let cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';

    // Fetch cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];


    // Update cart count
    cartCount = cartItems.length;
    if (cartCountElement) {
        cartCountElement.innerHTML = `<i class="fas fa-cart-arrow-down"></i> Cart (${cartCount})`;
    }


    // Display cart items
    cartItems.forEach(item => {
        let cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
        
        <img src="${item.image}" />
        <h4>${item.title}</h4>
        <p>Price:${item.price}$</p>
        <p>Quantity:<input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)"></p>
        <p>Total: ${item.price * item.quantity}$</p>
        <button class="delete-button" onclick="deleteFromCart(${item.id})">Delete</button>
      `;
        cartContainer.appendChild(cartItemElement);
    });

    // Display cart total and make the cart total fixed to two decimal places
    // if (cartTotalElement) {
    //     cartTotalElement.innerText = `Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}$`;

    // }
    let cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    cartTotalElement.innerText = `Grand Total: ${cartTotal}$`;

}

// Add product to cart
async function addToCart(productId) {
    try {
        let response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        let product = await response.json();

        // Fetch cart items from local storage
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product already exists in the cart
        let existingProduct = cartItems.find(item => item.id === product.id);
        if (existingProduct) {
            alert('Product already exists in the cart.');
            return;
        }

        // Add product to cart
        cartItems.push(product);

        // Save updated cart items to local storage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        //update cart count
        cartCount++;
        document.getElementById('cartCount').innerText = `Cart (${cartCount})`;


        // Display updated cart
        displayCart();
    } catch (error) {
        console.log('Error adding to cart:', error);
    }
}

// Delete product from cart
function deleteFromCart(productId) {
    // Fetch cart items from local storage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Find index of product in cart
    const productIndex = cartItems.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        // Remove product from cart
        cartItems.splice(productIndex, 1);

        // Save updated cart items to local storage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Update cart count
        cartCount = cartItems.length;
        let cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.innerHTML = `<i class="fas fa-cart-arrow-down"></i> Cart (${cartCount})`;
        }


        // Display updated cart
        displayCart();
    }
}


// Update quantity for cart item
function updateQuantity(productId, quantity) {
    // Fetch cart items from local storage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the cart item
    const cartItem = cartItems.find(item => item.id === productId);
    if (cartItem) {
        // Update the quantity
        cartItem.quantity = parseInt(quantity);

        // Save updated cart items to local storage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Display updated cart
        displayCart();
    }
}
//clear the cart items 
function clearCart() {
    localStorage.clear();
    displayCart();

}

// Checkout
function checkout() {
    // ... Perform checkout functionality ...
    alert('Checkout button clicked!');
}

// Toggle cart visibility
function toggleCart() {
    const cartContainer = document.getElementById('cartContainer');
    const cartCountElement = document.getElementById('cartCount');
    if (cartContainer.style.display === 'none') {
        cartContainer.style.display = 'block';
        cartCountElement.style.display = 'none';
    } else {
        cartContainer.style.display = 'none';
        cartCountElement.style.display = 'block';
    }
}

// Search products
function searchProducts() {
    let searchInput = document.getElementById('searchInput');
    let searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm.length > 0) {
        fetchProductsByCategory(searchTerm);
    } else {
        fetchProducts();
    }
}

fetchProducts(); // Fetch and display all products
displayCart(); // Display initial cart items