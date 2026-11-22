// 1. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIIuJmOB2aMctISubZ7YDcZSQuEQoEDKo",
  authDomain: "antonio-manuel-site.firebaseapp.com",
  projectId: "antonio-manuel-site",
  storageBucket: "antonio-manuel-site.firebasestorage.app",
  messagingSenderId: "932034090596",
  appId: "1:932034090596:web:bd316ebed091caed537171"
};

// Iniciar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ==========================================
// 2. FUNÇÕES PARA MOSTRAR/ESCONDER OS FORMULÁRIOS (O que estava a falhar)
// ==========================================
function mostrarLogin() {
    document.getElementById('form-login-box').style.display = 'block';
    document.getElementById('form-cadastro-box').style.display = 'none';
    document.getElementById('form-reset-box').style.display = 'none';
}

function mostrarCadastro() {
    document.getElementById('form-login-box').style.display = 'none';
    document.getElementById('form-cadastro-box').style.display = 'block';
    document.getElementById('form-reset-box').style.display = 'none';
}

function mostrarReset() {
    document.getElementById('form-login-box').style.display = 'none';
    document.getElementById('form-cadastro-box').style.display = 'none';
    document.getElementById('form-reset-box').style.display = 'block';
}

// ==========================================
// 3. BARRA DE PROGRESSO
// ==========================================
function mostrarBarra(estado, mensagem) {
    const barra = document.getElementById('barra-progresso');
    if(!barra) return;
    document.getElementById('barra-texto').textContent = mensagem;
    barra.className = 'barra-progresso ativa ' + estado;
    if (estado === 'sucesso' || estado === 'erro') {
        setTimeout(() => barra.classList.remove('ativa'), 3500);
    }
}

// ==========================================
// 4. O CÓDIGO SÓ CORRE QUANDO A PÁGINA CARREGA
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // LOGIN
    const formLogin = document.getElementById('form-login-real');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            mostrarBarra('carregando', 'A verificar...');

            auth.signInWithEmailAndPassword(email, senha)
                .then(() => {
                    mostrarBarra('sucesso', 'Login efetuado!');
                    setTimeout(() => window.location.href = "painel.html", 1500);
                })
                .catch(() => {
                    mostrarBarra('erro', 'E-mail ou senha incorretos.');
                });
        });
    }

    // CADASTRO
    const formCadastro = document.getElementById('form-cadastro-real');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('cad-nome').value;
            const email = document.getElementById('cad-email').value;
            const telefone = document.getElementById('cad-telefone').value;
            const senha = document.getElementById('cad-senha').value;

            mostrarBarra('carregando', 'A criar conta...');
auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        return db.collection("clientes").doc(userCredential.user.uid).set({
            nome: nome, email: email, telefone: telefone, criadoEm: new Date()
        });
    })
    .then(() => {
        mostrarBarra('sucesso', 'Conta criada! A redirecionar...');
        setTimeout(() => window.location.href = "painel.html", 2000);
    })
    .catch((erro) => {
        alert("ERRO: " + erro.code + " - " + erro.message); // Vais ver isto se falhar
        mostrarBarra('erro', 'Erro: ' + erro.message);
    });
        });
    }

    // RECUPERAR SENHA
    const formReset = document.getElementById('form-reset-real');
    if (formReset) {
        formReset.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;
            mostrarBarra('carregando', 'A enviar e-mail...');

auth.sendPasswordResetEmail(email)
 .then(() => {
 mostrarBarra('sucesso', 'Link enviado! Verifica o teu e-mail.');
  formReset.reset();
  })
 .catch(() => {
     mostrarBarra('erro', 'E-mail não encontrado.');
                });
        });
    }
});