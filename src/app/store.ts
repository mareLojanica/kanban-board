import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"

const store = configureStore({
	reducer: rootReducer,
	devTools: import.meta.env.VITE_ENVIRONMENT !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
