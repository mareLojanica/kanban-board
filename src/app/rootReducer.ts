import { combineReducers } from "@reduxjs/toolkit"
import { graphqlApi } from "../features/users/userSlice"

const rootReducer = combineReducers({
	[graphqlApi.reducerPath]: graphqlApi.reducer,
})

export default rootReducer
