# Real-Time 2 Player Chess Game

A real-time multiplayer chess game built using **Node.js**, **Socket.io**, **Chess.js**, **TailwindCSS**, and **JavaScript**. This game allows two players to play against each other in real-time with a built-in timer, sound effects for each move, and more.

## Features

- **Real-Time Multiplayer**: Players can compete in real-time using WebSockets with **Socket.io**.
- **Chess Logic**: Uses **Chess.js** for handling chess moves, validation, and game status.
- **Timer**: Each player has a countdown timer to make their move, adding an exciting time pressure element.
- **Sound Effects**: Sounds play on every move to enhance the gaming experience.
- **Responsive UI**: Designed with **TailwindCSS** to ensure a clean and responsive user interface.
- **User-Friendly**: Intuitive gameplay with drag-and-drop functionality for moves.
- **Game State Persistence**: The game state is stored on the server, so no progress is lost if a player disconnects temporarily.
  
## Technologies Used

- **Node.js**: For the backend server and WebSocket communication.
- **Socket.io**: For real-time bi-directional communication between the client and server.
- **Chess.js**: To handle chess logic such as move validation, checkmate detection, and game rules.
- **TailwindCSS**: For styling the frontend in a responsive, clean, and modern way.
- **JavaScript**: Client-side scripting to manage the game's frontend behavior.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chess-game.git
   cd chess-game
2. Install the required dependencies:

    ```bash
   npm install

3. Start the server:

     ```bash
   node app.js

