import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['assets/javascript/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            // Warn on unused vars but don't fail build
            'no-unused-vars': 'warn',
            // Allow console for debugging
            'no-console': 'off',
        },
    },
    {
        // Ignore config files
        ignores: ['node_modules/**', 'eslint.config.js'],
    },
];
