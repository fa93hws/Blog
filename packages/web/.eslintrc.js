module.exports = {
  root: true,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['eslint-plugin-react', 'react-hooks', 'jsx-a11y'],
  extends: [
    '@fa93hws-blog/eslint-config',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'react/display-name': 'off',
    'no-console': 'error',
    'class-methods-use-this': 'off',
  },
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
