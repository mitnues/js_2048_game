'use strict';
//import Game from '../modules/Game.class';
//Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

// Elementos do DOM
const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const statusElement = document.getElementById('game-status');

/**
 * Updates the game board and score in the DOM.
 */
function updateUI() {
    const state = game.getState();
    const score = game.getScore();
    const status = game.getStatus();

    // Update score
    scoreElement.textContent = score;

    // Update board
    boardElement.innerHTML = ''; // Clear board
    state.forEach(row => {
        row.forEach(cellValue => {
            const tile = document.createElement('div');
            tile.className = `field-cell field-cell--${cellValue}`;
            if (cellValue !== 0) {
                tile.textContent = cellValue;
            }
            boardElement.appendChild(tile);
        });
    });

    // Update game status and button
    if (status === 'win') {
        statusElement.textContent = 'You Win!';
        statusElement.className = 'win';
        statusElement.style.display = 'block';
    } else if (status === 'lose') {
        statusElement.textContent = 'Game Over!';
        statusElement.className = 'lose';
        statusElement.style.display = 'block';
    } else {
        statusElement.style.display = 'none';
    }

    if (status === 'idle') {
        startButton.textContent = 'Start';
    } else {
        startButton.textContent = 'Restart';
    }
}

/**
 * Handles user input from the keyboard.
 * @param {KeyboardEvent} event
 */
function handleKeydown(event) {
    if (game.getStatus() !== 'playing') return;

    switch (event.key) {
        case 'ArrowUp':
            game.moveUp();
            break;
        case 'ArrowDown':
            game.moveDown();
            break;
        case 'ArrowLeft':
            game.moveLeft();
            break;
        case 'ArrowRight':
            game.moveRight();
            break;
    }
    updateUI();
}

/**
 * Handles user input from touch gestures for mobile.
 */
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

function handleGesture() {
    if (game.getStatus() !== 'playing') return;

    const dx = touchendX - touchstartX;
    const dy = touchendY - touchstartY;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
        if (dx > 0) {
            game.moveRight();
        } else {
            game.moveLeft();
        }
    } else { // Vertical swipe
        if (dy > 0) {
            game.moveDown();
        } else {
            game.moveUp();
        }
    }
    updateUI();
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
        game.start();
    } else {
        game.restart();
    }
    updateUI();
});

document.addEventListener('keydown', handleKeydown);

// Add touch events for mobile
document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
});

// Initial UI render
updateUI();
