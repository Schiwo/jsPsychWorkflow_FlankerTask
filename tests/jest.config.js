module.exports = {
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: ['tests/**/*.test.js', 'tests/**/*.spec.js'],
  collectCoverageFrom: [
    'scripts/**/*.js',
    'input/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/'
  ],
  verbose: true
};
