/* eslint-disable */
// To have different commands to run unit tests and integration tests
// https://medium.com/coding-stones/separating-unit-and-integration-tests-in-jest-f6dd301f399c
const { defaults } = require('jest-config/build/index');

module.exports = {
    'roots': [
        '<rootDir>/src',
        '<rootDir>/tests'
    ],
    'transform': {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json'
        }
    },
    'collectCoverage': false,
    'collectCoverageFrom': [
        '**/*.ts',
        '!**/tests/**',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    'coveragePathIgnorePatterns': [
        '/node_modules/'
    ],
    'coverageThreshold': {
        'global': {
            'statements': 100,
            'branches': 100,
            'functions': 100,
            'lines': 100
        }
    },

    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],

    testEnvironment: 'node'
};
