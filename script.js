const screens = document.querySelectorAll('.screen');
const $ = (id) => document.getElementById(id);

function showScreen(name) {
    screens.forEach((screen) => screen.classList.toggle('active', screen.id === `${name}-screen`));
}

function startGame(name) {
    showScreen(name);
    if (name === 'memory') resetMemory();
    if (name === 'tictactoe') resetTicTacToe();
}

function goHome() { showScreen('home'); }

// Tic Tac Toe
let tttBoard = Array(9).fill('');
let tttOver = false;
let tttWins = 0;
let tttLosses = 0;
const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function tttPlay(index) {
    if (tttOver || tttBoard[index]) return;
    tttBoard[index] = 'X';
    renderTicTacToe();
    if (finishTicTacToe('X')) return;
    $('ttt-status').textContent = 'Computer is thinking...';
    setTimeout(() => {
        const open = tttBoard.map((value, i) => value ? null : i).filter((i) => i !== null);
        if (!open.length) return;
        const choice = open[Math.floor(Math.random() * open.length)];
        tttBoard[choice] = 'O';
        renderTicTacToe();
        finishTicTacToe('O');
    }, 350);
}

function finishTicTacToe(player) {
    const won = winningLines.some(([a,b,c]) => tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]);
    if (won) {
        tttOver = true;
        if (player === 'X') { tttWins++; $('ttt-status').textContent = '🎉 You win!'; }
        else { tttLosses++; $('ttt-status').textContent = 'Computer wins!'; }
        updateScores();
        return true;
    }
    if (tttBoard.every(Boolean)) {
        tttOver = true;
        $('ttt-status').textContent = "It's a draw!";
        return true;
    }
    $('ttt-status').textContent = player === 'X' ? 'Your turn (X)' : 'Your turn (X)';
    return false;
}

function renderTicTacToe() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = tttBoard[index];
        cell.className = `cell ${tttBoard[index].toLowerCase()}`;
    });
}

function resetTicTacToe() {
    tttBoard = Array(9).fill('');
    tttOver = false;
    $('ttt-status').textContent = 'Your turn (X)';
    renderTicTacToe();
    updateScores();
}

// Memory Match
const memorySymbols = ['🍕','🚀','🐸','🌈','⚽','🎸'];
let memoryCards = [];
let memoryFlipped = [];
let memoryLocked = false;
let memoryMatches = 0;

function resetMemory() {
    memoryCards = [...memorySymbols, ...memorySymbols].sort(() => Math.random() - 0.5).map((symbol, id) => ({ symbol, id, matched: false }));
    memoryFlipped = [];
    memoryLocked = false;
    memoryMatches = 0;
    $('memory-status').textContent = 'Find matching pairs!';
    $('memory-matches').textContent = '0';
    renderMemory();
}

function renderMemory() {
    $('memory-board').innerHTML = memoryCards.map((card, index) => {
        const visible = memoryFlipped.includes(index) || card.matched;
        return `<button class="memory-card ${visible ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" onclick="flipMemory(${index})" aria-label="Memory card">${visible ? card.symbol : '?'}</button>`;
    }).join('');
}

function flipMemory(index) {
    if (memoryLocked || memoryCards[index].matched || memoryFlipped.includes(index)) return;
    memoryFlipped.push(index);
    renderMemory();
    if (memoryFlipped.length < 2) return;
    memoryLocked = true;
    const [first, second] = memoryFlipped;
    if (memoryCards[first].symbol === memoryCards[second].symbol) {
        memoryCards[first].matched = memoryCards[second].matched = true;
        memoryMatches++;
        memoryFlipped = [];
        memoryLocked = false;
        $('memory-matches').textContent = memoryMatches;
        $('memory-status').textContent = memoryMatches === 6 ? '🏆 You found them all!' : 'Great match!';
        renderMemory();
    } else {
        $('memory-status').textContent = 'Not a match — try again.';
        setTimeout(() => { memoryFlipped = []; memoryLocked = false; renderMemory(); }, 750);
    }
}

// Rock Paper Scissors
let rpsWins = 0;
let rpsLosses = 0;
const rpsChoices = {
    rock: { emoji: '🪨', beats: 'scissors' },
    paper: { emoji: '📄', beats: 'rock' },
    scissors: { emoji: '✂️', beats: 'paper' }
};

function playRPS(player) {
    const options = Object.keys(rpsChoices);
    const computer = options[Math.floor(Math.random() * options.length)];
    $('rps-player').textContent = rpsChoices[player].emoji;
    $('rps-computer').textContent = rpsChoices[computer].emoji;
    if (player === computer) {
        $('rps-status').textContent = "It's a draw!";
    } else if (rpsChoices[player].beats === computer) {
        rpsWins++;
        $('rps-status').textContent = '🎉 You win this round!';
    } else {
        rpsLosses++;
        $('rps-status').textContent = 'Computer wins this round!';
    }
    updateScores();
}

function resetRPS() {
    rpsWins = 0;
    rpsLosses = 0;
    $('rps-player').textContent = '-';
    $('rps-computer').textContent = '-';
    $('rps-status').textContent = 'Make your choice!';
    updateScores();
}

function updateScores() {
    $('ttt-wins').textContent = tttWins;
    $('ttt-losses').textContent = tttLosses;
    $('rps-wins').textContent = rpsWins;
    $('rps-losses').textContent = rpsLosses;
}

resetTicTacToe();
