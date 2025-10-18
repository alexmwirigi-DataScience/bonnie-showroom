/* ===================================================================
   Project: Bonnie Mobile Spares Ltd - Main JavaScript File
   Version: 4.0 (Final, with Image Preview)
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
            event.preventDefault();
            history.back();
        });
    }


    // ============================================
    //         2. SHOPPING CART SYSTEM
    // ============================================
    const cartCounter = document.getElementById('cart-counter');

    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems;
        }
    }
    updateCartCounter();


    // ============================================
    //         3. PAGE-SPECIFIC LOGIC: Product Detail Page
    // ============================================
    const addToCartButton = document.getElementById('add-to-cart-btn');
    if (addToCartButton) {
        // ... (The existing Add to Cart and Quantity Selector logic is here, no changes needed) ...
        const quantitySelector = document.querySelector('.quantity-selector');
        const minusButton = quantitySelector.querySelector('button:first-of-type');
        const plusButton = quantitySelector.querySelector('button:last-of-type');
        const quantitySpan = quantitySelector.querySelector('span');

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

        addToCartButton.addEventListener('click', () => {
            const productDetailsContainer = document.querySelector('.product-detail-grid');
            const product = {
                id: productDetailsContainer.dataset.productId,
                name: productDetailsContainer.dataset.productName,
                price: parseFloat(productDetailsContainer.dataset.productPrice),
                quantity: parseInt(quantitySpan.textContent)
            };
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingProductIndex = cart.findIndex(item => item.id === product.id);
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += product.quantity;
            } else {
                cart.push(product);
            }
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCounter();
            alert(`${product.quantity} x "${product.name}" has been added to your cart!`);
        });
    }


    // ============================================
    //         4. PAGE-SPECIFIC LOGIC: Cart Page
    // ============================================
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        // ... (The existing Cart Page logic is here, no changes needed) ...
        const orderButton = document.getElementById('order-cart-whatsapp');
        function displayCartItems() {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const cartTotalPriceEl = document.getElementById('cart-total-price');
            cartItemsContainer.innerHTML = '';
            let grandTotal = 0;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                orderButton.style.display = 'none';
            } else {
                orderButton.style.display = 'inline-block';
            }
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                grandTotal += itemTotal;
                const cartItemHTML = `...`; // your cart item html
                cartItemsContainer.innerHTML += cartItemHTML;
            });
            cartTotalPriceEl.textContent = `ksh ${grandTotal.toFixed(2)}`;
        }
        displayCartItems();
        cartItemsContainer.addEventListener('click', (event) => { /* ... remove logic ... */ });
        orderButton.addEventListener('click', () => { /* ... whatsapp logic ... */ });
    }


    // ===================================================================
    //         5. NEW & CORRECTED: Product Image Hover Preview
    // ===================================================================
    const productCards = document.querySelectorAll('.product-card');

    if (productCards.length > 0) {
        // --- Create the preview elements once and reuse them ---
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';

        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-container';
        
        document.body.appendChild(overlay);
        document.body.appendChild(previewContainer);

        // --- Loop through each product card and add event listeners ---
        productCards.forEach(card => {
            const image = card.querySelector('.product-card-image img');
            
            if (image) {
                // When the mouse ENTERS the card area
                card.addEventListener('mouseenter', () => {
                    previewContainer.innerHTML = `<img src="${image.src}" alt="${image.alt} preview">`;
                    overlay.classList.add('visible');
                    previewContainer.classList.add('visible');
                });

                // When the mouse LEAVES the card area
                card.addEventListener('mouseleave', () => {
                    overlay.classList.remove('visible');
                    previewContainer.classList.remove('visible');
                });
            }
        });
    }

}); // --- END OF DOMContentLoaded ---
