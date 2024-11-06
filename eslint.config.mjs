// @ts-check

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    eslint.configs.recommended,
    eslintConfigPrettier,
    {
        parserOptions: {
            "ecmaVersion": 2020
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        files: ['**/*.js'],
        rules: {
            'no-console': 'error',
            'no-useless-catch': 0,
            quotes: ['error', 'single', { allowTemplateLiterals: true }],
        },
        ignores: ['node_modules/**', 'dist/**'] // Replace ".eslintignore" with this property
    },

];
