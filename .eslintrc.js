module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 函数左边的空格可以省略
    'space-before-function-paren': 0,
    // 可以有缩进样式
    'indent': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
