import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    testMatch: ["**/tests/**/*.test.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    verbose: true,
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    },
    globalSetup: "<rootDir>/tests/setup.ts"
};

export default config;
