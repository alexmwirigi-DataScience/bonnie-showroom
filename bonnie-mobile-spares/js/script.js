// Professional Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    // Add 'scrolled' class to header when scrolled > 50px, otherwise remove it
    header.classList.toggle('scrolled', window.scrollY > 50);
});