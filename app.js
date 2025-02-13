
// Конфигурация Firebase (замените на свою!)
const firebaseConfig = {
  apiKey: "AIzaSyCO3yNJgdfcEnIkUHqyYeP-5jKZO9kIrgA",
  authDomain: "chat-f53be.firebaseapp.com",
  projectId: "chat-f53be",
  storageBucket: "chat-f53be.firebasestorage.app",
  messagingSenderId: "351295956574",
  appId: "G-JQ2GJ5WZHD"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Элементы DOM
const elements = {
  registerForm: document.getElementById('register-form'),
  loginForm: document.getElementById('login-form'),
  chatContainer: document.getElementById('chat-container'),
  messageInput: document.getElementById('message-input'),
  chatBox: document.getElementById('chat-box'),
  registerError: document.getElementById('register-error'),
  loginError: document.getElementById('login-error')
};

// Инициализация приложения
function init() {
  showLogin();
  auth.onAuthStateChanged(user => {
    if (user) {
      showChat();
      loadMessages();
    } else {
      showLogin();
    }
  });
}

// Функции управления интерфейсом
function showLogin() {
  elements.loginForm.classList.add('active');
  elements.registerForm.classList.remove('active');
  elements.chatContainer.classList.remove('active');
}

function showRegister() {
  elements.registerForm.classList.add('active');
  elements.loginForm.classList.remove('active');
  elements.chatContainer.classList.remove('active');
}

function showChat() {
  elements.loginForm.classList.remove('active');
  elements.registerForm.classList.remove('active');
  elements.chatContainer.classList.add('active');
  elements.messageInput.focus();
}

// Работа с аутентификацией
async function register() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    elements.registerError.textContent = '';
  } catch (error) {
    elements.registerError.textContent = error.message;
  }
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    elements.loginError.textContent = '';
  } catch (error) {
    elements.loginError.textContent = error.message;
  }
}

function logout() {
  auth.signOut();
}

// Работа с сообщениями
function sendMessage() {
  const message = elements.messageInput.value.trim();
  const user = auth.currentUser;
  
  if (message && user) {
    db.collection('messages').add({
      text: message,
      author: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    elements.messageInput.value = '';
  }
}

function loadMessages() {
  db.collection('messages')
    .orderBy('timestamp')
    .onSnapshot(snapshot => {
      elements.chatBox.innerHTML = '';
      snapshot.forEach(doc => {
        const msg = doc.data();
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `<strong>${msg.author}:</strong> ${msg.text}`;
        elements.chatBox.appendChild(div);
      });
      elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
    });
}

// Запуск приложения
init();