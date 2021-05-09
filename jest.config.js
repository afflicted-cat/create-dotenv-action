// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  collectCoverage: false,
  testEnvironment: "node",
  moduleFileExtensions: ["js"],
  moduleDirectories: ["node_modules"],
  testMatch: ["**/__tests__/*.+(js|ts|tsx)", "**/*.test.(js|ts|tsx)"],
};
