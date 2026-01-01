'use strict';

import { Phase } from './state.js';

// Cache DOM elements
const dom = {
    roster: document.getElementById('roster'),
    attacker: document.getElementById('attacker'),
    enemies: document.getElementById('enemies'),
    defender: document.getElementById('defender'),
    fightButton: document.getElementById('fight-button'),
    messages: document.getElementById('messages'),
    button: document.querySelector('#fight-button button'),
};

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
 * @param {HTMLElement} el
 * @param {boolean} visible
 */
function setVisible(el, visible) {
    if (visible) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

/**
 * Render the entire UI based on game state
 * @param {Object} state
 */
export function render(state) {
    const { phase, player, enemy, enemies, message, gameResult } = state;

    // Update message
    dom.messages.innerHTML = `<p>${message}</p>`;

    // Update button text based on game state
    if (gameResult === 'won') {
        dom.button.textContent = 'PLAY AGAIN!';
    } else if (gameResult === 'lost') {
        dom.button.textContent = 'TRY AGAIN!';
    } else {
        dom.button.textContent = 'FIGHT!!!';
    }

    // Show/hide sections based on phase
    switch (phase) {
        case Phase.PICK_PLAYER:
            setVisible(dom.roster, true);
            setVisible(dom.attacker, false);
            setVisible(dom.enemies, false);
            setVisible(dom.defender, false);
            break;

        case Phase.PICK_ENEMY:
            setVisible(dom.roster, false);
            setVisible(dom.attacker, true);
            setVisible(dom.enemies, true);
            setVisible(dom.defender, false);
            break;

        case Phase.BATTLE:
            setVisible(dom.roster, false);
            setVisible(dom.attacker, true);
            setVisible(dom.enemies, true);
            setVisible(dom.defender, true);
            break;

        case Phase.GAME_OVER:
            setVisible(dom.roster, false);
            setVisible(dom.attacker, true);
            setVisible(dom.enemies, false);
            setVisible(dom.defender, false);
            break;
    }

    // NOTE: Roster is NOT cleared/rendered here during PICK_PLAYER phase.
    // It's managed separately by renderRoster() to avoid being wiped.

    // Render player
    clearFighters(dom.attacker);
    if (player) {
        const hpDisplay = player.hp <= 0 ? 'DEAD' : player.hp;
        dom.attacker.appendChild(createFighterCard(player, hpDisplay));
    }

    // Render available enemies
    clearFighters(dom.enemies);
    if (phase === Phase.PICK_ENEMY || phase === Phase.BATTLE) {
        enemies.forEach((e) => {
            dom.enemies.appendChild(createFighterCard(e));
        });
    }

    // Render current defender
    clearFighters(dom.defender);
    if (enemy && phase === Phase.BATTLE) {
        dom.defender.appendChild(createFighterCard(enemy));
    }
}

/**
 * Render roster of fighters for initial selection
 * @param {Array} roster
 */
export function renderRoster(roster) {
    clearFighters(dom.roster);
    roster.forEach((fighter) => {
        dom.roster.appendChild(createFighterCard(fighter));
    });
}

/**
 * Get the DOM container for event delegation
 */
export function getGameContainer() {
    return document.getElementById('game');
}

/**
 * Get the fight button element
 */
export function getFightButton() {
    return dom.button;
}
