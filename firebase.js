// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// As tuas chaves (configuração)
const firebaseConfig = {
  apiKey: "AIzaSyAIIuJmOB2aMctISubZ7YDcZSQuEQoEDKo",
  authDomain: "antonio-manuel-site.firebaseapp.com",
  projectId: "antonio-manuel-site",
  storageBucket: "antonio-manuel-site.firebasestorage.app",
  messagingSenderId: "932034090596",
  appId: "1:932034090596:web:bd316ebed091caed537171"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Exportar o Auth e o Firestore para podermos usar no script.js
export const auth = getAuth(app);
export const db = getFirestore(app);