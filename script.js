const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const promoOverlay = document.getElementById('promotion-overlay');
const winOverlay = document.getElementById('win-overlay');
const blackGrave = document.getElementById('captured-black');
const whiteGrave = document.getElementById('captured-white');

let board = [], history = [], capturedPieces = { W: [], B: [] };
let selectedSq = null, turn = 'W', hasMoved = {}, lastMove = null;

const icons = { 
    'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
    'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙' 
};

function initGame() {
    board = [
        ['r','n','b','q','k','b','n','r'], ['p','p','p','p','p','p','p','p'],
        ['','','','','','','',''], ['','','','','','','',''],
        ['','','','','','','',''], ['','','','','','','',''],
        ['P','P','P','P','P','P','P','P'], ['R','N','B','Q','K','B','N','R']
    ];
    history = []; capturedPieces = { W: [], B: [] };
    hasMoved = { 
        '0,0':false, '0,4':false, '0,7':false, 
        '7,0':false, '7,4':false, '7,7':false 
    };
    turn = 'W'; selectedSq = null; lastMove = null;
    promoOverlay.style.display = 'none'; winOverlay.style.display = 'none';
    render();
}

function render() {
    // Clear the board
    boardEl.querySelectorAll('.square').forEach(s => s.remove());
    
    // Check if kings are under attack for the Red Glow effect
    const whiteKing = findKing('W'), blackKing = findKing('B');
    const whiteInCheck = isSquareAttacked(whiteKing.r, whiteKing.c, 'B');
    const blackInCheck = isSquareAttacked(blackKing.r, blackKing.c, 'W');

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r+c)%2===0 ? 'light':'dark'}`;
            const p = board[r][c];
            if (p) {
                sq.innerText = icons[p];
                sq.classList.add(p === p.toUpperCase() ? 'piece-white' : 'piece-black');
                // Apply red check glow
                if (p === 'K' && whiteInCheck) sq.classList.add('check');
                if (p === 'k' && blackInCheck) sq.classList.add('check');
            }
            if (selectedSq && selectedSq.r === r && selectedSq.c === c) sq.classList.add('selected');
            sq.onclick = () => handleSquareClick(r, c);
            boardEl.appendChild(sq);
        }
    }
    updateUI();
}

function handleSquareClick(r, c) {
    if (promoOverlay.style.display === 'flex' || winOverlay.style.display === 'flex') return;
    const p = board[r][c];
    const isWhite = p !== '' && p === p.toUpperCase();

    if (selectedSq) {
        if (isValidMove(selectedSq.r, selectedSq.c, r, c)) {
            saveHistory();
            executeMove(selectedSq.r, selectedSq.c, r, c);
        } else if (p !== '' && ((turn === 'W' && isWhite) || (turn === 'B' && !isWhite))) {
            selectedSq = {r, c};
        } else {
            selectedSq = null;
        }
    } else if (p !== '' && ((turn === 'W' && isWhite) || (turn === 'B' && !isWhite))) {
        selectedSq = {r, c};
    }
    render();
}

function executeMove(fr, fc, tr, tc) {
    const piece = board[fr][fc];
    const target = board[tr][tc];

    // 1. KING CAPTURE PRIORITY (Immediate Win)
    if (target.toLowerCase() === 'k') {
        board[tr][tc] = piece;
        board[fr][fc] = '';
        render();
        showWin(piece === piece.toUpperCase() ? "White" : "Black");
        return; 
    }

    // 2. Queen-side & King-side Castling Rook Jump
    if (piece.toLowerCase() === 'k' && Math.abs(tc - fc) === 2) {
        const isQueenSide = tc < fc;
        const rookOldCol = isQueenSide ? 0 : 7;
        const rookNewCol = isQueenSide ? 3 : 5;
        board[tr][rookNewCol] = board[tr][rookOldCol];
        board[tr][rookOldCol] = '';
    }

    // 3. En Passant Capture Logic
    if (piece.toLowerCase() === 'p' && fc !== tc && target === '') {
        const capturedPawn = board[fr][tc];
        capturedPieces[capturedPawn === capturedPawn.toUpperCase() ? 'W' : 'B'].push(capturedPawn);
        board[fr][tc] = '';
    }

    // 4. Standard Capture
    if (target !== '') capturedPieces[target === target.toUpperCase() ? 'W' : 'B'].push(target);

    // 5. Apply Move
    board[tr][tc] = piece;
    board[fr][fc] = '';
    
    // Update move tracking for castling
    if (hasMoved.hasOwnProperty(`${fr},${fc}`)) hasMoved[`${fr},${fc}`] = true;
    lastMove = { fr, fc, tr, tc, piece };

    // 6. Promotion Check (only if the game hasn't ended)
    if (piece.toLowerCase() === 'p' && (tr === 0 || tr === 7)) {
        showPromotion(tr, tc, piece === piece.toUpperCase());
    } else {
        finalizeTurn();
    }
}

function isValidMove(fr, fc, tr, tc, scanning = false) {
    const p = board[fr][fc]; if (p === '') return false;
    const type = p.toLowerCase(), isW = p === p.toUpperCase();
    const target = board[tr][tc];
    const dr = tr - fr, dc = tc - fc;

    if (!scanning && target !== '' && isW === (target === target.toUpperCase())) return false;

    switch (type) {
        case 'p':
            const d = isW ? -1 : 1;
            if (dc === 0 && dr === d && target === '') return true;
            if (dc === 0 && fr === (isW?6:1) && dr === 2*d && target==='' && board[fr+d][fc]==='') return true;
            if (Math.abs(dc) === 1 && dr === d && target !== '') return true;
            if (Math.abs(dc) === 1 && dr === d && target === '' && lastMove && lastMove.piece.toLowerCase()==='p' && lastMove.tr===fr && Math.abs(lastMove.fr-lastMove.tr)===2 && lastMove.tc===tc) return true;
            return false;
        case 'r': return (fr === tr || fc === tc) && isPathClear(fr, fc, tr, tc);
        case 'n': return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
        case 'b': return Math.abs(dr) === Math.abs(dc) && isPathClear(fr, fc, tr, tc);
        case 'q': return (Math.abs(dr) === Math.abs(dc) || fr === tr || fc === tc) && isPathClear(fr, fc, tr, tc);
        case 'k': 
            if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) return true;
            if (dr === 0 && Math.abs(dc) === 2 && !hasMoved[`${fr},${fc}`]) {
                const isQS = tc < fc;
                const rCol = isQS ? 0 : 7;
                if (!hasMoved[`${fr},${rCol}`] && isPathClear(fr, fc, fr, rCol)) {
                    if (isQS && board[fr][1] !== '') return false; // b-file must be clear for Queen-side
                    return true;
                }
            }
            return false;
    }
    return false;
}

function isPathClear(fr, fc, tr, tc) {
    const rs = tr > fr ? 1 : (tr < fr ? -1 : 0), cs = tc > fc ? 1 : (tc < fc ? -1 : 0);
    let r = fr + rs, c = fc + cs;
    while (r !== tr || c !== tc) { if (board[r][c] !== '') return false; r += rs; c += cs; }
    return true;
}

function isSquareAttacked(tr, tc, color) {
    if (tr === -1) return false;
    for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
            const p = board[r][c];
            if (p !== '' && (color === 'W' ? p === p.toUpperCase() : p === p.toLowerCase())) {
                if (isValidMove(r, c, tr, tc, true)) return true;
            }
        }
    }
    return false;
}

function updateUI() {
    try {
        if (statusEl) {
            statusEl.innerText = turn === 'W' ? "WHITE'S TURN" : "BLACK'S TURN";
            statusEl.className = turn === 'W' ? 'white-turn-active' : 'black-turn-active';
        }
        
        // Use spans for flex-wrap columns in side panels
        if (blackGrave) {
            blackGrave.innerHTML = '';
            capturedPieces['B'].forEach(p => {
                const span = document.createElement('span');
                span.innerText = icons[p];
                blackGrave.appendChild(span);
            });
        }
        if (whiteGrave) {
            whiteGrave.innerHTML = '';
            capturedPieces['W'].forEach(p => {
                const span = document.createElement('span');
                span.innerText = icons[p];
                whiteGrave.appendChild(span);
            });
        }
    } catch (e) { console.error(e); }
}

function showPromotion(r, c, isW) {
    promoOverlay.style.display = 'flex';
    const optsDiv = document.getElementById('promo-options');
    optsDiv.innerHTML = '';
    const choices = isW ? ['Q','R','B','N'] : ['q','r','b','n'];
    choices.forEach(o => {
        const d = document.createElement('div');
        d.className = 'promo-choice'; d.innerText = icons[o];
        d.onclick = () => { board[r][c]=o; promoOverlay.style.display='none'; finalizeTurn(); };
        optsDiv.appendChild(d);
    });
}

function saveHistory() {
    history.push({ 
        board: JSON.parse(JSON.stringify(board)), 
        turn, 
        hasMoved: {...hasMoved}, 
        captured: JSON.parse(JSON.stringify(capturedPieces)), 
        lastMove: lastMove?{...lastMove}:null 
    });
}

function undoMove() {
    if (history.length === 0) return;
    const s = history.pop();
    board = s.board; turn = s.turn; hasMoved = s.hasMoved; 
    capturedPieces = s.captured; lastMove = s.lastMove;
    selectedSq = null; render();
}

function finalizeTurn() { turn = turn === 'W' ? 'B' : 'W'; selectedSq = null; render(); }

function showWin(w) { winOverlay.style.display = 'flex'; document.getElementById('winner-text').innerText = w + " Wins!"; }

function findKing(color) {
    const t = color === 'W' ? 'K' : 'k';
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) if (board[r][c] === t) return {r, c};
    return {r: -1, c: -1};
}

// Security Branding
window.addEventListener('load', () => {
    console.log(
        "%c👑 Royal Chess: Grandmaster Edition", 
        "color: #FFD700; font-size: 24px; font-weight: bold; text-shadow: 2px 2px #000;"
    );
    console.log(
        "%cDeveloped by Nashra Husain. Unauthorized portfolio use is prohibited.", 
        "color: #fff; background: #8B0000; padding: 5px; border-radius: 3px;"
    );
});

initGame();
