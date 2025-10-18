/* ===================================================================
   BMS SHOWROOM - MASTERPIECE JAVASCRIPT
   VERSION: IMPROVED FOR B&O AESTHETIC
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Helper function for more elegant notifications
    const showNotification = (message, type = 'info') => {
        const notificationContainer = document.getElementById('notification-container') || (() => {
            const div = document.createElement('div');
            div.id = 'notification-container';
            document.body.appendChild(div);
            return div;
        })();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        // Position notifications
        notificationContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 3000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        notification.style.cssText = `
            background-color: var(--primary-black); /* Defined in your CSS */
            color: var(--white);
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease-out, transform 0.4s ease-out;
            border: 1px solid var(--border-gray);
            font-family: var(--font-body);
            font-size: 0.95em;
            letter-spacing: 0.5px;
            max-width: 300px;
        `;

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Animate out and remove after a few seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.addEventListener('transitionend', () => notification.remove());
        }, 3000); // Notification disappears after 3 seconds
    };


    // ============================================
    //         MODULE 1: CORE UI & NAVIGATION
    // ============================================
    const CoreUI = (() => {
        const header = document.querySelector('header');
        const menuButton = document.querySelector('.menu-btn');
        const closeButton = document.querySelector('.close-btn');
        const navOverlay = document.querySelector('.nav-overlay');
        const backButton = document.getElementById('back-button');
        const body = document.body;

        const handleScroll = () => {
            if (header) {
                // Add/remove a class for styling when scrolled (e.g., subtle border, background change)
                header.classList.toggle('scrolled', window.scrollY > 80); // More aggressive scroll point
            }
        };

        const toggleMenu = (state) => {
            if (navOverlay) {
                // Use a proper class for overlay width to leverage CSS transitions
                if (state) {
                    navOverlay.style.width = '100%';
                    menuButton.setAttribute('aria-expanded', 'true');
                } else {
                    navOverlay.style.width = '0%';
                    menuButton.setAttribute('aria-expanded', 'false');
                }
                body.classList.toggle('body-no-scroll', state); // Prevent background scroll
            }
        };

        const init = () => {
            window.addEventListener('scroll', handleScroll, { passive: true });
            
            if (menuButton) {
                menuButton.addEventListener('click', () => toggleMenu(true));
                menuButton.setAttribute('aria-label', 'Open navigation menu');
                menuButton.setAttribute('aria-controls', 'nav-overlay');
                menuButton.setAttribute('aria-expanded', 'false'); // Initial state
            }
            if (closeButton) {
                closeButton.addEventListener('click', () => toggleMenu(false));
                closeButton.setAttribute('aria-label', 'Close navigation menu');
            }
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    history.back();
                });
            }

            // Close overlay if a nav link is clicked
            const navLinks = navOverlay ? navOverlay.querySelectorAll('ul li a') : [];
            navLinks.forEach(link => {
                link.addEventListener('click', () => toggleMenu(false));
            });

            // Handle ESC key to close menu
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navOverlay && navOverlay.style.width === '100%') {
                    toggleMenu(false);
                }
            });
        };
        
        return { init };
    })();


    // ============================================
    //         MODULE 2: SHOPPING CART SYSTEM
    // ============================================
    const ShoppingCart = (() => {
        const cartCounter = document.getElementById('cart-counter');

        const updateCounter = () => {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (cartCounter) {
                cartCounter.textContent = totalItems;
                cartCounter.style.display = totalItems > 0 ? 'flex' : 'none'; // Show/hide counter
            }
        };

        const init = () => {
            updateCounter(); // Always update on page load
        };

        return { init, updateCounter };
    })();


    // ============================================
    //         MODULE 3: PAGE-SPECIFIC LOGIC
    // ============================================
    const PageLogic = (() => {
        
        // --- Logic for the Product Detail Page ---
        const initProductDetailPage = () => {
            const addToCartButton = document.getElementById('add-to-cart-btn');
            if (!addToCartButton) return;

            const quantitySelector = document.querySelector('.quantity-selector');
            if (!quantitySelector) return; // Ensure selector exists

            const minusButton = quantitySelector.querySelector('button:first-of-type');
            const plusButton = quantitySelector.querySelector('button:last-of-type');
            const quantitySpan = quantitySelector.querySelector('span');

            let currentQuantity = parseInt(quantitySpan.textContent) || 1; // Read initial quantity
            quantitySpan.textContent = currentQuantity; // Ensure display matches initial

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
                if (!productDetailsContainer) {
                    showNotification('Product details not found.', 'error');
                    return;
                }

                const product = {
                    id: productDetailsContainer.dataset.productId,
                    name: productDetailsContainer.dataset.productName || 'Unknown Product', // Fallback
                    price: parseFloat(productDetailsContainer.dataset.productPrice) || 0, // Fallback
                    quantity: parseInt(quantitySpan.textContent) // Use current quantity
                };

                if (!product.id || product.price === 0) { // Basic validation
                    showNotification('Invalid product data.', 'error');
                    return;
                }

                let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                const existingProductIndex = cart.findIndex(item => item.id === product.id);

                if (existingProductIndex > -1) {
                    cart[existingProductIndex].quantity += product.quantity;
                } else {
                    cart.push(product);
                }
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                ShoppingCart.updateCounter();
                
                // Use the custom notification instead of alert
                showNotification(`${product.quantity} x "${product.name}" added to cart.`, 'success');
            });
        };

        // --- Logic for the Cart Page ---
        const initCartPage = () => {
            const cartItemsContainer = document.getElementById('cart-items-container');
            if (!cartItemsContainer) return;

            // This part assumes you will have a cart.html with specific elements.
            // For now, it's a placeholder, but we can refine it once you provide cart.html
            // Example of how you might render cart items (simplified):
            const renderCart = () => {
                let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                cartItemsContainer.innerHTML = ''; // Clear previous items

                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
                    return;
                }

                let totalPrice = 0;
                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-item-btn" data-product-id="${item.id}">&times;</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    totalPrice += item.price * item.quantity;
                });

                const totalElement = document.createElement('div');
                totalElement.className = 'cart-total';
                totalElement.innerHTML = `<strong>Total:</strong> $${totalPrice.toFixed(2)}`;
                cartItemsContainer.appendChild(totalElement);

                // Add event listeners for remove buttons
                cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.productId;
                        removeFromCart(productId);
                    });
                });
            };

            const removeFromCart = (productId) => {
                let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                ShoppingCart.updateCounter();
                renderCart(); // Re-render cart after removal
                showNotification('Item removed from cart.', 'info');
            };

            renderCart(); // Initial render of the cart
        };


        // --- Logic for the Hover Preview Effect (Removed for B&O aesthetic, can be uncommented if desired) ---
        const initHoverPreview = () => {
            // const productCards = document.querySelectorAll('.product-card');
            // if (productCards.length === 0) return;

            // const overlay = document.createElement('div');
            // overlay.className = 'image-preview-overlay';
            // const previewContainer = document.createElement('div');
            // previewContainer.className = 'image-preview-container';
            // document.body.appendChild(overlay);
            // document.body.appendChild(previewContainer);

            // productCards.forEach(card => {
            //     const image = card.querySelector('.product-card-image img');
            //     if (image) {
            //         card.addEventListener('mouseenter', () => {
            //             previewContainer.innerHTML = `<img src="${image.src}" alt="${image.alt} preview">`;
            //             overlay.classList.add('visible');
            //             previewContainer.classList.add('visible');
            //         });
            //         card.addEventListener('mouseleave', () => {
            //             overlay.classList.remove('visible');
            //             previewContainer.classList.remove('visible');
            //         });
            //     }
            // });
        };

        const init = () => {
            initProductDetailPage();
            initCartPage();
            // initHoverPreview(); // Commented out for a cleaner B&O-like product browsing experience
        };

        return { init };
    })();


    // ============================================
    //         INITIALIZE ALL MODULES
    // ============================================
    CoreUI.init();
    ShoppingCart.init();
    PageLogic.init();

});