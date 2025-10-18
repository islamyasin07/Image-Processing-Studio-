import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', 'cache/**', 'node_modules/**'] },

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
];
