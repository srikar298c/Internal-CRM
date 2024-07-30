// For sidebar a active
const currentFolder = window.location.pathname.split('/').slice(-2, -1)[0];

const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
sidebarLinks.forEach(link => {
    const linkFolder = link.getAttribute('href').split('/').slice(-2, -1)[0];
    if (linkFolder === currentFolder) {
        link.parentElement.classList.add('active');
    }
});
