// CONFIGURAÇÃO SUPABASE
// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_KEY = 'SUA_CHAVE_ANON_AQUI';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* 2. CONTROLE DO MODAL */
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

/* 3. CARREGAMENTO E EVENTOS PRINCIPAIS */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- FORMULÁRIO 1: LEADS RÁPIDOS (Index / Modal) ---
    const formLead = document.getElementById('formLeadRapido');
    if (formLead) {
        formLead.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const { error } = await _supabase
                    .from('leads_rapidos') 
                    .insert([data]);

                if (error) throw error;

                console.log("Lead rápido salvo com sucesso!");
                abrirOferta(); // Abre o modal de oferta após o cadastro rápido
                e.target.reset();
            } catch (err) {
                console.error("Erro no lead rápido:", err.message);
                // Mesmo se falhar o banco, abrimos o modal para não frustrar o usuário
                abrirOferta();
            }
        });
    }

    // --- FORMULÁRIO 2: FICHA DE CADASTRO (Página completa) ---
    const formFicha = document.getElementById('formReservaCompleta');
    if (formFicha) {
        formFicha.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Captura os valores dos checkboxes (booleanos)
            data.pagamento_vista = e.target.pagamento_vista?.checked || false;
            data.pagamento_curto = e.target.pagamento_curto?.checked || false;
            data.pagamento_longo = e.target.pagamento_longo?.checked || false;

            try {
                const { error } = await _supabase
                    .from('ficha_cadastro') 
                    .insert([data]);

                if (error) throw error;

                alert("Ficha de cadastro enviada com sucesso! Entraremos em contato.");
                e.target.reset();
            } catch (err) {
                console.error("Erro na ficha de cadastro:", err.message);
                alert("Erro ao enviar ficha: " + err.message);
            }
        });
    }

    // Efeito de Revelação (Scroll Reveal) para os itens da página
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

    // Modal Automático após 1.5 segundos na home
    if (formLead) {
        setTimeout(abrirOferta, 1500);
    }
});

// Fechar modal ao clicar fora da caixa branca
window.onclick = (event) => {
    const modal = document.getElementById('modalOferta');
    if (event.target == modal) fecharModal();
};
