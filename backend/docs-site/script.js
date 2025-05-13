// Navegação suave para âncoras
const links = document.querySelectorAll('.sidebar a');
links.forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
});

// (Opcional) Carregar conteúdos dinâmicos futuramente...
// Você pode adicionar scripts para busca, navegação dinâmica, etc.
