import { configureStore } from "@reduxjs/toolkit"
import { graphqlApiAuth } from "../api/auth.qraphql"
import { ticketsApi } from "../api/tickets.grapql"
import authReducer from "../features/auth/authSlice"
import ticketsReducer from "../features/kanban/ticketSlice"

export const store = configureStore({
	reducer: {
		[graphqlApiAuth.reducerPath]: graphqlApiAuth.reducer,
		[ticketsApi.reducerPath]: ticketsApi.reducer,
		tickets: ticketsReducer,
		auth: authReducer,
	},
	devTools: true,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(graphqlApiAuth.middleware)
			.concat(ticketsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
