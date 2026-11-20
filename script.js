document.addEventListener('DOMContentLoaded', function() {
// Função para mostrar a barra (substitui os alertas feios)
window.mostrarBarra = function(estado, mensagem) {
    const barra = document.getElementById('barra-progresso');
    const texto = document.getElementById('barra-texto');
 if (!barra || !texto) return;

    barra.className = 'barra-progresso ativa ' + estado;
    texto.textContent = mensagem;

    if (estado === 'sucesso' || estado === 'erro') {
        setTimeout(() => {
            barra.classList.remove('ativa');
        }, 3000); // A barra desaparece após 3 segundos
    }
};

// Botão de fechar a barra manualmente
const barraFechar = document.getElementById('barra-fechar');
if (barraFechar) {
    barraFechar.addEventListener('click', function() {
        document.getElementById('barra-progresso').classList.remove('ativa');
    });
}
// 1. Menu Hambúrguer
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

if(menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
        // Abre e fecha o menu
        navMenu.classList.toggle('active');
        // Transforma as riscas em X
        menuBtn.classList.toggle('ativo');
    });
}
    // 2. Abrir e Fechar Modais
    window.abrirModal = function(id) {
        document.getElementById(id).style.display = 'flex';
    };
    window.fecharModal = function(id) {
        document.getElementById(id).style.display = 'none';
    };

    document.getElementById('btn-sobre').addEventListener('click', () => abrirModal('modal-sobre'));
    document.getElementById('btn-comunidade').addEventListener('click', () => abrirModal('modal-comunidade'));
    document.getElementById('btn-entrar').addEventListener('click', () => abrirModal('modal-login'));

    // 3. Alternar Abas no Modal de Login (Entrar, Cadastro, Recuperar)
    window.mudarAba = function(aba) {
        document.getElementById('aba-login').style.display = 'none';
        document.getElementById('aba-cadastro').style.display = 'none';
        document.getElementById('aba-reset').style.display = 'none';
        document.getElementById(aba).style.display = 'block';
    };

    // Fechar modal ao clicar fora
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    };

// ==========================================
// LÓGICA DE FORMULÁRIOS (INTEGRAÇÃO WHATSAPP PRIVADO)
// ==========================================

// O TEU NÚMERO PRIVADO PARA RECEBER OS DADOS
const MEU_NUMERO = "244957335202"; 

// 1. Formulário de Cadastro de Cliente
const formCadastroReal = document.getElementById('form-cadastro-real');
if (formCadastroReal) {
    formCadastroReal.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('cad-nome').value;
        const email = document.getElementById('cad-email').value;
        const telefone = document.getElementById('cad-telefone').value;
        const senha = document.getElementById('cad-senha').value;

        if(senha.length < 6) {
            mostrarBarra('erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        mostrarBarra('carregando', 'A preparar o teu registo...');

        setTimeout(() => {
            // Formata a mensagem para ti
            const texto = `*NOVO REGISTO NO SITE*\n\n*Nome:* ${nome}\n*Email:* ${email}\n*Telefone:* ${telefone}\n*Senha:* ${senha}\n\n(Nota: A senha será tratada no Firebase em breve).`;
            
            // Abre no TEU número privado
            const linkWhats = `https://wa.me/${MEU_NUMERO}?text=${encodeURIComponent(texto)}`;
            
            mostrarBarra('sucesso', 'Dados enviados! A abrir o WhatsApp...');
            window.open(linkWhats, '_blank');
            formCadastroReal.reset();
            fecharModal('modal-login');
        }, 1200);
    });
}

// 2. Formulário de Login (Simulação de envio)
const formLoginReal = document.getElementById('form-login-real');
if (formLoginReal) {
    formLoginReal.addEventListener('submit', function(e) {
        e.preventDefault();
        mostrarBarra('carregando', 'A autenticar...');
        setTimeout(() => {
            // Como ainda não temos Firebase real, enviamos para o Whats
            const email = document.getElementById('login-email').value;
            const texto = `*TENTATIVA DE LOGIN*\n\nO cliente *${email}* está a tentar entrar na Área do Cliente.`;
            window.open(`https://wa.me/${MEU_NUMERO}?text=${encodeURIComponent(texto)}`, '_blank');
            mostrarBarra('sucesso', 'A abrir o WhatsApp...');
        }, 1000);
    });
}

