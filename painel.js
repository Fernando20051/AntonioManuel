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
// 1. FUNÇÕES BÁSICAS E DA BARRA DE PROGRESSO
// ==========================================
function mostrarBarra(estado, mensagem) {
    const barra = document.getElementById('barra-progresso');
    const texto = document.getElementById('barra-texto');
    if (!barra || !texto) return;

    barra.className = 'barra-progresso ativa ' + estado;
    texto.textContent = mensagem;

    if (estado === 'sucesso' || estado === 'erro') {
        setTimeout(() => {
            barra.classList.remove('ativa');
        }, 3000); // A barra esconde-se após 3 segundos
    }
}

function esconderBarra() {
    const barra = document.getElementById('barra-progresso');
    if (barra) barra.classList.remove('ativa');
}

function toggleMenu() {
    const menu = document.getElementById('menu-acoes');
    const btn = document.getElementById('btn-menu');
    if (menu) menu.classList.toggle('active');
    if (btn) btn.classList.toggle('ativo');
}

function abrirModal(id) { 
    const m = document.getElementById(id); 
    if(m) m.style.display = 'flex'; 
}

function fecharModal(id) { 
    const m = document.getElementById(id); 
    if(m) m.style.display = 'none'; 
}

function sairDaConta() {
    mostrarBarra('carregando', 'A terminar a sessão...');
    auth.signOut().then(() => window.location.replace("index.html"))
    .catch(() => mostrarBarra('erro', 'Erro ao sair.'));
}

// Fechar o menu ao clicar num link
document.addEventListener('DOMContentLoaded', function() {
    const menuAcoes = document.getElementById('menu-acoes');
    const btnMenu = document.getElementById('btn-menu');
    if (menuAcoes && btnMenu) {
        menuAcoes.querySelectorAll('a, button').forEach(function(item) {
            if (item.classList.contains('btn-sair')) return;
            item.addEventListener('click', function() {
                menuAcoes.classList.remove('active');
                btnMenu.classList.remove('ativo');
            });
        });
    }
});

// ==========================================
// 2. VERIFICAÇÃO DE LOGIN E CARREGAMENTO INICIAL
// ==========================================
auth.onAuthStateChanged((user) => {
    if (!user) {
        document.body.style.display = 'none';
        setTimeout(() => window.location.replace("login.html"), 1000);
    } else {
        document.body.style.display = 'block'; 
        carregarPainel(user.uid);
    }
});

