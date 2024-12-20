# Accessible Tic-Tac-Toe Game

## Introduction 
This is an accessible tic-tac-toe gameplay assignemnt for Government Digital Services, Accessibility Enabling Team.

## Assumptions
This project is built based off the assumption that
1. Users are visually impaired out of all the sensory impairments
2. Users are equipped with the knowledge of how to use a computer keyboard
3. Users understand the rules of tic-tac-toe
4. Users will play with headphones/headsets on

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Game Instructions](#game-instructions)
3. [Video Walkthrough](#video-walkthrough)
4. [API Documentation](#api-documentation)
5. [Design Summary](#design-summary)
6. [Architecture Diagram](#architecture-diagram)

---

### Setup Instructions
1. clone this repository 
```bash
    git clone https://github.com/lchen7809/ttt.git
```

2. Install all neccessary packages and dependencies + Run backend
```bash
    cd backend
    npm install
    node index.js (ensure port 5000 is available for use)
```
3. Install all neccessary packages and dependencies + Run frontend (open another terminal)
```bash
    cd frontend
    npm install
    npm start 
```
4. localhost website should pop out automatically 

### Game Instructions
1. The game is playable immediately as the page is loaded
2. I have done single page 2 player instead of real time gameplay with 2 browsers/players. (because I ran into problem with web socket...)
3. Use arrow key to navigate the board, and Enter to make a mark
4. Toggle to "Reset Game" button to reset game
5. Toggle to "Past Game" button to view past game details 
6. Past Game details shows Game ID, Winner for that game, and board history. Board history details will be read out when screen reader is activated. 
7. NVDA is used.


### Video Walkthrough
Youtube Link: 
https://youtu.be/7vrJdl1kIAM

### API Documentation
API List:

/api/games/create: Method: POST - Create a new game session.
Sample request: Postman POST http://localhost:5000/api/games/create
Sample response: { "gameId": "<gameId>" }

/api/games/move: Method: POST - Register a move.
Sample request: Postman POST "{ gameId, row, col }" http://localhost:5000/api/games/move
Sample response: { "board": [...], "winner": "<winner>" }

/api/games/reset: Method: POST - Reset the current game.
Sample request:  Postman POST  "{ gameId }" http://localhost:5000/api/games/reset

/api/games/past-games: Method: GET - Retrieve past games.
Sample request:  Postman GET http://localhost:5000/api/games/past-games
    {
        "id": "gameID",
        "board": "[...]",
        "winner": "<winner>"
    },

### Design Summary
This web application game was designed with accessibility as a primary consideration. The game includes support for screen readers, keyboard navigation, and custom audio feedback to ensure an inclusive experience for users with sensory impairments, particulary in vision impairment. 

#### Key Design Decisions

1. Screen Reader Compatibility
I have included ARIA attributes and live regions to ensure the game state is accessible to screen readers. Announcements are made for user turns and game outcomes.

2. Keyboard Navigation
Users can navigate the game grid with arrow keys and select cells using the Enter key. Included tabIndex="0" for non-functional parts like title and texts so that users can also use Tab key to toggle to all parts of the screen. 

3. Audio Feedback
I have created custom audio files that announces the grid position and cell content (X, O, or empty) in replace of using screen reader for game board. These audio make use of the idea of 8D audio where the sound will play in the direction of the cell. For example, at Row 1 Column 1, the audio will play its relevant audio files and will sound like its coming from user's top left direction. This audio is currently overlapping with screen reader for reading current user's turn. Improvements to be made in future revised versions.

4. User Interface Design
The game board and controls are styled for high contrast, ensuring readability for users with visual impairments. The interface maintains a clean, centered layout to keep focus on the gameplay and facilitate navigation.

5. Infrastructure
Frontend is built with React, for efficient state management.
Backend is built with Node.js and SQLite, which helps to handle game session creation, and track game history.
API endpoints support real-time game state updates.


### Architecture Diagram
![Architecture Diagram](images/architecture-diagram.png)

Thank you 
(I tried my best :'D)