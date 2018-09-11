module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-console': [ 'off' ]
  }
};
