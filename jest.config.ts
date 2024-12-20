import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    testMatch: ["**/tests/**/*.test.ts"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    verbose: true,
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "ts-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "jsx", "tsx", "json", "node"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1"
    },
    globalSetup: "<rootDir>/tests/setup.ts",
    setupFiles: ["<rootDir>/tests/teardown.ts"]
};

export default config;
