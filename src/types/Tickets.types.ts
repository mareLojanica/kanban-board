export interface Ticket {
	id: string
	status: string
	title: string
	isNew?: boolean
}

export interface TicketsState {
	tickets: Ticket[]
	isLoading: boolean
	isError: boolean
	searchText: string
}
