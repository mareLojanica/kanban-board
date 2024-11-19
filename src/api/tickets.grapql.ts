import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react"
import { ApolloError } from "@apollo/client"
import client from "./Apollo.Client"
import { RootState } from "../app/store"
import { TicketStatus } from "../types/VerticalKanbanBoard.types"
import { Ticket } from "../types/Tickets.types"
import {
	CREATE_TICKET,
	DELETE_TICKET,
	GET_TICKETS,
	UPDATE_TICKET,
} from "./queries/ticket.queries"
import {
	BaseQueryArgs,
	CreateTicketResponse,
	DeleteTicketResponse,
	GetTicketsResponse,
	UpdateTicketResponse,
} from "../types/api.reposne"

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
