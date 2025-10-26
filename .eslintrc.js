module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        'react-native/no-inline-styles': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'prettier/prettier': 'warn',
      },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-console': ['warn', {allow: ['warn', 'error']}],
  },
};
