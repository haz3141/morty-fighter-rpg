import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['assets/javascript/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                // jQuery globals
                $: 'readonly',
                jQuery: 'readonly',
                // Game-specific globals (implicit declarations in logic.js)
                c137: 'writable',
                lasagna: 'writable',
                punk: 'writable',
                zombie: 'writable',
                fighters: 'writable',
                userSelected: 'writable',
                defenderSelected: 'writable',
                userMorty: 'writable',
                defender: 'writable',
                userID: 'writable',
                defenderID: 'writable',
                baseAttackPower: 'writable',
                enemiesDefeated: 'writable',
                ohJeez: 'writable',
                // Game functions
                Morty: 'readonly',
                newGame: 'readonly',
                debug: 'readonly',
                displayFighters: 'readonly',
                clickMorty: 'readonly',
                fight: 'readonly',
                battleCheck: 'readonly',
                updateBattle: 'readonly',
                displayMessage: 'readonly',
                lostGame: 'readonly',
                wonGame: 'readonly',
                pickAnOpponent: 'readonly',
            },
        },
        rules: {
            // Relax rules for legacy code patterns
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
            'no-redeclare': 'warn',
            // Allow console for debugging
            'no-console': 'off',
        },
    },
    {
        // Ignore config files themselves
        ignores: ['node_modules/**', 'eslint.config.js'],
    },
];
