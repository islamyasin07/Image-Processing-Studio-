/* eslint-env node */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    env: { node: true, es2021: true },
    ignorePatterns: ['dist', 'cache', 'assets'],
    rules: { 'prettier/prettier': 'warn' }
  };
  