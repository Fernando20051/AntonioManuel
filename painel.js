const firebaseConfig = {
  apiKey: "AIzaSyAIIuJmOB2aMctISubZ7YDcZSQuEQoEDKo",
  authDomain: "antonio-manuel-site.firebaseapp.com",
  projectId: "antonio-manuel-site",
  storageBucket: "antonio-manuel-site.firebasestorage.app",
  messagingSenderId: "932034090596",
  appId: "1:932034090596:web:bd316ebed091caed537171"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==========================================
// 1. BARRA DE PROGRESSO E MENU
// ==========================================
function mostrarBarra(estado, mensagem) {
    const barra = document.getElementById('barra-progresso');
    const texto = document.getElementById('barra-texto');
    if (!barra || !texto) return;
    barra.className = 'barra-progresso ativa ' + estado;
    texto.textContent = mensagem;
    if (estado === 'sucesso' || estado === 'erro') {
        setTimeout(() => barra.classList.remove('ativa'), 3000);
    }
}
//const menuAcoes = document.getElementById('menu-acoes');
const btn = document.getElementById('btn-menu');
btn.addEventListener('click', toggleMenu);
const btnsair = document.getElementById('btn-sair');
btnsair.addEventListener('click',sairDaConta);
// Função para abrir/fechar o menu e mudar as linhas para X
function toggleMenu() {
    const menu = document.getElementById('menu-acoes');
    if (menu) menu.classList.toggle('active');
    if (btn) btn.classList.toggle('ativo');
}

// Fechar o menu ao clicar nos links/botões
document.addEventListener('DOMContentLoaded', function() {
    const menu = document.getElementById('menu-acoes');
    const btn = document.getElementById('btn-menu');
    
    if (menu && btn) {
        menu.querySelectorAll('a, button').forEach(function(item) {
            item.addEventListener('click', function() {
menu.classList.remove('active');
 btn.classList.remove('ativo');
            });
        });
    }
});

function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

// Fecha o menu ao clicar nos botões
document.addEventListener('DOMContentLoaded', function() {

// ==========================================
// 2. VERIFICAR LOGIN E CARREGAR DADOS
// ==========================================
auth.onAuthStateChanged((user) => {
if (!user) {
 window.location.href = "login.html";
} else {
        carregarPainel(user.uid);
}
});

function carregarPainel(uid) {
    db.collection("clientes").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const dados = doc.data();
            const primeiroNome = dados.nome.split(' ')[0];
            document.getElementById('nome-cliente').textContent = primeiroNome;
            document.getElementById('ola-cliente').textContent = `Olá, ${primeiroNome}`;
            document.getElementById('avatar-inicial').textContent = primeiroNome.charAt(0).toUpperCase();
            document.getElementById('def-nome').value = dados.nome;
            document.getElementById('def-telefone').value = dados.telefone;
            document.getElementById('def-email').value = dados.email;
        }
    });

    db.collection("pedidos").where("clienteUid", "==", uid).get().then((querySnapshot) => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('conteudo').style.display = 'block';

        if (querySnapshot.empty) {
            document.getElementById('estado-vazio').style.display = 'block';
        } else {
            const lista = document.getElementById('lista-pedidos');
            lista.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const pedido = doc.data();
                let classeSelo = 'selo-analise';
                let textoEstado = 'Em Análise';
                if (pedido.estado === 'em_andamento') { classeSelo = 'selo-andamento'; textoEstado = 'Em Andamento'; }
                if (pedido.estado === 'pronto') { classeSelo = 'selo-concluido'; textoEstado = 'Concluído'; }

                lista.innerHTML += `
                    <div class="cartao-pedido">
                        <div class="topo-pedido">
                            <h3>${pedido.titulo || pedido.servico}</h3>
                            <span class="selo ${classeSelo}">${textoEstado}</span>
                        </div>
                        <div class="caixa-mensagem">
                            <strong>O que pediste:</strong>
                            <p>${pedido.descricao}</p>
                        </div>
                        <div class="bloco-pagamento">
                            <div><strong>Valor:</strong> ${pedido.preco || 'A combinar'}</div>
                            <div>${pedido.pago ? '<span style="color:#15803d; font-weight:bold;">Pago</span>' : '<span style="color:#b91c1c; font-weight:bold;">Pendente</span>'}</div>
                        </div>
                    </div>
                `;
            });
        }
    });
}

// ==========================================
// 3. NOVO PEDIDO (Com Barra)
// ==========================================
document.getElementById('form-novo-pedido').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const servico = document.getElementById('pedido-servico').value;
    const titulo = document.getElementById('pedido-titulo').value;
    const descricao = document.getElementById('pedido-descricao').value;

    mostrarBarra('carregando', 'A enviar o teu pedido...');

    db.collection("pedidos").add({
        clienteUid: user.uid,
        servico: servico,
        titulo: titulo,
        descricao: descricao,
        estado: "em_analise",
        pago: false,
        criadoEm: new Date()
    })
    .then(() => {
        mostrarBarra('sucesso', 'Pedido enviado com sucesso!');
        fecharModal('modal-pedido');
        document.getElementById('form-novo-pedido').reset();
        setTimeout(() => window.location.reload(), 2000);
    })
    .catch(() => {
        mostrarBarra('erro', 'Erro ao enviar o pedido.');
    });
});

// ==========================================
// 4. ALTERAR DADOS (Com Barra)
// ==========================================
document.getElementById('form-definicoes').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = auth.currentUser;
    const novoEmail = document.getElementById('def-email').value;
    const senhaAtual = document.getElementById('def-senha-atual').value;
    const novaSenha = document.getElementById('def-nova-senha').value;
    const confirmaSenha = document.getElementById('def-confirma-senha').value;

    mostrarBarra('carregando', 'A verificar os teus dados...');

    if (novaSenha !== '') {
        if (senhaAtual === '') { return mostrarBarra('erro', 'Digita a senha atual.'); }
        if (novaSenha !== confirmaSenha) { return mostrarBarra('erro', 'As senhas novas não coincidem.'); }
    }
    
    if (senhaAtual === '') { return mostrarBarra('erro', 'Digita a senha atual para guardar.'); }

    const credencial = firebase.auth.EmailAuthProvider.credential(user.email, senhaAtual);
    
    user.reauthenticateWithCredential(credencial).then(() => {
        if (novoEmail !== '' && novoEmail !== user.email) {
            user.updateEmail(novoEmail).then(() => {
                db.collection("clientes").doc(user.uid).update({ email: novoEmail });
            });
        }
        if (novaSenha !== '') {
            user.updatePassword(novaSenha);
        }

        mostrarBarra('sucesso', 'Dados alterados com sucesso!');
        setTimeout(() => fecharModal('modal-definicoes'), 1500);
        document.getElementById('form-definicoes').reset();

    }).catch(() => {
        mostrarBarra('erro', 'Senha atual incorreta ou erro.');
    });
});

// 5. SAIR
// ==========================================
});
function sairDaConta() {
    auth.signOut().then(() => window.location.href = "index.html");
}