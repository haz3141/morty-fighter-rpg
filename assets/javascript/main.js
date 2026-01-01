'use strict';

import { state, resetState, ROSTER, Phase, Fighter } from './state.js';
import { executeCombatRound, checkBattleOutcome, getCombatMessage } from './engine.js';
import { render, renderRoster, getGameContainer, getFightButton, initUI } from './ui.js';

// Audio
const ohJeez = new Audio('./assets/audio/oh_jeez.mp3');

/**
 * Clone roster for a new game
 */
function cloneRoster() {
    return ROSTER.map((f) => f.clone());
}

/**
 * Initialize game state for a new game
 */
function initGame() {
    resetState();
    const roster = cloneRoster();
    state.message = 'Select your Morty!';
    renderRoster(roster);
    render(state);
    return roster;
}

// Current roster (mutable during game)
let currentRoster = [];

/**
 * Handle selecting a fighter from roster or enemies
 */
function handleFighterClick(fighterId) {
    if (state.phase === Phase.PICK_PLAYER) {
        // Find and remove selected fighter from roster
        const index = currentRoster.findIndex((f) => f.id === fighterId);
        if (index === -1) return;

        const selectedFighter = currentRoster.splice(index, 1)[0];
        state.player = selectedFighter;
        state.enemies = currentRoster; // Remaining fighters become enemies
        state.phase = Phase.PICK_ENEMY;
        state.message = 'Pick an opponent!';
        render(state);
    } else if (state.phase === Phase.PICK_ENEMY) {
        // Don't allow clicking own fighter
        if (fighterId === state.player.id) return;

        // Find and remove selected enemy
        const index = state.enemies.findIndex((f) => f.id === fighterId);
        if (index === -1) return;

        const selectedEnemy = state.enemies.splice(index, 1)[0];
        state.enemy = selectedEnemy;
        state.phase = Phase.BATTLE;
        state.message = '';
        render(state);
    }
}

/**
 * Handle fight button click
 */
function handleFightClick() {
    if (state.phase === Phase.BATTLE && state.player && state.enemy) {
        // Execute combat round
        const result = executeCombatRound(state);
        ohJeez.play();

        // Update message
        state.message = getCombatMessage(
            state.player.name,
            state.enemy.name,
            result.playerDamage,
            result.enemyDamage
        );

        // Check outcome
        const outcome = checkBattleOutcome(state);

        switch (outcome) {
            case 'victory':
                state.enemiesDefeated++;
                state.phase = Phase.GAME_OVER;
                state.gameResult = 'won';
                state.message = 'You Won! Play Again.';
                break;

            case 'playerDead':
                state.phase = Phase.GAME_OVER;
                state.gameResult = 'lost';
                state.message = 'You Lost! Try Again.';
                break;

            case 'enemyDead':
                state.enemiesDefeated++;
                state.enemy = null;
                state.phase = Phase.PICK_ENEMY;
                state.message = 'Pick an opponent!';
                break;

            case 'continue':
            default:
                // Battle continues
                break;
        }

        render(state);
    } else if (state.phase === Phase.GAME_OVER) {
        // Reset and start new game
        currentRoster = initGame();
    }
}

/**
 * Set up event listeners (called once)
 */
function setupEventListeners() {
    const gameContainer = getGameContainer();
    const fightButton = getFightButton();

    // Event delegation for fighter selection
    gameContainer.addEventListener('click', (e) => {
        const target = e.target;

        // Check if clicked on a fighter image or container
        if (target.dataset.fighterId) {
            handleFighterClick(target.dataset.fighterId);
        } else if (target.closest('[data-fighter-id]')) {
            const fighterId = target.closest('[data-fighter-id]').dataset.fighterId;
            handleFighterClick(fighterId);
        }
    });

    // Fight button
    fightButton.addEventListener('click', handleFightClick);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initUI(); // Initialize UI element cache
    setupEventListeners();
    currentRoster = initGame();
});
