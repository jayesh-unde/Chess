const express = require("express");
const socket = require("socket.io");
const {Chess} = require("chess.js");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {};
let currentPlayer = "W";
let x = 0;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.render("index");
})
let ctr = 0;

let playerTimers = {
    white: 600, // 10 minutes in seconds
    black: 600,
};

let timerIntervals = {
    white: null,
    black: null,
};

io.on("connection",(socket)=>{
    console.log("user connected");
    if(!players.white){
        players.white = socket.id;
        socket.emit("playerRole","w");
    }else if(!players.black){
        players.black = socket.id;
        socket.emit("playerRole","b");
    }else{
        socket.emit("spectatorRole");
    }

    const startTimer = (color) => {
        clearInterval(timerIntervals.white);
        clearInterval(timerIntervals.black);
    
        timerIntervals[color] = setInterval(() => {
            if (playerTimers[color] > 0) {
                playerTimers[color] -= 1;
                io.emit("updateTimer", { color, time: playerTimers[color] });
            } else {
                clearInterval(timerIntervals[color]);
                const result = color === "white" ? "black" : "white";
                io.emit("gameOver", { result });
            }
        }, 1000); // Decrement timer every second
    };

    socket.on("move",(move)=>{
        try{
            if(chess.turn()==='w' && socket.id !== players.white) return;
            if(chess.turn()==='b' && socket.id !== players.black) return;
            const result = chess.move(move);
            if(result){
                currentPlayer = chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen());
                io.emit("currentPlayer",currentPlayer);
                startTimer(currentPlayer === "w" ? "white" : "black");
                if (!chess.moves().length) {
                    const winner = chess.turn() === "w" ? "Black" : "White";
                    const loser = chess.turn() === "w" ? players.white : players.black;
    
                    // Notify players of the result
                    io.to(players.white).emit("gameOver", {
                        result: players.white === loser ? "lose" : "win",
                    });
                    io.to(players.black).emit("gameOver", {
                        result: players.black === loser ? "lose" : "win",
                    });
                    clearInterval(timerIntervals.white);
                    clearInterval(timerIntervals.black);
                    return;
                }
            }else{
                console.log("invalid move");
                socket.emit("invalidMove",move);
            }
        }catch(err){
            console.log(err);
            socket.emit("Invalid move : ", move);
        }
    })
    socket.on("disconnect",()=>{
        if(socket.id==players.white){
            delete players.white;
        }else if(socket.id===players.black){
            delete players.black;
        }
        clearInterval(timerIntervals.white);
        clearInterval(timerIntervals.black);
    });
})
server.listen(3000,()=>{
    console.log("sun rha hai naa tu");
});