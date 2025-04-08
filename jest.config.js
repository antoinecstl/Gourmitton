module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Utilise Babel pour transformer les fichiers JS/TS/JSX/TSX
    },
    testEnvironment: 'jest-environment-jsdom', // Nécessaire pour tester les composants React
    setupFilesAfterEnv: ['@testing-library/jest-dom'], // Ajoute jest-dom pour les assertions supplémentaires
  };