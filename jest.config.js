module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@/(.*)': '<rootDir>/src/$1',
    '@modules/(.*)': '<rootDir>/src/modules/$1',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/test/setup/truncate-database.ts',
    '<rootDir>/jest.setup.js',
  ],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.(spec|test).ts'],
};
