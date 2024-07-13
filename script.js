// script.js
const firebaseConfig = {
    apiKey: "AIzaSyCNxZAN1dqjTI0zWVzq_fuWxb2GYXmr2wc",
    authDomain: "g098-aae09.firebaseapp.com",
    projectId: "g098-aae09",
    storageBucket: "g098-aae09.appspot.com",
    messagingSenderId: "776785557003",
    appId: "1:776785557003:web:71c04f262db83497d4790e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const userInfo = document.getElementById('user-info');
const leaderboard = document.getElementById('leaderboard');

let score = 0;
let gameInterval;
let user = null;

loginButton.onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
logoutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
    if (user) {
        userInfo.textContent = `Logged in as ${user.displayName}`;
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        loadLeaderboard();
    } else {
        userInfo.textContent = '';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
});

startButton.onclick = () => {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    ball.style.display = 'block';
    moveBall();
    gameInterval = setInterval(moveBall, 1000);
};

ball.onclick = () => {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
};

function moveBall() {
    const x = Math.floor(Math.random() * (gameArea.clientWidth - 50));
    const y = Math.floor(Math.random() * (gameArea.clientHeight - 50));
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

function loadLeaderboard() {
    leaderboard.innerHTML = '';
    db.collection('leaderboard').orderBy('score', 'desc').limit(10).get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const li = document.createElement('li');
            li.textContent = `${doc.data().name}: ${doc.data().score}`;
            leaderboard.appendChild(li);
        });
    });
}

function saveScore() {
    if (user) {
        db.collection('leaderboard').add({
            name: user.displayName,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

window.onbeforeunload = saveScore;