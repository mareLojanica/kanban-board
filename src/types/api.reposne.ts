import { Ticket } from "./Tickets.types"
import { TicketStatus } from "./VerticalKanbanBoard.types"
import { MutationOptions, QueryOptions } from "@apollo/client"

export interface TicketResponse {
	id: string
	title: string
	status: TicketStatus
	__typename: string
}
export interface GetTicketsResponse {
	getTickets: TicketResponse[]
}

export interface UpdateTicketResponse {
	updateTicket: Omit<TicketResponse, "__typename">
}

export interface DeleteTicketResponse {
	deleteTicket: {
		success: boolean
	}
}

export interface CreateTicketResponse {
	createTicket: Ticket
}

export interface BaseQueryArgs {
	body:
		| MutationOptions<
				MutationOptions,
				Record<string, any>,
				{ headers: { Authorization: string } }
		  >
		| QueryOptions<any, Record<string, any>>
}
