let board = Array(9).fill("");
let currentPlayer = "X"; // Always starts with X
let isAiMode = false;
let gameActive = false;
let names = { X: "P1", O: "P2" };
let scores = { X: 0, O: 0 };
let timer = 0, timerId;

function initGame(mode) {
    isAiMode = (mode === 'ai');
    names.X = document.getElementById('p1Input').value || "Player X";
    names.O = isAiMode ? "AI Bot" : (document.getElementById('p2Input').value || "Player O");
    
    document.getElementById('nameX').textContent = names.X;
    document.getElementById('nameO').textContent = names.O;
    document.getElementById('setup-overlay').classList.add('hidden');
    resetMatch();
}

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => cell.addEventListener('click', () => {
    const idx = cell.dataset.index;
    if (board[idx] !== "" || !gameActive) return;

    // Player (X) makes a move
    handleMove(idx, currentPlayer);

    // If game is active and it's AI turn (O)
    if (gameActive && isAiMode && currentPlayer === "O") {
        gameActive = false;
        setTimeout(aiTurn, 600);
    }
}));

function handleMove(idx, mark) {
    board[idx] = mark;
    const cell = cells[idx];
    cell.textContent = mark;
    
    // Add correct class: x-mark or o-mark
    cell.classList.add(mark === "X" ? "x-mark" : "o-mark");

    if (checkWin(mark)) {
        finishMatch(mark);
    } else if (board.every(s => s !== "")) {
        finishMatch("draw");
    } else {
        // Toggle Turn: If X just moved, next is O
        currentPlayer = (mark === "X") ? "O" : "X";
        document.getElementById('status').textContent = `${names[currentPlayer]}'s Turn (${currentPlayer})`;
        gameActive = true;
    }
}

function aiTurn() {
    // Simple AI logic: find first empty spot
    let move = board.findIndex(s => s === "");
    if (move !== -1) handleMove(move, "O");
}

function checkWin(p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(c => c.every(i => board[i] === p));
}

function finishMatch(result) {
    gameActive = false;
    clearInterval(timerId);
    const overlay = document.getElementById('result-overlay');
    const msg = document.getElementById('winner-msg');
    
    if (result === "draw") {
        msg.textContent = "It's a Draw!";
    } else {
        msg.textContent = `${names[result]} Wins!`;
        scores[result]++;
        document.getElementById(`score${result}`).textContent = scores[result];
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
    setTimeout(() => overlay.classList.remove('hidden'), 800);
}

function resetMatch() {
    board.fill("");
    currentPlayer = "X";
    gameActive = true;
    document.getElementById('result-overlay').classList.add('hidden');
    cells.forEach(c => { c.textContent = ""; c.classList.remove('x-mark', 'o-mark'); });
    document.getElementById('status').textContent = `${names.X}'s Turn (X)`;
    startTimer();
}

function startTimer() {
    clearInterval(timerId);
    timer = 0;
    timerId = setInterval(() => {
        timer++;
        document.getElementById('timerText').textContent = timer < 10 ? "0"+timer : timer;
    }, 1000);
}