// 3. Formulário de Comunidade (O MAIS IMPORTANTE)
const formComunidadeReal = document.getElementById('form-comunidade-real');
if (formComunidadeReal) {
    formComunidadeReal.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Apanhar todos os valores
        const nome = document.getElementById('com-nome').value;
        const idade = document.getElementById('com-idade').value || 'Não informada';
        const telefone = document.getElementById('com-telefone').value;
        const area = document.getElementById('com-area').value;
        const habilidade = document.getElementById('com-habilidade').value;
        const sabe = document.getElementById('com-sabe').value;
        const disp = document.getElementById('com-disponibilidade').value;
        const motivo = document.getElementById('com-motivo').value;

        mostrarBarra('carregando', 'A processar a tua candidatura...');

        setTimeout(() => {
            // Formatar uma mensagem MUITO organizada para ti
const texto = `*NOVA CANDIDATURA À COMUNIDADE*\n\n` +`*Nome:* ${nome}\n` +`*Idade:* ${idade}\n` +`*Telefone:* ${telefone}\n` + `*Área:* ${area}\n` + `*Nível:* ${habilidade}\n` +`*Habilidades:* ${sabe}\n` +
`*Disponibilidade:* ${disp}\n` +
`*Motivo:* ${motivo}`;
// Envia para o TEU número
const linkWhats = `https://wa.me/${MEU_NUMERO}?text=${encodeURIComponent(texto)}`;
            
            mostrarBarra('sucesso', 'Candidatura pronta! A abrir o WhatsApp...');
            window.open(linkWhats, '_blank');
            formComunidadeReal.reset();
            fecharModal('modal-comunidade');
        }, 1500);
    });
}

// ==========================================
// 6. FORMULÁRIO DE RECUPERAÇÃO DE SENHA
// ==========================================
const formResetReal = document.getElementById('form-reset-real');
if (formResetReal) {
    formResetReal.addEventListener('submit', function(e) {
        e.preventDefault();
        
const email = document.getElementById('reset-email').value;
const btnSubmit = formResetReal.querySelector('button[type="submit"]');

// 1. Mostra a barra azul a carregar
mostrarBarra('carregando', 'A verificar o e-mail...');

// Bloqueia o botão temporariamente
 btnSubmit.disabled = true;
 btnSubmit.innerHTML = 'A processar...';

 setTimeout(() => {
// 2. Mostra a barra verde de sucesso
mostrarBarra('sucesso', 'Link de recuperação enviado (Simulação)!');
            
    // Restaura o botão
btnSubmit.disabled = false;
btnSubmit.innerHTML = 'Enviar Link de Recuperação';
//Opcional: Fecha a janela após 3 segundos
setTimeout(() => {
formResetReal.reset();
fecharModal('modal-login');
            }, 3000);

        }, 1500);
    });
}   

// ==========================================
// 8. CHATBOT INTELIGENTE (Baseado em Regras)
// ==========================================
window.abrirChat = function() {
    document.getElementById('chat-window').style.display = 'flex';
    // Esconde o botão verde do WhatsApp para não sobrepor
    const btnWhats = document.querySelector('.btn-whatsapp-flutuante');
    if(btnWhats) btnWhats.style.display = 'none';
};

window.fecharChat = function() {
    document.getElementById('chat-window').style.display = 'none';
    // Mostra o botão verde novamente
    const btnWhats = document.querySelector('.btn-whatsapp-flutuante');
    if(btnWhats) btnWhats.style.display = 'flex';
};

const abrirChatBtn = document.getElementById('abrir-chat');
const abrirChatBtn1 = document.getElementById('abrir-chat1');
if(abrirChatBtn || abrirChatBtn1)
abrirChatBtn.addEventListener('click', abrirChat);
abrirChatBtn1.addEventListener('click', abrirChat);
const fecharChatBtn = document.getElementById('fechar-chat');
if(fecharChatBtn) fecharChatBtn.addEventListener('click', fecharChat);

const chatSend = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');

function adicionarMensagem(texto, tipo) {
    const div = document.createElement('div');
    div.className = tipo === 'bot' ? 'mensagem-bot' : 'mensagem-user';
    div.innerHTML = texto; // Usamos innerHTML para podermos colocar links
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight; // Rola para o fim
}

