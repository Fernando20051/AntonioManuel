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
const EMAIL_ADMIN = "antoniofernandomanuel18@gmail.com"; 

// ==========================================
// FUNÇÕES BÁSICAS
// ==========================================
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }
function sair() { auth.signOut().then(() => window.location.replace("index.html")); }

// ==========================================
// VERIFICAÇÃO DE SEGURANÇA
// ==========================================
auth.onAuthStateChanged((user) => {
    if (!user || user.email !== EMAIL_ADMIN) {
        window.location.replace("login.html");
    } else {
        carregarPedidos();
        carregarDadosEmpresa(); // Carrega os dados para o formulário
    }
});

// ==========================================
// CARREGAR DADOS DA EMPRESA PARA O FORMULÁRIO
// ==========================================
function carregarDadosEmpresa() {
    db.collection("configuracoes").doc("empresa").get().then((doc) => {
        if (doc.exists) {
            const dados = doc.data();
            document.getElementById('emp-telefone').value = dados.telefone || '';
            document.getElementById('emp-nif').value = dados.nif || '';
            document.getElementById('emp-metodo-nacional').value = dados.metodoNacional || '';
            document.getElementById('emp-iban').value = dados.iban || '';
            document.getElementById('emp-swift').value = dados.swift || '';
            document.getElementById('emp-iban-internacional').value = dados.ibanInternacional || '';
        }
    });
}

// ==========================================
// GUARDAR DADOS DA EMPRESA
// ==========================================
document.getElementById('form-dados-empresa').addEventListener('submit', function(e) {
    e.preventDefault();
    db.collection("configuracoes").doc("empresa").set({
        telefone: document.getElementById('emp-telefone').value,
        nif: document.getElementById('emp-nif').value,
        metodoNacional: document.getElementById('emp-metodo-nacional').value,
        iban: document.getElementById('emp-iban').value,
        swift: document.getElementById('emp-swift').value,
        ibanInternacional: document.getElementById('emp-iban-internacional').value
    }).then(() => {
        alert("Dados guardados com sucesso!");
        fecharModal('modal-dados-empresa');
    });
});

// ==========================================
// CARREGAR PEDIDOS
// ==========================================
function carregarPedidos() {
    document.getElementById('loading').style.display = 'block';
    
    db.collection("pedidos").orderBy("criadoEm", "desc").onSnapshot((querySnapshot) => {
        document.getElementById('loading').style.display = 'none';
        const lista = document.getElementById('lista-admin');
        lista.innerHTML = '';

        if (querySnapshot.empty) {
            lista.innerHTML = '<p style="text-align:center;">Nenhum pedido no sistema.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const pedido = doc.data();
            const id = doc.id;
            
            let classeSelo = 'selo-analise', textoEstado = 'Em Análise';
            if (pedido.estado === 'em_andamento') { classeSelo = 'selo-andamento'; textoEstado = 'Em Andamento'; }
            if (pedido.estado === 'pronto') { classeSelo = 'selo-concluido'; textoEstado = 'Concluído'; }

            const cartao = document.createElement('div');
            cartao.className = 'cartao-admin';
            cartao.innerHTML = `
                <div class="cartao-topo">
                    <div>
                        <h3 id="nome-${id}">A carregar nome...</h3>
                        <span class="cartao-ids">ID: ${id.substring(0,8)} | Cliente UID: ${pedido.clienteUid.substring(0,8)}</span>
                    </div>
                    <span class="selo ${classeSelo}">${textoEstado}</span>
                </div>
                <div class="cartao-corpo">
                    <div class="cartao-descricao">
                        <strong>${pedido.titulo || pedido.servico}</strong><br>
                        ${pedido.descricao}
                    </div>
                    <div class="cartao-acoes">
                        <button class="btn-acao btn-iniciar" onclick="mudarEstado('${id}', 'em_andamento')">Iniciar</button>
                        <button class="btn-acao btn-concluir" onclick="mudarEstado('${id}', 'pronto')">Concluir</button>
                        <button class="btn-acao btn-pago" onclick="marcarPago('${id}')">Pago</button>
                        <button class="btn-acao btn-valores" onclick="abrirValores('${id}', '${pedido.preco || ''}', '${pedido.iva || '14'}')">Definir Valores</button>
                        <button class="btn-acao btn-fatura" onclick="gerarFatura('${id}')">Gerar Fatura</button>
                        <button class="btn-acao btn-apagar" onclick="apagarPedido('${id}')">Eliminar</button>
                    </div>
                </div>
            `;
            lista.appendChild(cartao);

            if (pedido.clienteUid) {
                db.collection("clientes").doc(pedido.clienteUid).get().then((docCliente) => {
                    const h3 = document.getElementById(`nome-${id}`);
                    if (h3 && docCliente.exists) h3.textContent = docCliente.data().nome;
                });
            }
        });
    });
}

