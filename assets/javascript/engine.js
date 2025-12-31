'use strict';

/**
 * Execute a single combat round
 * Mutates player and enemy HP, increases player AP
 * @param {Object} state - Game state with player and enemy
 * @returns {Object} Combat round result
 */
export function executeCombatRound(state) {
    const { player, enemy } = state;

    if (!player || !enemy || player.hp <= 0 || enemy.hp <= 0) {
        return { playerDamage: 0, enemyDamage: 0 };
    }

    const playerDamage = player.ap;
    const enemyDamage = enemy.cp;

    // Apply damage
    enemy.hp -= playerDamage;
    player.hp -= enemyDamage;

    // Increase player attack power for next round
    player.ap += player.baseAp;

    return {
        playerDamage,
        enemyDamage,
        playerHp: player.hp,
        enemyHp: enemy.hp,
    };
}

/**
 * Check the outcome of the current battle state
 * @param {Object} state - Game state
 * @returns {'continue' | 'enemyDead' | 'playerDead' | 'victory'}
 */
export function checkBattleOutcome(state) {
    const { player, enemy, enemiesDefeated, enemies } = state;

    if (!player || !enemy) {
        return 'continue';
    }

    if (player.hp <= 0) {
        return 'playerDead';
    }

    if (enemy.hp <= 0) {
        // Check if this was the last enemy
        if (enemiesDefeated + 1 >= 3) {
            return 'victory';
        }
        return 'enemyDead';
    }

    return 'continue';
}

/**
 * Generate combat message
 * @param {string} attackerName
 * @param {string} defenderName
 * @param {number} damage
 * @param {number} counterDamage
 * @returns {string}
 */
export function getCombatMessage(attackerName, defenderName, damage, counterDamage) {
    return `${attackerName} hits ${defenderName} for ${damage} HP. ${defenderName} counters for ${counterDamage} HP.`;
}
