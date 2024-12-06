// Dynamically load components into placeholders
const includeHTML = async (id, file) => {
    const element = document.getElementById(id);
    if (element) {
        const response = await fetch(file);
        const content = await response.text();
        element.innerHTML = content;
    }
};

// Load header and footer
includeHTML('header', 'header.html');
includeHTML('footer', 'footer.html');
