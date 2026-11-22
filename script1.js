// Inicialização do Firebase (Compatibilidade)
const firebaseConfig = {
  apiKey: "AIzaSyAIIuJmOB2aMctISubZ7YDcZSQuEQoEDKo",
  authDomain: "antonio-manuel-site.firebaseapp.com",
  projectId: "antonio-manuel-site",
  storageBucket: "antonio-manuel-site.firebasestorage.app",
  messagingSenderId: "932034090596",
  appId: "1:932034090596:web:bd316ebed091caed537171"
};

// Iniciar
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. FORMULÁRIO DE CADASTRO
    // ==========================================
    const formCadastro = document.getElementById('form-cadastro-real');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('cad-nome').value;
            const email = document.getElementById('cad-email').value;
            const telefone = document.getElementById('cad-telefone').value;
            const senha = document.getElementById('cad-senha').value;

            mostrarBarra('carregando', 'A criar conta...');

            // 1. Cria no Firebase Auth
            auth.createUserWithEmailAndPassword(email, senha)
                .then((userCredential) => {
                    // 2. Guarda no Firestore
                    return db.collection("clientes").doc(userCredential.user.uid).set({
                        nome: nome,
                        email: email,
                        telefone: telefone,
                        criadoEm: new Date()
                    });
                })
                .then(() => {
                    mostrarBarra('sucesso', 'Conta criada! Redirecionando...');
                    setTimeout(() => {
                        fecharModal('modal-login');
                        window.location.href = "painel.html"; // Certifica-te que este ficheiro existe
                    }, 2000);
                })
                .catch((erro) => {
                    console.error(erro);
                    if (erro.code === 'auth/email-already-in-use') {
                        mostrarBarra('erro', 'E-mail já registado.');
                    } else if (erro.code === 'auth/weak-password') {
                        mostrarBarra('erro', 'Senha muito fraca (mínimo 6 caracteres).');
                    } else {
                        mostrarBarra('erro', 'Erro: ' + erro.message);
                    }
                });
        });
    }

    // ==========================================
    // 2. FORMULÁRIO DE LOGIN
    // ==========================================
    const formLogin = document.getElementById('form-login-real');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;

            mostrarBarra('carregando', 'A verificar dados...');

            auth.signInWithEmailAndPassword(email, senha)
                .then(() => {
                    mostrarBarra('sucesso', 'Login efetuado! A entrar...');
                    setTimeout(() => {
                        fecharModal('modal-login');
                        window.location.href = "painel.html"; // Redireciona para o painel
                    }, 1500);
                })
                .catch((erro) => {
                    mostrarBarra('erro', 'E-mail ou senha incorretos.');
                });
        });
    }

    // ==========================================
    // 3. RECUPERAÇÃO DE SENHA
    // ==========================================
    const formReset = document.getElementById('form-reset-real');
    if (formReset) {
        formReset.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;
            
            mostrarBarra('carregando', 'A enviar e-mail...');
            
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    mostrarBarra('sucesso', 'Link enviado para o teu e-mail!');
                    formReset.reset();
                })
                .catch(() => {
                    mostrarBarra('erro', 'E-mail não encontrado.');
                });
        });
    }
});
