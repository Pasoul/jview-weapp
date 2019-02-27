module.exports = {
  verbose: true, // 运行期间报告每个单独的测试
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: __dirname,
  collectCoverageFrom: [
    // '<rootDir>/src/packages/**/*.test.js'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transform: {
    '^.+\\.[jt]s?$': 'babel-jest'
  }
};
