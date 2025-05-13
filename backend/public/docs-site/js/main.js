// Script principal para a documentação

document.addEventListener('DOMContentLoaded', function() {
    // Carregar conteúdos dinâmicos
    const apiContent = document.getElementById('api-content');
    const architectureContent = document.getElementById('arquitetura-content');
    const examplesContent = document.getElementById('exemplos-content');
    const faqContent = document.getElementById('faq-content');
    
    // Montar o conteúdo de API a partir dos arquivos separados
    if (apiContent) {
        let apiHtml = '';
        if (window.authApiContent) apiHtml += window.authApiContent;
        if (window.roomsApiContent) apiHtml += window.roomsApiContent;
        if (window.meetingsApiContent) apiHtml += window.meetingsApiContent;
        if (window.selectsApiContent) apiHtml += window.selectsApiContent;
        apiContent.innerHTML = apiHtml;
    }
    
    // Preencher outras seções
    if (architectureContent && window.architectureContent) {
        architectureContent.innerHTML = window.architectureContent;
    }
    
    if (examplesContent && window.examplesContent) {
        examplesContent.innerHTML = window.examplesContent;
    }
    
    if (faqContent && window.faqContent) {
        faqContent.innerHTML = window.faqContent;
        
        // Adicionar interatividade aos itens de FAQ
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const title = item.querySelector('h3');
            title.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }
    
    // Implementar navegação suave
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Destacar seção atual no menu
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.sidebar a');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightCurrentSection);
    
    // Inicializar destaques de código (se houver uma biblioteca de syntax highlighting)
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }
});
