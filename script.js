// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://ryeawlbuougixqbxwlmc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZWF3bGJ1b3VnaXhxYnh3bG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODcyMjMsImV4cCI6MjA5MTU2MzIyM30.zQzYiLW686aYXpPouEa9IBy0KScqhSlHtNwuPtepANk';
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

            // Limpeza de campos vazios para este form também
            for (let key in data) {
                if (data[key] === "") data[key] = null;
            }

            try {
                const { error } = await _supabase
                    .from('leads_rapidos') 
                    .insert([data]);

                if (error) throw error;

                console.log("Lead rápido salvo com sucesso!");
                abrirOferta();
                e.target.reset();
            } catch (err) {
                console.error("Erro no lead rápido:", err.message);
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

    // Transforma campos vazios em NULL para o banco aceitar
    for (let key in data) {
        if (data[key] === "" || data[key] === undefined) {
            data[key] = null;
        }
    }

    // Garante que os checkboxes enviem TRUE ou FALSE (booleano)
    data.pagamento_vista = !!e.target.pagamento_vista?.checked;
    data.pagamento_curto = !!e.target.pagamento_curto?.checked;
    data.pagamento_longo = !!e.target.pagamento_longo?.checked;

    try {
        const { error } = await _supabase
            .from('ficha_cadastro') 
            .insert([data]);

        if (error) throw error;

        alert("Ficha enviada com sucesso!");
        e.target.reset();
    } catch (err) {
        console.error("Erro:", err.message);
        alert("Erro ao enviar: " + err.message);
    }
});
    }

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

    if (formLead) {
        setTimeout(abrirOferta, 1500);
    }
});

window.onclick = (event) => {
    const modal = document.getElementById('modalOferta');
    if (event.target == modal) fecharModal();
};
