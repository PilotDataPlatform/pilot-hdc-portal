module.exports = {
  preset: 'jest-puppeteer',
  projects: [
    {
      displayName: 'Serial Test Cases',
      preset: 'jest-puppeteer',
      runner: 'jest-serial-runner',
      testMatch: [
        '<rootDir>/tests/e2e/tests/**/?(*.)+(serial-test).js',
        '<rootDir>/tests/critical-tests/tests/**/?(*.)+(critical.serial-test).js',
      ],
    },
    {
      displayName: 'Parallel Test Cases',
      preset: 'jest-puppeteer',
      testMatch: [
        '<rootDir>/tests/e2e/tests/**/*.test.js',
        '<rootDir>/tests/critical-tests/tests/**/*.critical.test.js',
      ],
    },
  ],
};