function carregarPainel(uid) {
    // 1. Carregar Nome e Definições
    db.collection("clientes").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const dados = doc.data();
            const primeiroNome = dados.nome.split(' ')[0];
            
            if(document.getElementById('nome-cliente')) document.getElementById('nome-cliente').textContent = primeiroNome;
            if(document.getElementById('ola-cliente')) document.getElementById('ola-cliente').textContent = `Olá, ${primeiroNome}`;
            if(document.getElementById('avatar-inicial')) document.getElementById('avatar-inicial').textContent = primeiroNome.charAt(0).toUpperCase();
            
            if(document.getElementById('def-nome')) document.getElementById('def-nome').value = dados.nome;
            if(document.getElementById('def-telefone')) document.getElementById('def-telefone').value = dados.telefone;
            if(document.getElementById('def-email')) document.getElementById('def-email').value = dados.email;
        }
    });

    // 2. Carregar Pedidos
    db.collection("pedidos").where("clienteUid", "==", uid).get()
    .then((querySnapshot) => {
        if(document.getElementById('loading')) document.getElementById('loading').style.display = 'none';
        if(document.getElementById('conteudo')) document.getElementById('conteudo').style.display = 'block';

        const lista = document.getElementById('lista-pedidos');
        if(!lista) return;
        lista.innerHTML = '';

        if (querySnapshot.empty) {
            if(document.getElementById('estado-vazio')) document.getElementById('estado-vazio').style.display = 'block';
            return;
        } else {
            if(document.getElementById('estado-vazio')) document.getElementById('estado-vazio').style.display = 'none';
        }

        querySnapshot.forEach((doc) => {
            const pedido = doc.data();
            const id = doc.id;
            
            let classeSelo = 'selo-analise', textoEstado = 'Em Análise';
            if (pedido.estado === 'em_andamento') { classeSelo = 'selo-andamento'; textoEstado = 'Em Andamento'; }
            if (pedido.estado === 'pronto') { classeSelo = 'selo-concluido'; textoEstado = 'Concluído'; }

            let botaoFatura = '';
            if (pedido.estado === 'pronto') {
                botaoFatura = `<button class="btn-acao btn-fatura" onclick="abrirFaturaCliente('${id}')">Ver Fatura</button>`;
            } else {
                botaoFatura = `<button class="btn-acao btn-fatura" disabled>A aguardar fatura</button>`;
            }

            // Correção para não quebrar se o título tiver aspas
            const tituloSeguro = (pedido.titulo || pedido.servico).replace(/'/g, "\\'");
            const descricaoSegura = (pedido.descricao || "").replace(/'/g, "\\'");

            const botaoEditar = (pedido.estado === 'em_analise' || pedido.estado === 'em_andamento') 
                ? `<button class="btn-acao btn-editar" onclick="abrirEditar('${id}', '${tituloSeguro}', '${descricaoSegura}')">Editar Pedido</button>` 
                : '';

            lista.innerHTML += `
                <div class="cartao-pedido">
                    <div class="topo-pedido">
                        <h3>${pedido.titulo || pedido.servico}</h3>
                        <span class="selo ${classeSelo}">${textoEstado}</span>
                    </div>
                    <div class="corpo-pedido">
                        <div class="descricao-pedido">${pedido.descricao}</div>
                        <div class="acoes-pedido" style="display:flex; gap:10px; flex-wrap:wrap;">
                            ${botaoEditar}
                            ${botaoFatura}
                        </div>
                    </div>
                </div>
            `;
        });
    })
    .catch((erro) => {
        console.error("Erro Firebase:", erro);
        document.getElementById('loading').innerHTML = "Erro ao carregar dados: " + erro.message;
        document.getElementById('loading').style.color = "red";
    });
}

// ==========================================
// 3. AÇÃO: NOVO PEDIDO
// ==========================================
document.getElementById('form-novo-pedido').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    mostrarBarra('carregando', 'A enviar o teu pedido...');

    db.collection("pedidos").add({
        clienteUid: user.uid, 
        servico: document.getElementById('pedido-servico').value, 
        titulo: document.getElementById('pedido-titulo').value, 
        descricao: document.getElementById('pedido-descricao').value,
        estado: "em_analise", pago: false, criadoEm: new Date()
    }).then(() => {
        mostrarBarra('sucesso', 'Pedido enviado!');
        fecharModal('modal-pedido');
        document.getElementById('form-novo-pedido').reset();
        setTimeout(() => window.location.reload(), 2000);
    }).catch((erro) => {
        console.error(erro);
        mostrarBarra('erro', 'Erro ao enviar. Tenta novamente.');
        esconderBarra();
    });
});

// ==========================================
// 4. AÇÃO: EDITAR PEDIDO
// ==========================================
function abrirEditar(id, titulo, descricao) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-titulo').value = titulo;
    document.getElementById('edit-descricao').value = descricao;
    abrirModal('modal-editar');
}

document.getElementById('form-editar-pedido').addEventListener('submit', function(e) {
    e.preventDefault();
    const idPedido = document.getElementById('edit-id').value;
    const novoTitulo = document.getElementById('edit-titulo').value;
    const novaDescricao = document.getElementById('edit-descricao').value;

    mostrarBarra('carregando', 'A actualizar o pedido...');

    db.collection("pedidos").doc(idPedido).update({
        titulo: novoTitulo,
        descricao: novaDescricao
    }).then(() => {
        mostrarBarra('sucesso', 'Pedido actualizado!');
        setTimeout(() => {
            esconderBarra();
            fecharModal('modal-editar');
            window.location.reload();
        }, 2000);
    }).catch((erro) => {
        console.error(erro);
        mostrarBarra('erro', 'Erro ao actualizar. Tenta novamente.');
        esconderBarra();
    });
});

