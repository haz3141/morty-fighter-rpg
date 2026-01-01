'use strict';

import { Phase } from './state.js';

// Define required mount point IDs
const MOUNT_IDS = [
    'appHeader',
    'appMain',
    'panelPlayer',
    'panelArena',
    'panelEnemies',
    'mountPhase',
    'mountActions',
    'mountPlayer',
    'mountEnemies',
    'mountLog',
    'roster',
];

/**
 * Element cache with fail-fast validation
 */
let el = null;

function initElements() {
    const elements = {};
    const missing = [];

    for (const id of MOUNT_IDS) {
        const element = document.getElementById(id);
        if (!element) {
            missing.push(id);
        } else {
            elements[id] = element;
        }
    }

    if (missing.length > 0) {
        throw new Error(`Missing required mount points: ${missing.join(', ')}`);
    }

    return elements;
}

/**
 * Initialize element cache (call after DOM ready)
 */
export function initUI() {
    el = initElements();
}

/**
 * Create a fighter card element
 * @param {Object} fighter
 * @param {string|number} hpDisplay - HP to display (can be 'DEAD')
 * @returns {HTMLElement}
 */
function createFighterCard(fighter, hpDisplay = fighter.hp) {
    const div = document.createElement('div');
    div.className = 'morty-div';
    div.dataset.fighterId = fighter.id;

    const nameP = document.createElement('p');
    nameP.textContent = fighter.name;

    const img = document.createElement('img');
    img.src = `assets/images/${fighter.id}.png`;
    img.height = 150;
    img.dataset.fighterId = fighter.id;

    const hpP = document.createElement('p');
    hpP.textContent = hpDisplay;

    div.appendChild(nameP);
    div.appendChild(img);
    div.appendChild(hpP);

    return div;
}

/**
 * Clear all fighter cards from a container (preserving headers)
 * @param {HTMLElement} container
 */
function clearFighters(container) {
    const cards = container.querySelectorAll('.morty-div');
    cards.forEach((card) => card.remove());
}

/**
 * Show or hide an element using the .hidden class
 * @param {HTMLElement} element
 * @param {boolean} visible
 */
function setVisible(element, visible) {
    if (visible) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

/**
 * Render the phase indicator
 * @param {Object} state
 */
function renderPhase(state) {
    const { phase } = state;
    let text = '';

    switch (phase) {
        case Phase.PICK_PLAYER:
            text = 'Choose your fighter';
            break;
        case Phase.PICK_ENEMY:
            text = 'Pick an opponent';
            break;
        case Phase.BATTLE:
            text = 'Battle!';
            break;
        case Phase.GAME_OVER:
            text = state.gameResult === 'won' ? 'Victory!' : 'Defeat!';
            break;
    }

    el.mountPhase.textContent = text;
}

/**
 * Render the action button with phase-aware labels and states
 * @param {Object} state
 */
function renderActions(state) {
    const { phase, gameResult } = state;

    // Clear and recreate button
    el.mountActions.innerHTML = '';

    const button = document.createElement('button');
    button.id = 'fightButton';

    switch (phase) {
        case Phase.PICK_PLAYER:
            button.textContent = 'Select a fighter';
            button.disabled = true;
            break;
        case Phase.PICK_ENEMY:
            button.textContent = 'Select an enemy';
            button.disabled = true;
            break;
        case Phase.BATTLE:
            button.textContent = 'Fight!';
            button.disabled = false;
            break;
        case Phase.GAME_OVER:
            button.textContent = gameResult === 'won' ? 'Play Again!' : 'Try Again!';
            button.disabled = false;
            break;
    }

    el.mountActions.appendChild(button);
}

/**
 * Render the player card
 * @param {Object} state
 */
function renderPlayer(state) {
    const { phase, player } = state;

    clearFighters(el.mountPlayer);

    if (phase === Phase.PICK_PLAYER) {
        setVisible(el.panelPlayer, false);
        return;
    }

    setVisible(el.panelPlayer, true);

    if (player) {
        const hpDisplay = player.hp <= 0 ? 'DEAD' : player.hp;
        el.mountPlayer.appendChild(createFighterCard(player, hpDisplay));
    }
}

/**
 * Render the enemies
 * @param {Object} state
 */
function renderEnemies(state) {
    const { phase, enemies, enemy } = state;

    clearFighters(el.mountEnemies);

    if (phase === Phase.PICK_PLAYER || phase === Phase.GAME_OVER) {
        setVisible(el.panelEnemies, false);
        return;
    }

    setVisible(el.panelEnemies, true);

    // In pick enemy phase, show all available enemies
    if (phase === Phase.PICK_ENEMY) {
        enemies.forEach((e) => {
            el.mountEnemies.appendChild(createFighterCard(e));
        });
    }

    // In battle phase, show current defender + remaining enemies
    if (phase === Phase.BATTLE) {
        if (enemy) {
            const card = createFighterCard(enemy);
            card.classList.add('defender');
            el.mountEnemies.appendChild(card);
        }
        enemies.forEach((e) => {
            el.mountEnemies.appendChild(createFighterCard(e));
        });
    }
}

/**
 * Render the combat log
 * @param {Object} state
 */
function renderLog(state) {
    const { log = [], message } = state;

    el.mountLog.innerHTML = '';

    // If no log entries yet, show current message
    if (log.length === 0 && message) {
        const p = document.createElement('p');
        p.textContent = message;
        el.mountLog.appendChild(p);
        return;
    }

    // Show last 8 log entries
    const entries = log.slice(-8);
    entries.forEach((entry) => {
        const p = document.createElement('p');
        p.textContent = entry;
        el.mountLog.appendChild(p);
    });

    // Auto-scroll to bottom
    el.mountLog.scrollTop = el.mountLog.scrollHeight;
}

/**
 * Render all UI components
 * @param {Object} state
 */
function renderAll(state) {
    const { phase } = state;

    // Show/hide main sections based on phase
    setVisible(el.roster, phase === Phase.PICK_PLAYER);
    setVisible(el.appMain, phase !== Phase.PICK_PLAYER);

    // Render each component
    renderPhase(state);
    renderActions(state);
    renderPlayer(state);
    renderEnemies(state);
    renderLog(state);
}

/**
 * Render the entire UI based on game state
 * @param {Object} state
 */
export function render(state) {
    // Use new mount-based rendering
    renderAll(state);
}

/**
 * Render roster of fighters for initial selection
 * @param {Array} roster
 */
export function renderRoster(roster) {
    clearFighters(el.roster);
    roster.forEach((fighter) => {
        el.roster.appendChild(createFighterCard(fighter));
    });
}

/**
 * Get the DOM container for event delegation
 */
export function getGameContainer() {
    return document.getElementById('game');
}
