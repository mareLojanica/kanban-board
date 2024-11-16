import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export const selectTicketsState = (state: RootState) => state.tickets

export const selectIsLoading = createSelector(
	selectTicketsState,
	(ticketsState) => ticketsState.isLoading
)

export const selectIsError = createSelector(
	selectTicketsState,
	(ticketsState) => !!ticketsState.isError
)

export const selectSearchText = (state: RootState) => state.tickets.searchText
export const selectTickets = (state: RootState) => state.tickets.tickets
