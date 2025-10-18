/* ===================================================================
   Project: Bonnie Mobile Spares Ltd - Main JavaScript File
   Version: 3.0 (Final, Combined)
   Description: This file handles all client-side interactivity,
                including navigation, the shopping cart, and user actions.
=================================================================== */

// We wrap our entire script in a DOMContentLoaded event listener.
// This ensures that the HTML is fully loaded before our JavaScript tries to find elements.
document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    //         1. GLOBAL COMPONENTS & LOGIC
    // ============================================

    // --- Header Scroll Effect ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Navigation Overlay Logic ---
    const menuButton = document.querySelector('.menu-btn');
    const closeButton = document.querySelector('.close-btn');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (menuButton && closeButton && navOverlay) {
        menuButton.addEventListener('click', () => {
            navOverlay.classList.add('open');
            body.classList.add('body-no-scroll');
        });

        closeButton.addEventListener('click', () => {
            navOverlay.classList.remove('open');
            body.classList.remove('body-no-scroll');
        });
    }

    // --- Smart Back Button Logic ---
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the link's default "#" behavior
            history.back();         // Use browser history to go to the previous page
        });
    }


    // ============================================
    //         2. SHOPPING CART SYSTEM
    // ============================================

    const cartCounter = document.getElementById('cart-counter');

    // --- Function to update the cart counter in the header ---
    function updateCartCounter() {
        // Get the cart from localStorage, or create an empty array if it doesn't exist
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        // Calculate the total number of items by summing up the quantities
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCounter) {
            cartCounter.textContent = totalItems;
        }
    }
    // Always update the counter as soon as any page loads
    updateCartCounter();


    // ============================================
    //         3. PAGE-SPECIFIC LOGIC: Product Detail Page
    // ============================================

    const addToCartButton = document.getElementById('add-to-cart-btn');
    if (addToCartButton) {
        const quantitySelector = document.querySelector('.quantity-selector');
        const minusButton = quantitySelector.querySelector('button:first-of-type');
        const plusButton = quantitySelector.querySelector('button:last-of-type');
        const quantitySpan = quantitySelector.querySelector('span');

        // --- Quantity Selector ---
        let currentQuantity = 1;
        plusButton.addEventListener('click', () => {
            currentQuantity++;
            quantitySpan.textContent = currentQuantity;
        });
        minusButton.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                quantitySpan.textContent = currentQuantity;
            }
        });

        // --- "Add to Cart" Button ---
        addToCartButton.addEventListener('click', () => {
            const productDetailsContainer = document.querySelector('.product-detail-grid');
            const product = {
                id: productDetailsContainer.dataset.productId,
                name: productDetailsContainer.dataset.productName,
                price: parseFloat(productDetailsContainer.dataset.productPrice),
                quantity: parseInt(quantitySpan.textContent)
            };

            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            
            // Check if the product (by its ID) is already in the cart
            const existingProductIndex = cart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                // If it exists, just increase the quantity
                cart[existingProductIndex].quantity += product.quantity;
            } else {
                // If it's a new product, add it to the cart array
                cart.push(product);
            }

            // Save the new or updated cart back into the browser's localStorage
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            // Update the header counter and give the user feedback
            updateCartCounter();
            alert(`${product.quantity} x "${product.name}" has been added to your cart!`);
        });
    }


    // ============================================
    //         4. PAGE-SPECIFIC LOGIC: Cart Page
    // ============================================

    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) { // This code only runs if we are on cart.html
        const orderButton = document.getElementById('order-cart-whatsapp');

        // --- Function to display all items from localStorage on the cart page ---
        function displayCartItems() {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const cartTotalPriceEl = document.getElementById('cart-total-price');
            cartItemsContainer.innerHTML = ''; // Clear the container first
            let grandTotal = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                orderButton.style.display = 'none'; // Hide order button
            } else {
                orderButton.style.display = 'inline-block'; // Show order button
            }

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                grandTotal += itemTotal;
                
                // Create the HTML for each cart item
                const cartItemHTML = `
                    <div class="cart-item">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p>Quantity: ${item.quantity} @ ksh ${item.price.toFixed(2)}</p>
                        </div>
                        <p><strong>ksh ${itemTotal.toFixed(2)}</strong></p>
                        <p class="item-remove-btn" data-index="${index}">Remove</p>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });

            cartTotalPriceEl.textContent = `ksh ${grandTotal.toFixed(2)}`;
        }

        displayCartItems(); // Call the function to show items on page load

        // --- "Remove Item" Button Logic ---
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('item-remove-btn')) {
                const itemIndex = parseInt(event.target.dataset.index);
                let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                cart.splice(itemIndex, 1); // Remove item from the array
                localStorage.setItem('shoppingCart', JSON.stringify(cart)); // Update localStorage
                
                // Refresh the display
                displayCartItems(); 
                updateCartCounter();
            }
        });

        // --- "Order Everything via WhatsApp" Button Logic ---
        orderButton.addEventListener('click', () => {
            const yourWhatsAppNumber = "254111475368"; // !!! IMPORTANT: REPLACE WITH YOUR NUMBER !!!
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            let grandTotal = 0;

            let message = 'Hello Bonnie Mobile Spares,\n\nI would like to order the following items:\n\n';

            cart.forEach(item => {
                message += `*Product:* ${item.name}\n`;
                message += `*Quantity:* ${item.quantity}\n`;
                message += `*Subtotal:* ksh ${(item.price * item.quantity).toFixed(2)}\n`;
                message += `-------------------------\n`;
                grandTotal += item.price * item.quantity;
            });

            message += `\n*ESTIMATED TOTAL: ksh ${grandTotal.toFixed(2)}*\n\n`;
            message += `Please confirm availability and send the final payment details. Thank you!`;
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        });
    }

}); // End of DOMContentLoaded