if(chatSend && chatInput && chatBody) {
    chatSend.addEventListener('click', function() {
        const texto = chatInput.value.trim();
        if (texto === '') return;
        
        adicionarMensagem(texto, 'user');
        chatInput.value = '';
        
        // O Bot a "pensar" por 1 segundo
 setTimeout(() => {
const msg = texto.toLowerCase();
    let resposta = "";

 if (msg.includes('preço') || msg.includes('custo') || msg.includes('quanto') || msg.includes('valor')) {
resposta = "Os preços variam consoante a complexidade do projeto. <br><br>Se precisares de <strong>urgência</strong>, o valor pode sofrer um acréscimo. Para um orçamento exato, clica no botão do WhatsApp e fala comigo!";
            } 
else if (msg.includes('tempo') || msg.includes('prazo') || msg.includes('demora')) {
resposta = "O tempo de criação depende do que precisas: <br>• <strong>Sites simples:</strong> 3 a 7 dias.<br>• <strong>Aplicações complexas:</strong> 2 a 4 semanas.<br>• <strong>Documentos/CV:</strong> 24 a 48 horas.<br><br>Se for urgente, falamos no WhatsApp para acelerar o processo!";
            }
else if (msg.includes('quem') || msg.includes('antónio') || msg.includes('antonio') || msg.includes('criador')) {
resposta = "Sou o assistente virtual do <strong>António Manuel</strong>. Ele é desenvolvedor web, programador e estudante de Cibersegurança . O foco dele é criar soluções seguras, transparentes e eficaz para os clientes.";
}
else if (msg.includes('comunidade') || msg.includes('equipa') || msg.includes('trabalhar')) {
resposta = "A comunidade é a equipa de colegas e amigos do António. Juntos, dividimos tarefas para entregar sites, documentos e suporte técnico com alta qualidade. Se queres fazer parte, clica no menu 'Comunidade' e preenche a candidatura!";
            }
else if (msg.includes('serviço') || msg.includes('faz') || msg.includes('fazes')) {
resposta = "O António e a equipa fazem de tudo um pouco na área da informática: <br>• Criação de Sites e Apps<br>• Documentos e CVs<br>• Trabalhos Académicos<br>• Hardware e Redes<br>• Segurança Digital e Mais.";
 }
else if (msg.includes('ganha') || msg.includes('ganho') || msg.includes('programador')|| msg.includes('desenvolvedor') || msg.includes('pagam')) {
resposta = "Tudo depende da sua produtividade, criação e paciência (alguns casos)<br>• Criação de Sites e Apps se o rendimento for alto, ganha mais<br>• Documentos e CVs se o rendimento for alto, ganha mais<br>• Trabalhos Académicos se o rendimento for alto, ganha mais<br>• Hardware e Redes se o rendimento for alto, ganha mais<br>• Segurança Digital e Mais. Dependem do problema detectado.";
}
else if (msg.includes('whatsapp') || msg.includes('contacto') || msg.includes('falar')) {
resposta = 'Podes falar diretamente com o António clicando <a href="https://wa.me/244957335202" target="_blank" style="color:#2563eb; font-weight:bold;">aqui neste link do WhatsApp</a>. Ele responde o mais rápido possível!';
}
else if (msg.includes('és') || msg.includes('ia') || msg.includes('criado por')|| msg.includes('IA') || msg.includes('criador') || msg.includes('você') || msg.includes('Empresa') || msg.includes('empresa') || msg.includes('Quem  é António Manuel') || msg.includes('AM') ) {
resposta = "Sim, sou um Assistente digital crido por António Manuel na empresa António Manuel (AM).";
}
else if (msg.includes('olá') || msg.includes('oi') || msg.includes('bom dia') || msg.includes('boa tarde')) {
resposta = "Olá! Em que posso ajudar hoje? Podes perguntar sobre preços, prazos, quem é o António, ou o que a comunidade faz.";
}
 else {
resposta = "Não tenho a certeza sobre isso, mas o António sabe tudo! Clica <a href='https://chat.whatsapp.com/FOh33nqyaecJQBmHHE9vSZ' target='_blank' style='color:#2563eb; font-weight:bold;'>aqui para falar com ele no WhatsApp</a> e ele responde-te diretamente.";
            }

adicionarMensagem(resposta, 'bot');
        }, 1000);
    });

    // Permitir enviar com a tecla Enter
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            chatSend.click();
        }
    });
}

  /*  if(abrirChatBtn || abrirChatBtn1) {
abrirChatBtn.addEventListener('click', () => chatWindow.style.display = 'block');
abrirChatBtn1.addEventListener('click', () => chatWindow.style.display = 'block');

  fecharChatBtn.addEventListener('click', () => chatWindow.style.display = 'none');

        function adicionarMensagem(texto, tipo) {
            const div = document.createElement('div');
            div.className = tipo === 'bot' ? 'mensagem-bot' : 'mensagem-user';
            div.textContent = texto;
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
function responderBot(mensagem) {
            const msg = mensagem.toLowerCase();
setTimeout(() => {
      if (msg.includes('preço') || msg.includes('custo')) {
adicionarMensagem("Os preços variam. Fala comigo no WhatsApp para um orçamento!", 'bot');
} else if (msg.includes('site') || msg.includes('web')) {
adicionarMensagem("Faço sites seguros e prontos para o telemóvel. Queres ver exemplos?", 'bot');
 } else if (msg.includes('seguro') || msg.includes('pronto')) {
adicionarMensagem("A segurança é o meu foco! Podes ver o estado do teu projeto na Área do Cliente.", 'bot');
} else {
 adicionarMensagem("Para te responder melhor, clica no botão verde e fala direto comigo!", 'bot');
                }
            }, 1200);
        }

 chatSend.addEventListener('click', () => {
 const texto = chatInput.value.trim();
if (texto === '') return;
            adicionarMensagem(texto, 'user');
            chatInput.value = '';
            responderBot(texto);
        });
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') chatSend.click();
        });
    }*/
