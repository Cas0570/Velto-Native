module.exports = {
  extends: [
    'expo',
    '@react-native',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-native/no-inline-styles': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};