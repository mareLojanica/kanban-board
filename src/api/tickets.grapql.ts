import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react"
import { gql, ApolloError, MutationOptions, QueryOptions } from "@apollo/client"
import client from "./Apollo.Client"
import { RootState } from "../app/store"
import { TicketStatus } from "../types/VerticalKanbanBoard.types"

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

const DELETE_TICKET = gql`
	mutation DeleteTicket($id: String!) {
		deleteTicket(id: $id) {
			success
		}
	}
`
const CREATE_TICKET = gql`
	mutation CreateTicket($createTicketInput: CreateTicketInput!) {
		createTicket(createTicketInput: $createTicketInput) {
			id
			status
			title
		}
	}
`
export type Ticket = Omit<TicketResponse, "__typename">
export type TicketResponse = {
	id: string
	title: string
	status: TicketStatus
	__typename: string
}
export type GetTicketsResponse = {
	getTickets: TicketResponse[]
}

export type UpdateTicketResponse = {
	updateTicket: Omit<TicketResponse, "__typename">
}

export type DeleteTicketResponse = {
	deleteTicket: {
		success: boolean
	}
}

export type CreateTicketResponse = {
	createTicket: Ticket
}

type BaseQueryArgs = {
	body:
		| MutationOptions<
				MutationOptions,
				Record<string, any>,
				{ headers: { Authorization: string } }
		  >
		| QueryOptions<any, Record<string, any>>
}

const baseQuery: BaseQueryFn<BaseQueryArgs, unknown, ApolloError> = async (
	args,
	api
) => {
	const token: string | null = (api.getState() as RootState).auth?.accessToken

	const contextHeaders = {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	}

	try {
		if ("mutation" in args.body) {
			const { data } = await client.mutate({
				...args.body,
				context: contextHeaders,
			})
			return { data }
		} else if ("query" in args.body) {
			const { data } = await client.query({
				...args.body,
				context: contextHeaders,
			})
			return { data }
		} else {
			throw new ApolloError({
				errorMessage: "Invalid query/mutation type",
			})
		}
	} catch (error) {
		return { error: error as ApolloError }
	}
}

export const ticketsApi = createApi({
	reducerPath: "ticketsApi",
	baseQuery,
	endpoints: (builder) => ({
		getTickets: builder.query<Ticket[], { searchText?: string }>({
			query: (args) => ({
				body: {
					query: GET_TICKETS,
					variables: {
						searchTicketsInput: {
							searchText: args?.searchText || "",
						},
					},
				},
			}),
			transformResponse: (response: GetTicketsResponse) =>
				response.getTickets.map(({ __typename, ...rest }) => ({
					...rest,
				})),
		}),
		updateTicket: builder.mutation<UpdateTicketResponse, Partial<Ticket>>({
			query: (updateTicketInput) => ({
				body: {
					mutation: UPDATE_TICKET,
					variables: { updateTicketInput },
				},
			}),
		}),
		deleteTicket: builder.mutation<DeleteTicketResponse, { id: string }>({
			query: ({ id }) => ({
				body: {
					mutation: DELETE_TICKET,
					variables: { id },
				},
			}),
		}),
		createTicket: builder.mutation<
			CreateTicketResponse,
			{ title: string; status: TicketStatus }
		>({
			query: (createTicketInput) => ({
				body: {
					mutation: CREATE_TICKET,
					variables: { createTicketInput },
				},
			}),
		}),
	}),
})

export const {
	useGetTicketsQuery,
	useUpdateTicketMutation,
	useDeleteTicketMutation,
	useCreateTicketMutation,
} = ticketsApi
