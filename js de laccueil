// ==================== APP.JS ====================

// Animate service cards on scroll
const serviceCards = document.querySelectorAll('.service-card');

function revealOnScroll() {
    const triggerBottom = window.innerHeight / 5 * 4;

    serviceCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;

        if(cardTop < triggerBottom) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav a');

navLinks.forEach(link => {
    link.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
