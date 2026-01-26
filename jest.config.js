module.exports = {
  testEnvironment: 'node',
  testRegex: '.*\\.test\\.js$',
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
