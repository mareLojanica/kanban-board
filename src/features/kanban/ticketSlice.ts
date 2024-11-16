import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ticketsApi } from "../../api/tickets.grapql"

interface TicketsState {
	tickets: Array<{
		id: string
		status: string
		title: string
	}>
	isLoading: boolean
	isError: boolean
	searchText: string
}

const initialState: TicketsState = {
	isLoading: false,
	tickets: [],
	isError: false,
	searchText: "",
}

const ticketsSlice = createSlice({
	name: "tickets",
	initialState,
	reducers: {
		setTickets(
			state,
			action: PayloadAction<
				{
					id: string
					status: string
					title: string
				}[]
			>
		) {
			state.tickets = action.payload
		},
		setSearchText(state, action: PayloadAction<string>) {
			state.searchText = action.payload
		},
		deleteSelectedTicket(state, action: PayloadAction<string>) {
			state.tickets = state.tickets.filter(
				(ticket) => ticket.id !== action.payload
			)
		},
		addNewTicket(
			state,
			action: PayloadAction<{
				id: string
				status: string
				title: string
			}>
		) {
			state.tickets = [...state.tickets, action.payload]
		},
		updateTicketById(
			state,
			action: PayloadAction<{ id: string; title: string }>
		) {
			state.tickets = state.tickets.map((ticket) => {
				if (ticket.id === action.payload.id) {
					return { ...ticket, title: action.payload.title }
				}
				return { ...ticket }
			})
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			ticketsApi.endpoints.getTickets.matchFulfilled,
			(state, { payload }) => {
				state.tickets = payload
			}
		)
	},
})

export const {
	setTickets,
	setSearchText,
	deleteSelectedTicket,
	addNewTicket,
	updateTicketById,
} = ticketsSlice.actions
export default ticketsSlice.reducer
