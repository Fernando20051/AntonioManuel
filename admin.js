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

// Verificar se o utilizador está logado e é o Admin
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html"; // Se não estiver logado, vai para o login
    } else if (user.email !== EMAIL_ADMIN) {
        alert("Acesso negado. Esta área é restrita ao administrador.");
        window.location.href = "index.html"; // Se não for o admin, expulsa
    } else {
        carregarTodosPedidos(); // Se for o admin, carrega a tabela
    }
});

// Carregar a lista de pedidos
function carregarTodosPedidos() {
    db.collection("pedidos").orderBy("criadoEm", "desc").onSnapshot((querySnapshot) => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('tabela').style.display = 'table';
        
        const corpo = document.getElementById('corpo-tabela');
        corpo.innerHTML = ''; // Limpa a tabela

        querySnapshot.forEach((doc) => {
            const pedido = doc.data();
            const id = doc.id;
            const nome = doc.nome;

            let classeSelo = 'selo-analise';
            let textoEstado = 'Em Análise';
            if (pedido.estado === 'em_andamento') { classeSelo = 'selo-andamento'; textoEstado = 'Em Andamento'; }
            if (pedido.estado === 'pronto') { classeSelo = 'selo-concluido'; textoEstado = 'Concluído'; }

            // Cria a linha da tabela
            corpo.innerHTML += `
                <tr>
                    <td style="font-size:0.8rem; color:#64748b;">${pedido.clienteUid}</td>
                    <td>${pedido.servico}</td>
                    <td><span class="selo ${classeSelo}">${textoEstado}</span></td>
                    <td>
                        <button class="btn-acao btn-iniciar" onclick="mudarEstado('${id}', 'em_andamento')">Iniciar</button>
                        <button class="btn-acao btn-concluir" onclick="mudarEstado('${id}', 'pronto')">Concluir</button>
                        <button class="btn-acao btn-pago" onclick="marcarPago('${id}')">Marcar Pago</button>
                    </td>
                </tr>
            `;
        });
    });
}

// Função para mudar o estado do pedido
function mudarEstado(idPedido, novoEstado) {
    db.collection("pedidos").doc(idPedido).update({
        estado: novoEstado
    }).then(() => {
        alert("Estado actualizado!");
    }).catch((erro) => {
        alert("Erro ao actualizar: " + erro.message);
    });
}

// Função para marcar como pago
function marcarPago(idPedido) {
    db.collection("pedidos").doc(idPedido).update({
        pago: true
    }).then(() => {
    alert("Pagamento confirmado!");
    });
}

// Sair
function sair() {
    auth.signOut().then(() => window.location.href = "index.html");
}