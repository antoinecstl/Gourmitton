import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  // ...other jest configs
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.jest.js' }],
  },
}

module.exports = createJestConfig(customJestConfig)