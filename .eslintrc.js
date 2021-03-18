module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript/base',
    'plugin:jest/all',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'max-classes-per-file': 0,
    'no-mixed-operators': 0,
    'import/prefer-default-export': 0,
  }
};