// ==========================================
// AÇÕES DOS BOTÕES
// ==========================================
function mudarEstado(id, estado) {
    let dados = { estado: estado };
    if (estado === 'pronto') {
        dados.dataEntrega = new Date();
        dados.faturaLibertadaEm = new Date();
    }
    db.collection("pedidos").doc(id).update(dados);
}

function marcarPago(id) {
    db.collection("pedidos").doc(id).update({ pago: true });
}

function apagarPedido(id) {
    if (confirm("Apagar este pedido permanentemente?")) {
        db.collection("pedidos").doc(id).delete();
    }
}

function abrirValores(id, preco, iva) {
    document.getElementById('val-id').value = id;
    document.getElementById('val-preco').value = preco;
    document.getElementById('val-iva').value = iva;
    abrirModal('modal-valores');
}

document.getElementById('form-valores').addEventListener('submit', function(e) {
    e.preventDefault();
    db.collection("pedidos").doc(document.getElementById('val-id').value).update({
        preco: document.getElementById('val-preco').value,
        iva: document.getElementById('val-iva').value
    }).then(() => {
        alert("Valores atualizados!");
        fecharModal('modal-valores');
    });
});

// ==========================================
// GERAR FATURA (A MÁGICA)
// ==========================================
function gerarFatura(idPedido) {
    Promise.all([
        db.collection("pedidos").doc(idPedido).get(),
        db.collection("configuracoes").doc("empresa").get()
    ]).then(([docPedido, docEmpresa]) => {
        const pedido = docPedido.data();
        const empresa = docEmpresa.exists ? docEmpresa.data() : {};

        db.collection("clientes").doc(pedido.clienteUid).get().then((docCliente) => {
            const cliente = docCliente.exists ? docCliente.data() : { nome: 'Desconhecido', email: 'N/A' };

            // Dados da Empresa
            document.getElementById('fat-emissor').innerHTML = `NIF: ${empresa.nif || 'N/A'} | Tel: ${empresa.telefone || 'N/A'}`;
            
            let infoPagamento = `<strong>${empresa.metodoNacional || 'N/A'}</strong><br>`;
            if(empresa.iban) infoPagamento += `IBAN: ${empresa.iban}<br>`;
            if(empresa.swift || empresa.ibanInternacional) {
                infoPagamento += `<hr style="margin: 5px 0; border: 0; border-top: 1px dashed #ccc;">`;
                if(empresa.swift) infoPagamento += `SWIFT: ${empresa.swift}<br>`;
                if(empresa.ibanInternacional) infoPagamento += `IBAN Int: ${empresa.ibanInternacional}`;
            }
            document.getElementById('fat-pagamento').innerHTML = infoPagamento;

            // Dados do Pedido
            document.getElementById('fat-numero').textContent = '#' + idPedido.substring(0,6).toUpperCase();
            document.getElementById('fat-datas').textContent = `Emissão: ${new Date().toLocaleDateString('pt-PT')}`;
            document.getElementById('fat-cliente').textContent = `${cliente.nome} (${cliente.email})`;
            document.getElementById('fat-estado').textContent = pedido.pago ? 'PAGO' : 'PENDENTE';

            // Cálculos
            const preco = parseFloat(pedido.preco) || 0;
            const taxaIVA = parseFloat(pedido.iva) || 0;
            const valorIVA = preco * (taxaIVA / 100);
            const total = preco + valorIVA;

            document.getElementById('fat-linhas').innerHTML = `
                <tr>
                    <td>${pedido.titulo || pedido.servico}<br><small>${pedido.descricao}</small></td>
                    <td style="text-align: right;">1</td>
                    <td style="text-align: right;">${preco.toLocaleString('pt-AO')} Kz</td>
                    <td style="text-align: right;">${preco.toLocaleString('pt-AO')} Kz</td>
                </tr>
            `;

            document.getElementById('fat-subtotal').textContent = `${preco.toLocaleString('pt-AO')} Kz`;
            document.getElementById('fat-iva').textContent = `${valorIVA.toLocaleString('pt-AO')} Kz (${taxaIVA}%)`;
            document.getElementById('fat-total').textContent = `${total.toLocaleString('pt-AO')} Kz`;

            // QR Code
            document.getElementById('fat-qrcode').src = `https://quickchart.io/qr?text=https://fernando20051.github.io/AntonioManuel/&size=150`;

            abrirModal('modal-fatura');
        });
    });
}