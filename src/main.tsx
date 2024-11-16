import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import { StylesProvider } from "@mui/styles"

import "./index.css"
import App from "./App.tsx"
import client from "./api/Apollo.Client.ts"
import { ApolloProvider } from "@apollo/client"
import { store } from "./app/store.ts"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StylesProvider injectFirst>
			<ApolloProvider client={client}>
				<Provider store={store}>
					<App />
				</Provider>
			</ApolloProvider>
		</StylesProvider>
	</StrictMode>
)
