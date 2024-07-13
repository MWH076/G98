const firebaseConfig = {
    apiKey: "AIzaSyCNxZAN1dqjTI0zWVzq_fuWxb2GYXmr2wc",
    authDomain: "g098-aae09.firebaseapp.com",
    projectId: "g098-aae09",
    storageBucket: "g098-aae09.appspot.com",
    messagingSenderId: "776785557003",
    appId: "1:776785557003:web:71c04f262db83497d4790e"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const loginBtn = document.getElementById('login-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const leaderboardList = document.getElementById('leaderboard-list');
const gameContainer = document.getElementById('game');

loginBtn.addEventListener('click', () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        loginBtn.style.display = 'none';
        startGame(result.user);
    }).catch((error) => {
        console.log(error);
    });
});

function startGame(user) {
    gameContainer.innerHTML = 'Click as fast as you can!';
    let score = 0;
    let startTime = Date.now();
    gameContainer.addEventListener('click', () => {
        score++;
        if (Date.now() - startTime >= 10000) {
            endGame(user, score);
        }
    });
}

function endGame(user, score) {
    gameContainer.innerHTML = `Game Over! Your score: ${score}`;
    saveScore(user, score);
    playAgainBtn.style.display = 'block';
}

function saveScore(user, score) {
    db.collection('scores').add({
        user: user.displayName,
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        loadLeaderboard();
    }).catch((error) => {
        console.error('Error writing document: ', error);
    });
}

function loadLeaderboard() {
    leaderboardList.innerHTML = '';
    db.collection('scores').orderBy('score', 'desc').limit(10).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let li = document.createElement('li');
            li.textContent = `${doc.data().user}: ${doc.data().score}`;
            leaderboardList.appendChild(li);
        });
    });
}

playAgainBtn.addEventListener('click', () => {
    playAgainBtn.style.display = 'none';
    gameContainer.innerHTML = 'Click as fast as you can!';
    startGame(firebase.auth().currentUser);
});