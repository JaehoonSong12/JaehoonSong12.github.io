const sections = document.querySelectorAll(".section");
const navDots = document.querySelectorAll(".nav-dots button");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
let currentSection = 0;
function scrollToSection(index) {
sections[index].scrollIntoView({ behavior: "smooth" });
updateActiveDot(index);
updateActiveLink(index);
currentSection = index;
history.pushState(null, null, `#${sections[index].id}`);
}
function updateActiveDot(index) {
navDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
});
}
function updateActiveLink(index) {
navLinks.forEach((link, i) => {
    link.classList.toggle("active", i === index);
});
}
document.addEventListener("scroll", () => {
let scrollPosition = window.scrollY;
sections.forEach((section, index) => {
    if (
    scrollPosition >= section.offsetTop - section.clientHeight / 2 &&
    scrollPosition < section.offsetTop + section.clientHeight / 2
    ) {
    updateActiveDot(index);
    updateActiveLink(index);
    currentSection = index;
    }
});
});
navDots.forEach((dot, index) => {
dot.addEventListener("click", () => scrollToSection(index));
});
navLinks.forEach((link, index) => {
link.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(index);
});
});
document.addEventListener("wheel", (event) => {
if (event.deltaY > 0 && currentSection < sections.length - 1) {
    scrollToSection(currentSection + 1);
} else if (event.deltaY < 0 && currentSection > 0) {
    scrollToSection(currentSection - 1);
}
});



document.addEventListener("DOMContentLoaded", () => {
    const navDots = document.querySelectorAll('.nav-dots button');
    // Create a tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    document.body.appendChild(tooltip);
    navDots.forEach((dot) => {
      // Mouse enter: Show the tooltip
      dot.addEventListener('mouseenter', (event) => {
        const title = dot.getAttribute('aria-label');
        tooltip.textContent = title;
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.pageX - 100}px`; // Position to the right of the mouse
        tooltip.style.top = `${event.pageY + 0}px`;
      });
      // Mouse leave: Hide the tooltip
      dot.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
});