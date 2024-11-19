import { createSlice } from "@reduxjs/toolkit"
import { graphqlApiAuth } from "../../api/auth.qraphql"
import { AuthState } from "../../types/Auth.types"

const initialState: AuthState = {
	accessToken: null,
	isLoading: false,
	error: null,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.accessToken = null
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			graphqlApiAuth.endpoints.login.matchFulfilled,
			(state, { payload }) => {
				state.accessToken = payload.accessToken
				state.isLoading = false
				state.error = null
			}
		)
		builder.addMatcher(
			graphqlApiAuth.endpoints.login.matchPending,
			(state) => {
				state.isLoading = true
			}
		)
		builder.addMatcher(
			graphqlApiAuth.endpoints.login.matchRejected,
			(state, action) => {
				state.isLoading = false
				state.error = action.error.message || "Failed to log in."
			}
		)
	},
})

export const { logout } = authSlice.actions

export default authSlice.reducer
