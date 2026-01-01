'use strict';

import { Phase } from './state.js';

const el = (() => {
    const mounts = {
        appMain: document.getElementById('appMain'),
        mountPhase: document.getElementById('mountPhase'),
        mountActions: document.getElementById('mountActions'),
        mountPlayer: document.getElementById('mountPlayer'),
        mountEnemies: document.getElementById('mountEnemies'),
        mountLog: document.getElementById('mountLog'),
    };

    const missing = Object.entries(mounts)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missing.length) {
        throw new Error(`Missing required UI mount(s): ${missing.join(', ')}`);
    }

    const actionsButton = mounts.mountActions.querySelector('button');

    if (!actionsButton) {
        throw new Error('Missing primary action button inside #mountActions');
    }

    return {
        ...mounts,
        actionsButton,
    };
})();

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
function getPhaseLabel(phase) {
    switch (phase) {
        case Phase.PICK_PLAYER:
            return 'Pick Your Fighter';
        case Phase.PICK_ENEMY:
            return 'Pick an Opponent';
        case Phase.BATTLE:
            return 'Battle!';
        case Phase.GAME_OVER:
            return 'Game Over';
        default:
            return '';
    }
}

export function renderPhase(state) {
    el.mountPhase.textContent = getPhaseLabel(state.phase);
}

export function renderActions(state) {
    if (state.phase === Phase.PICK_PLAYER) {
        el.actionsButton.textContent = 'Select a fighter';
        el.actionsButton.disabled = true;
        return;
    }

    if (state.phase === Phase.PICK_ENEMY) {
        el.actionsButton.textContent = 'Select an enemy';
        el.actionsButton.disabled = true;
        return;
    }

    el.actionsButton.disabled = false;

    if (state.gameResult === 'won') {
        el.actionsButton.textContent = 'PLAY AGAIN!';
    } else if (state.gameResult === 'lost') {
        el.actionsButton.textContent = 'TRY AGAIN!';
    } else {
        el.actionsButton.textContent = 'Fight!';
    }
}

export function renderPlayer(state) {
    if (state.phase === Phase.PICK_PLAYER) {
        return;
    }

    clearFighters(el.mountPlayer);
    if (state.player) {
        const hpDisplay = state.player.hp <= 0 ? 'DEAD' : state.player.hp;
        el.mountPlayer.appendChild(createFighterCard(state.player, hpDisplay));
    }
}

export function renderEnemies(state) {
    clearFighters(el.mountEnemies);

    if (state.phase === Phase.PICK_ENEMY || state.phase === Phase.BATTLE) {
        if (state.enemy && state.phase === Phase.BATTLE) {
            el.mountEnemies.appendChild(createFighterCard(state.enemy));
        }

        state.enemies.forEach((enemy) => {
            el.mountEnemies.appendChild(createFighterCard(enemy));
        });
    }
}

export function renderLog(state) {
    const entries = (state.log || []).slice(-8);
    const list = document.createElement('ul');
    list.className = 'combat-log';

    entries.forEach((entry) => {
        const item = document.createElement('li');
        item.textContent = entry;
        list.appendChild(item);
    });

    el.mountLog.innerHTML = '';
    el.mountLog.appendChild(list);
}

export function renderAll(state) {
    renderPhase(state);
    renderActions(state);
    renderPlayer(state);
    renderEnemies(state);
    renderLog(state);
}

/**
 * Render roster of fighters for initial selection
 * @param {Array} roster
 */
export function renderRoster(roster) {
    clearFighters(el.mountPlayer);
    roster.forEach((fighter) => {
        el.mountPlayer.appendChild(createFighterCard(fighter));
    });
}

/**
 * Get the DOM container for event delegation
 */
export function getGameContainer() {
    return el.appMain;
}

/**
 * Get the fight button element
 */
export function getFightButton() {
    return el.actionsButton;
}
