require("@testing-library/jest-dom")

globalThis.importMeta = {
	env: {
		VITE_API_URL: "http://localhost:3000/",
	},
}
