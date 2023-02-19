module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    /**
     * either do that or wrap the main code in index.ts with anonymous function
     * (() => new AdonisBot());
     */
    'no-new': 0, //
    '@typescript-eslint/lines-between-class-members': 0,
    "@typescript-eslint/indent": 0,

  },
  root: true,
};