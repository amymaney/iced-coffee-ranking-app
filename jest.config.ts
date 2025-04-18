import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: import("jest").Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], 
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export default createJestConfig(customJestConfig); // Use export default instead of module.exports