// 6. Carrossel Automático (Slideshow)
const slides = document.querySelectorAll('.slide');
if (slides.length > 0) {
  let slideAtual = 0;
  
  function mudarSlide() {
    // Tira a classe 'active' da imagem atual
    slides[slideAtual].classList.remove('active');
    
    // Passa para a próxima imagem
    slideAtual = (slideAtual + 1) % slides.length;
    
    // Adiciona 'active' à nova imagem
    slides[slideAtual].classList.add('active');
  }

  // Muda a imagem a cada 3000 milissegundos (3 segundos)
  setInterval(mudarSlide, 3000);
}
// ==========================================
// 5. FORMULÁRIO: COMUNIDADE (Lógica Melhorada)
// ==========================================
const formComunidade = document.getElementById('form-comunidade-real');
if (formComunidade) {
    formComunidade.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('com-nome').value;
        const telefone = document.getElementById('com-telefone').value;
        const area = document.getElementById('com-area').value;
        const habilidade = document.getElementById('com-habilidade').value;
        const sabe = document.getElementById('com-sabe').value;
        const disp = document.getElementById('com-disponibilidade').value;
        const motivo = document.getElementById('com-motivo').value;

        if(!nome || !telefone || !area || !habilidade || !sabe) {
            mostrarBarra('erro', 'Preenche os campos obrigatórios (*).');
            return;
        }

        // 1. Mostra a barra azul
        mostrarBarra('carregando', 'A processar a tua candidatura...');

        // 2. Muda o texto do botão para dar feedback visual
        const btnSubmit = formComunidade.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'A abrir o WhatsApp...';
        btnSubmit.disabled = true;

        setTimeout(() => {
            const texto = `*NOVA CANDIDATURA À COMUNIDADE*\n\n` +
                          `*Nome:* ${nome}\n` +
                          `*Telefone:* ${telefone}\n` +
                          `*Área:* ${area}\n` +
                          `*Nível:* ${habilidade}\n` +
                          `*Habilidades:* ${sabe}\n` +
                          `*Disponibilidade:* ${disp}\n` +
                          `*Motivo:* ${motivo}`;
            
            const linkWhats = `https://wa.me/${MEU_NUMERO}?text=${encodeURIComponent(texto)}`;
            
            // 3. Barra verde de sucesso
            mostrarBarra('sucesso', 'Candidatura pronta! Abre o WhatsApp para enviar.');
            
            // 4. Abre o WhatsApp
            window.open(linkWhats, '_blank');
            
            // 5. Limpa o formulário e restaura o botão APÓS 3 segundos (dá tempo para o utilizador ver)
            setTimeout(() => {
                formComunidade.reset();
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;
                
                // Opcional: Fecha a janela automaticamente após 5 segundos (dá tempo do utilizador voltar ao site)
                fecharModal('modal-comunidade');
            }, 3000);

        }, 1500);
    });
}

// ==========================================
// 4. FORMULÁRIO: SOBRE (Contacto Rápido Melhorado)
// ==========================================
const formContacto = document.getElementById('form-contacto-rapido');
if (formContacto) {
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('contacto-nome').value;
        const mensagem = document.getElementById('contacto-mensagem').value;
        
        if(!nome || !mensagem) {
            mostrarBarra('erro', 'Por favor, preenche todos os campos.');
            return;
        }

        mostrarBarra('carregando', 'A preparar a tua mensagem...');
        
        const btnSubmit = formContacto.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'A abrir o WhatsApp...';
        btnSubmit.disabled = true;

        setTimeout(() => {
            const textoFormatado = `Olá António! Meu nome é ${nome}. Preciso de ajuda com o seguinte: ${mensagem}`;
            const linkWhatsApp = `https://wa.me/${MEU_NUMERO}?text=${encodeURIComponent(textoFormatado)}`;
            
            mostrarBarra('sucesso', 'Mensagem pronta! Abre o WhatsApp para enviar.');
            window.open(linkWhatsApp, '_blank');
            
            setTimeout(() => {
                formContacto.reset();
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;
                fecharModal('modal-sobre');
            }, 3000);
        }, 1200);
    });
}
});