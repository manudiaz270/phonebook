module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 15,
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
  },
};
