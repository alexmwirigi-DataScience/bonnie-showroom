// Professional Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    // Add 'scrolled' class to header when scrolled > 50px, otherwise remove it
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ============================================
//         Product Detail Page Logic
// ============================================

// First, check if we are on a product detail page by looking for the quantity selector
const quantitySelector = document.querySelector('.quantity-selector');

if (quantitySelector) {
    const minusButton = quantitySelector.querySelector('button:first-of-type');
    const plusButton = quantitySelector.querySelector('button:last-of-type');
    const quantitySpan = quantitySelector.querySelector('span');

    let currentQuantity = 1;

    // --- Event Listener for the PLUS button ---
    plusButton.addEventListener('click', () => {
        currentQuantity++; // Increment the quantity
        quantitySpan.textContent = currentQuantity; // Update the display
    });

    // --- Event Listener for the MINUS button ---
    minusButton.addEventListener('click', () => {
        // Only allow decrementing if the quantity is greater than 1
        if (currentQuantity > 1) {
            currentQuantity--; // Decrement the quantity
            quantitySpan.textContent = currentQuantity; // Update the display
        }
    });
}

// ============================================
//         Navigation Overlay Logic
// ============================================
const menuButton = document.querySelector('.menu-btn');
const closeButton = document.querySelector('.close-btn');
const navOverlay = document.querySelector('.nav-overlay');
const body = document.body;

menuButton.addEventListener('click', () => {
    navOverlay.classList.add('open');
    body.classList.add('body-no-scroll'); // Prevent background scrolling
});

closeButton.addEventListener('click', () => {
    navOverlay.classList.remove('open');
    body.classList.remove('body-no-scroll'); // Re-enable background scrolling
});