const socket = io();
const chess = new Chess(); 
const boardElement = document.querySelector(".chessboard");
const dragSound = new Audio('/sounds/drag.mp3');
const dropSound = new Audio('/sounds/drop.mp3');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;
let currentTurn = null;

const renderBoard = ()=>{
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, i)=>{
        row.forEach((square,sqi)=>{
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
                (i+sqi)%2===0?"light":"dark"
            );
        
        squareElement.dataset.row = i;
        squareElement.dataset.col = sqi;
        
        if(square){
            const pieceElement = document.createElement("div");
            pieceElement.classList.add("piece",square.color==='w'?"white":"black");
            pieceElement.innerText = getPieceUnicode(square);
            pieceElement.draggable = playerRole === square.color;

            pieceElement.addEventListener("dragstart",(e)=>{
            if(pieceElement.draggable){
                draggedPiece = pieceElement;
                sourceSquare = {row: i, col: sqi};
                e.dataTransfer.setData("text/plain", "");
                dragSound.play();
            }
        });

        pieceElement.addEventListener("dragend",(e)=>{
            draggedPiece = null;
            sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
        };

        squareElement.addEventListener("dragover",(e)=>{
            e.preventDefault();
            dropSound.play();
        });
        squareElement.addEventListener("drop",(e)=>{
            e.preventDefault();
            if(draggedPiece){
                const targetSource = {
                    row: parseInt(squareElement.dataset.row),
                    col: parseInt(squareElement.dataset.col),
                };
                handleMove(sourceSquare,targetSource);
            }
        })
        boardElement.appendChild(squareElement);
    });
});
    updateTurnIndicator();
    if(playerRole==="b"){
        boardElement.classList.add("flipped");
    }else{
        boardElement.classList.remove("flipped");
    }
};

const handleMove = (source,target)=>{
    const move = {
        from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
        to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion: 'q'
    }
    socket.emit("move",move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙",
        r: "♖",
        n: "♘",
        b: "♗",
        q: "♕",
        k: "♔",
        P: "♟",
        R: "♜",
        N: "♞",
        B: "♝",
        Q: "♛",
        K: "♚",
    };
    return unicodePieces[piece.type] || "";
};

const updateTurnIndicator = () => {
    if (chess.turn() === 'w') {
        turnIndicator.textContent = "Turn: White";
    } else {
        turnIndicator.textContent = "Turn: Black";
    }
};

const updateTurnDisplay = () => {
    const turnIndicator = document.getElementById("turnindicator");
    if (currentTurn === "w") {
        turnIndicator.innerText = "White's Turn";
    } else if (currentTurn === "b") {
        turnIndicator.innerText = "Black's Turn";
    } else {
        turnIndicator.innerText = "";
    }
};

socket.on("currentPlayer", (player) => {
    currentTurn = player;
    updateTurnDisplay();
});

socket.on("playerRole",(role)=>{
    playerRole = role;
    renderBoard();
})

socket.on("spectatorRole",()=>{
    playerRole = null;
    renderBoard();
})

socket.on("boardState",(fen)=>{
    chess.load(fen);
    renderBoard();
})

socket.on("move",(move)=>{
    chess.move(move);
    renderBoard();
})

const whiteTimerElement = document.createElement("div");
Object.assign(whiteTimerElement.style, {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "20px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "10px",
    borderRadius: "5px",
});

const blackTimerElement = document.createElement("div");
Object.assign(blackTimerElement.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "20px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "10px",
    borderRadius: "5px",
});

document.body.appendChild(whiteTimerElement);
document.body.appendChild(blackTimerElement);

socket.on("updateTimer", ({ color, time }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    if (color === "white") {
        whiteTimerElement.innerText = `White Timer: ${formattedTime}`;
    } else if (color === "black") {
        blackTimerElement.innerText = `Black Timer: ${formattedTime}`;
    }
});

socket.on("gameOver", (data) => {
    const message = document.createElement("div");
    message.innerText = data.result === "win" ? "You Win!" : "You Lose!";
    
    // Add inline CSS for the message
    Object.assign(message.style, {
        color: data.result === "win" ? "green" : "red",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "48px",
        fontWeight: "bold",
        zIndex: "10",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)"
    });

    document.body.appendChild(message);
});


renderBoard();
