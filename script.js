/* CONTROLE DO MODAL */
function abrirOferta() {
    const modal = document.getElementById('modalOferta');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function fecharModal() {
    const modal = document.getElementById('modalOferta');
    if (modal) {
        modal.style.display = 'none';
    }
}

function irParaCadastro() {
    window.location.href = 'cadastro.html';
}

/* CARREGAMENTO E EVENTOS */
document.addEventListener('DOMContentLoaded', () => {
    
    // Envio do Formulário
    const formLead = document.getElementById('formLeadRapido');
    if (formLead) {
        formLead.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                await fetch('leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (err) {
                console.warn("Falha no salvamento silencioso");
            }

            abrirOferta();
            e.target.reset();
        });
    }

    // Modal Automático após 1.5s
    setTimeout(abrirOferta, 1500);

    // Efeito de Revelação (Scroll Reveal)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = '0.6s ease-out';
        observer.observe(el);
    });
});

// Fechar ao clicar fora
window.onclick = (event) => {
    const modal = document.getElementById('modalOferta');
    if (event.target == modal) fecharModal();
};
