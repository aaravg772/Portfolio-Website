/* ==========================================================================
   1. THEME MANAGEMENT (LIGHT/DARK MODE)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);

    toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme); 
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    initAppleTimeline();
});

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150; 

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

/* ==========================================================================
   3. APPLE-STYLE SCROLL TIMELINE
   ========================================================================== */
function initAppleTimeline() {
    const timelineItems = document.querySelectorAll('.scroll-timeline-item');
    
    if (timelineItems.length === 0) return;

    function updateTimeline() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top;
            const itemBottom = rect.bottom;
            const itemCenter = (itemTop + itemBottom) / 2;
            
            const viewportCenter = windowHeight / 2;
            const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
            
            if (distanceFromCenter < windowHeight * 0.4) {
                item.classList.add('active');
                item.classList.remove('fade-out');
            } 
            else if (itemCenter < viewportCenter) {
                item.classList.add('fade-out');
                item.classList.remove('active');
            }
            else {
                item.classList.remove('active', 'fade-out');
            }
        });
    }

    window.addEventListener('scroll', updateTimeline);
    window.addEventListener('resize', updateTimeline);

    updateTimeline();
}
/* ==========================================================================
   4. ART MODAL
   ========================================================================== */

function openModal(element) {
    const modal = document.getElementById("artModal");
    const modalImg = document.getElementById("imgFull");
    const captionText = document.getElementById("modalCaption");
    const clickedImg = element.querySelector('img');
    const labelText = element.querySelector('.panel-label').innerText;

    // 1. Show the modal
    modal.style.display = "flex"; // Changed to flex for easier centering
    modal.style.flexDirection = "column";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    
    // 2. Set the image and caption
    modalImg.src = clickedImg.src;
    captionText.innerHTML = labelText;

    // 3. LOCK SCROLL
    document.body.classList.add("modal-open");
    
    // 4. Handle Rotation Fix (if the thumbnail was rotated, rotate the modal version too)
    if (element.classList.contains('rotate-fix')) {
        modalImg.style.transform = "rotate(90deg)";
    } else {
        modalImg.style.transform = "rotate(0deg)";
    }
}

function closeModal() {
    const modal = document.getElementById("artModal");
    modal.style.display = "none";
    
    // UNLOCK SCROLL
    document.body.classList.remove("modal-open");
}

// Close listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});