// ==========================================
// 5. AÇÃO: DEFINIÇÕES (MUDAR E-MAIL E SENHA)
// ==========================================
document.getElementById('form-definicoes').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = auth.currentUser;
    const novoEmail = document.getElementById('def-email').value;
    const senhaAtual = document.getElementById('def-senha-atual').value;
    const novaSenha = document.getElementById('def-nova-senha').value;
    
    if (senhaAtual === '') {
        mostrarBarra('erro', 'Digita a senha actual para guardar.');
        return;
    }

    mostrarBarra('carregando', 'A guardar as alterações...');

    const credencial = firebase.auth.EmailAuthProvider.credential(user.email, senhaAtual);
    user.reauthenticateWithCredential(credencial).then(() => {
        if (novoEmail !== '' && novoEmail !== user.email) {
            user.updateEmail(novoEmail).then(() => db.collection("clientes").doc(user.uid).update({email: novoEmail}));
        }
        if (novaSenha !== '') { user.updatePassword(novaSenha); }
        
        mostrarBarra('sucesso', 'Definições guardadas!');
        setTimeout(() => {
            esconderBarra();
            fecharModal('modal-definicoes');
        }, 2000);
    }).catch((erro) => {
        console.error(erro);
        mostrarBarra('erro', 'Senha actual incorrecta.');
        esconderBarra();
    });
});

// ==========================================
// 6. AÇÃO: FATURA DO CLIENTE
// ==========================================
function abrirFaturaCliente(idPedido) {
    mostrarBarra('carregando', 'A preparar a factura...');
    
    Promise.all([
        db.collection("pedidos").doc(idPedido).get(),
        db.collection("configuracoes").doc("empresa").get()
    ]).then(([docPedido, docEmpresa]) => {
        const pedido = docPedido.data();
        const empresa = docEmpresa.exists ? docEmpresa.data() : {};

        db.collection("clientes").doc(pedido.clienteUid).get().then((docCliente) => {
            const cliente = docCliente.data();

            document.getElementById('fat-c-emissor').innerHTML = `NIF: ${empresa.nif || 'N/A'} | Tel: ${empresa.telefone || 'N/A'}`;
            
            let infoPagamento = `<strong>${empresa.metodoNacional || 'N/A'}</strong><br>`;
            if(empresa.iban) infoPagamento += `IBAN: ${empresa.iban}<br>`;
            document.getElementById('fat-c-pagamento').innerHTML = infoPagamento;

            document.getElementById('fat-c-numero').textContent = '#' + idPedido.substring(0,6).toUpperCase();
            document.getElementById('fat-c-datas').textContent = `Emissão: ${new Date().toLocaleDateString('pt-PT')}`;
            document.getElementById('fat-c-cliente').textContent = `${cliente.nome} (${cliente.email})`;
            document.getElementById('fat-c-estado').textContent = pedido.pago ? 'PAGO' : 'PENDENTE';

            const preco = parseFloat(pedido.preco) || 0;
            const taxaIVA = parseFloat(pedido.iva) || 0;
            const valorIVA = preco * (taxaIVA / 100);
            const total = preco + valorIVA;

            document.getElementById('fat-c-linhas').innerHTML = `
                <tr>
                    <td>${pedido.titulo || pedido.servico}<br><small>${pedido.descricao}</small></td>
                    <td style="text-align: right;">1</td>
                    <td style="text-align: right;">${preco.toLocaleString('pt-AO')} Kz</td>
                    <td style="text-align: right;">${preco.toLocaleString('pt-AO')} Kz</td>
                </tr>
            `;

            document.getElementById('fat-c-subtotal').textContent = `${preco.toLocaleString('pt-AO')} Kz`;
            document.getElementById('fat-c-iva').textContent = `${valorIVA.toLocaleString('pt-AO')} Kz (${taxaIVA}%)`;
            document.getElementById('fat-c-total').textContent = `${total.toLocaleString('pt-AO')} Kz`;
            document.getElementById('fat-c-qrcode').src = `https://quickchart.io/qr?text=https://fernando20051.github.io/AntonioManuel/&size=150`;

            esconderBarra();
            abrirModal('modal-fatura-cliente');
        });
    }).catch((erro) => {
        console.error(erro);
        mostrarBarra('erro', 'Erro ao carregar a factura.');
        esconderBarra();
    });
}