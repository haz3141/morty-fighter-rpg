'use strict';

/**
 * Fighter character definition
 */
export class Fighter {
    constructor(id, name, hp, ap, cp) {
        this.id = id;
        this.name = name;
        this.baseHp = hp;
        this.hp = hp;
        this.baseAp = ap;
        this.ap = ap;
        this.cp = cp;
    }

    clone() {
        const fighter = new Fighter(this.id, this.name, this.baseHp, this.baseAp, this.cp);
        fighter.hp = this.hp;
        fighter.ap = this.ap;
        return fighter;
    }
}

/**
 * Initial roster of all fighters
 */
export const ROSTER = [
    new Fighter('c137', 'Morty C137', 150, 7, 25),
    new Fighter('lasagna', 'Lasagna Morty', 125, 9, 7),
    new Fighter('punk', 'Punk Morty', 175, 11, 9),
    new Fighter('zombie', 'Zombie Morty', 200, 9, 22),
];

/**
 * Game phases
 */
export const Phase = {
    PICK_PLAYER: 'pickPlayer',
    PICK_ENEMY: 'pickEnemy',
    BATTLE: 'battle',
    GAME_OVER: 'gameOver',
};

/**
 * Create initial game state
 */
export function createInitialState() {
    return {
        phase: Phase.PICK_PLAYER,
        player: null,
        enemy: null,
        enemies: [],
        enemiesDefeated: 0,
        message: 'Select your Morty!',
        log: [],
        gameResult: null, // 'won' | 'lost' | null
    };
}

/**
 * Global game state
 */
export let state = createInitialState();

/**
 * Reset state for a new game
 */
export function resetState() {
    state = createInitialState();
    return state;
}
