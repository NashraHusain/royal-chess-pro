const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const promoOverlay = document.getElementById('promotion-overlay');
const winOverlay = document.getElementById('win-overlay');

let board = [];
let selectedSq = null;
let turn = 'W';
let lastMove = null; 
let hasMoved = {}; 

const icons = { 
    'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
    'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙' 
};

function initGame() {
    board = [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        ['','','','','','','',''], ['','','','','','','',''],
        ['','','','','','','',''], ['','','','','','','',''],
        ['P','P','P','P','P','P','P','P'],
        ['R','N','B','Q','K','B','N','R']
    ];
    hasMoved = { '0,0':false,'0,4':false,'0,7':false,'7,0':false,'7,4':false,'7,7':false };
    turn = 'W'; 
    selectedSq = null; 
    lastMove = null;
    promoOverlay.style.display = 'none';
    winOverlay.style.display = 'none';
    render();
}

function render() {
    const squares = boardEl.querySelectorAll('.square');
    squares.forEach(s => s.remove());

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r+c)%2===0 ? 'light':'dark'}`;
            const piece = board[r][c];
            
            if (piece) {
                sq.innerText = icons[piece];
                sq.classList.add(piece === piece.toUpperCase() ? 'piece-white' : 'piece-black');
            }

            if (selectedSq && selectedSq.r === r && selectedSq.c === c) sq.classList.add('selected');
            sq.onclick = () => handleSquareClick(r, c);
            boardEl.appendChild(sq);
        }
    }
    checkWin();
}

function handleSquareClick(r, c) {
    if (promoOverlay.style.display === 'flex') return;
    const piece = board[r][c];
    const isWhite = piece !== '' && piece === piece.toUpperCase();

    if (selectedSq) {
        if (isValidMove(selectedSq.r, selectedSq.c, r, c)) {
            executeMove(selectedSq.r, selectedSq.c, r, c);
        } else if (piece !== '' && ((turn === 'W' && isWhite) || (turn === 'B' && !isWhite))) {
            selectedSq = {r, c};
        } else {
            selectedSq = null;
        }
    } else if (piece !== '' && ((turn === 'W' && isWhite) || (turn === 'B' && !isWhite))) {
        selectedSq = {r, c};
    }
    render();
}

function executeMove(fr, fc, tr, tc) {
    const piece = board[fr][fc];
    
    // Castling Logic: Move the Rook too
    if (piece.toLowerCase() === 'k' && Math.abs(tc - fc) === 2) {
        const isQueenSide = (tc < fc);
        const rookOldCol = isQueenSide ? 0 : 7;
        const rookNewCol = isQueenSide ? 3 : 5;
        board[tr][rookNewCol] = board[tr][rookOldCol];
        board[tr][rookOldCol] = '';
    }

    // En Passant Logic: Remove the captured pawn
    if (piece.toLowerCase() === 'p' && fc !== tc && board[tr][tc] === '') {
        board[fr][tc] = '';
    }

    board[tr][tc] = piece;
    board[fr][fc] = '';
    
    if (hasMoved.hasOwnProperty(`${fr},${fc}`)) hasMoved[`${fr},${fc}`] = true;
    lastMove = { fr, fc, tr, tc, piece };

    if (piece.toLowerCase() === 'p' && (tr === 0 || tr === 7)) {
        showPromotion(tr, tc, piece === piece.toUpperCase());
    } else {
        finalizeTurn();
    }
}

function isValidMove(fr, fc, tr, tc) {
    const piece = board[fr][fc];
    const type = piece.toLowerCase();
    const isWhite = piece === piece.toUpperCase();
    const target = board[tr][tc];
    if (target !== '' && (isWhite === (target === target.toUpperCase()))) return false;
    
    const dr = tr - fr;
    const dc = tc - fc;

    switch (type) {
        case 'p':
            const dir = isWhite ? -1 : 1;
            if (dc === 0 && dr === dir && target === '') return true;
            if (dc === 0 && fr === (isWhite?6:1) && dr === 2*dir && target==='' && isPathClear(fr, fc, tr, tc)) return true;
            if (Math.abs(dc) === 1 && dr === dir && target !== '') return true;
            // En Passant
            if (Math.abs(dc) === 1 && dr === dir && target === '' && lastMove) {
                if (lastMove.piece.toLowerCase()==='p' && lastMove.tr===fr && Math.abs(lastMove.fr-lastMove.tr)===2 && lastMove.tc===tc) return true;
            }
            return false;
        case 'r': return (fr === tr || fc === tc) && isPathClear(fr, fc, tr, tc);
        case 'n': return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
        case 'b': return Math.abs(dr) === Math.abs(dc) && isPathClear(fr, fc, tr, tc);
        case 'q': return (Math.abs(dr) === Math.abs(dc) || fr === tr || fc === tc) && isPathClear(fr, fc, tr, tc);
        case 'k': 
            if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) return true;
            // Castling
            if (dr === 0 && Math.abs(dc) === 2 && !hasMoved[`${fr},${fc}`]) {
                const isQueenSide = (tc < fc);
                const rookCol = isQueenSide ? 0 : 7;
                if (!hasMoved[`${fr},${rookCol}`] && isPathClear(fr, fc, fr, rookCol)) return true;
            }
            return false;
    }
}

function isPathClear(fr, fc, tr, tc) {
    const rStep = tr > fr ? 1 : (tr < fr ? -1 : 0);
    const cStep = tc > fc ? 1 : (tc < fc ? -1 : 0);
    let r = fr + rStep, c = fc + cStep;
    while (r !== tr || c !== tc) {
        if (board[r][c] !== '') return false;
        r += rStep; c += cStep;
    }
    return true;
}

function showPromotion(r, c, isWhite) {
    promoOverlay.style.display = 'flex';
    const optsDiv = document.getElementById('promo-options');
    optsDiv.innerHTML = '';
    const opts = isWhite ? ['Q','R','B','N'] : ['q','r','b','n'];
    opts.forEach(o => {
        const d = document.createElement('div');
        d.className = 'promo-choice';
        d.innerText = icons[o];
        d.onclick = () => { board[r][c]=o; promoOverlay.style.display='none'; finalizeTurn(); };
        optsDiv.appendChild(d);
    });
}

function finalizeTurn() {
    turn = (turn === 'W') ? 'B' : 'W';
    selectedSq = null;
    render();
    statusEl.innerText = turn === 'W' ? "White's Turn" : "Black's Turn";
}

function checkWin() {
    const f = board.flat();
    if (!f.includes('K')) showWinner("Black Wins!");
    else if (!f.includes('k')) showWinner("White Wins!");
}

function showWinner(msg) {
    winOverlay.style.display = 'flex';
    document.getElementById('winner-text').innerText = msg;
}

initGame();