module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false
      }
    ],
    '@babel/preset-typescript'
  ],
  env: {
    test: {
      presets: [['@babel/preset-env']]
    }
  },
  plugins: ['@babel/plugin-syntax-dynamic-import']
};
