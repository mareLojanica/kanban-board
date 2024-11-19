import { gql } from "@apollo/client"

export const GET_TICKETS = gql`
	query GetTickets($searchTicketsInput: SearchTicketsInput) {
		getTickets(searchTicketsInput: $searchTicketsInput) {
			id
			status
			title
		}
	}
`

export const UPDATE_TICKET = gql`
	mutation UpdateTicket($updateTicketInput: UpdateTicketInput!) {
		updateTicket(updateTicketInput: $updateTicketInput) {
			id
			status
			title
		}
	}
`

export const DELETE_TICKET = gql`
	mutation DeleteTicket($id: String!) {
		deleteTicket(id: $id) {
			success
		}
	}
`
export const CREATE_TICKET = gql`
	mutation CreateTicket($createTicketInput: CreateTicketInput!) {
		createTicket(createTicketInput: $createTicketInput) {
			id
			status
			title
		}
	}
`
