module.exports = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jest-environment-jsdom",
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
		"^.+\\.(graphql|gql)$": "jest-transform-graphql",
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
}
