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
        }
    }]
  },
  testRegex: '(test/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
      "@domain/(.*)": "<rootDir>/domain/$1",
      "src/(.*)": "<rootDir>/src/$1"
  }
};
