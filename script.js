// CONFIGURAÇÃO SUPABASE
// Pegue esses dados em: Settings > API no seu painel do Supabase
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_KEY = 'sua-chave-anon-public';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* CONTROLE DO MODAL */
function abrirOferta() {
    const modal = document.getElementById('modalOferta');
    if (modal) modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modalOferta');
    if (modal) modal.style.display = 'none';
}

function irParaCadastro() {
    window.location.href = 'cadastro.html';
}

/* CARREGAMENTO E EVENTOS */
document.addEventListener('DOMContentLoaded', () => {
    
    // Envio do Formulário para o Supabase
    const formLead = document.getElementById('formLeadRapido');
    if (formLead) {
        formLead.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                // Insere os dados na tabela 'leads' do seu banco Postgres
                const { error } = await _supabase
                    .from('leads') 
                    .insert([data]);

                if (error) throw error;

                console.log("Sucesso: Lead salvo no Supabase!");
                abrirOferta(); // Abre o modal após o salvamento
                e.target.reset();

            } catch (err) {
                console.error("Erro ao salvar no banco:", err.message);
                // Mesmo com erro, abrimos o modal para não travar a experiência do usuário
                abrirOferta();
            }
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

window.onclick = (event) => {
    const modal = document.getElementById('modalOferta');
    if (event.target == modal) fecharModal();
};
