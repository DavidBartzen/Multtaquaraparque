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

            // Feedback visual no botão
            const btn = e.target.querySelector('button');
            const textoOriginal = btn.innerText;
            btn.disabled = true;
            btn.innerText = "ENVIANDO...";

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Limpeza de campos vazios
            for (let key in data) {
                if (data[key] === "") data[key] = null;
            }

            try {
                const { error } = await _supabase
                    .from('leads_rapidos') 
                    .insert([data]);

                if (error) throw error;

                // NOTIFICAÇÃO DE SUCESSO NO SITE
                alert("✅ Sucesso! Seu cadastro foi realizado. Confira nossa oferta especial!");
                
                e.target.reset(); // Limpa os campos
                abrirOferta();    // Abre o modal de oferta

            } catch (err) {
                console.error("Erro no lead rápido:", err.message);
                alert("Erro ao enviar: " + err.message);
            } finally {
                // Restaura o botão
                btn.disabled = false;
                btn.innerText = textoOriginal;
            }
        });
    }

    // --- FORMULÁRIO 2: FICHA DE CADASTRO (Página completa) ---
    const formFicha = document.getElementById('formReservaCompleta');
    if (formFicha) {
        formFicha.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = e.target.querySelector('button');
            const textoOriginal = btn?.innerText;
            if(btn) {
                btn.disabled = true;
                btn.innerText = "ENVIANDO FICHA...";
            }

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Transforma campos vazios em NULL
            for (let key in data) {
                if (data[key] === "" || data[key] === undefined) {
                    data[key] = null;
                }
            }

            // Garante que os checkboxes enviem booleano
            data.pagamento_vista = !!e.target.pagamento_vista?.checked;
            data.pagamento_curto = !!e.target.pagamento_curto?.checked;
            data.pagamento_longo = !!e.target.pagamento_longo?.checked;

            try {
                const { error } = await _supabase
                    .from('ficha_cadastro') 
                    .insert([data]);

                if (error) throw error;

                alert("✅ Ficha enviada com sucesso! Entraremos em contato em breve.");
                e.target.reset();
            } catch (err) {
                console.error("Erro:", err.message);
                alert("Erro ao enviar ficha: " + err.message);
            } finally {
                if(btn) {
                    btn.disabled = false;
                    btn.innerText = textoOriginal;
                }
            }
        });
    }

    // --- EFEITO DE REVELAÇÃO (Scroll Reveal) ---
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

    // Abre o modal automaticamente após 1.5s apenas se o formulário de lead existir (página inicial)
    if (formLead) {
        setTimeout(abrirOferta, 1500);
    }
});

// Fecha o modal ao clicar fora dele
window.onclick = (event) => {
    const modal = document.getElementById('modalOferta');
    if (event.target == modal) fecharModal();
};
