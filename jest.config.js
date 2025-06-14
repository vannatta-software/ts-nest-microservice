/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  setupFiles: ['<rootDir>/test/setup.spec.ts'],
  testPathIgnorePatterns: [
      "<rootDir>/test/helpers",
      "<rootDir>/test/setup.spec.ts",
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/test/helpers",
    "<rootDir>/test/setup.spec.ts",
      "/node_modules/",
      "/dist/",
  ],
  transform: {
      '^.+\\.tsx?$': ["ts-jest", {
        // ts-jest configuration goes here
        tsconfig: './tsconfig.json',
        diagnostics: {
            ignoreCodes: [151001] // example of ignoring certain TypeScript errors, adjust as necessary
        },
        isolatedModules: false // Added to help with Reflect.getMetadata
    }]
  },
  testRegex: '(test/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
      "^@ts-nest-microservice/domain$": "<rootDir>/src/domain/dist", // Point to dist
      "^@ts-nest-microservice/domain/(.*)": "<rootDir>/src/domain/dist/$1", // Point to dist
      "^@ts-nest-microservice/contracts$": "<rootDir>/src/contracts/dist", // Point to dist
      "^@ts-nest-microservice/contracts/(.*)": "<rootDir>/src/contracts/dist/$1", // Point to dist
      "src/(.*)": "<rootDir>/src/$1"
  }
};
