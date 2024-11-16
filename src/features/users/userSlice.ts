import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react"
import client from "../../api/Apollo.Client"
import { DocumentNode, gql } from "@apollo/client"
import { RootState } from "../../app/store"

const GET_USERS = gql`
	query GetUsers {
		getUsers {
			id
			name
			email
		}
	}
`
export interface User {
	id: string
	name: string
	email: string
}

type QueryBody = {
	query: DocumentNode
	variables?: Record<string, any>
}

type ResultType = {
	data?: {
		[key: string]: any
	}
}
type ErrorType = {
	status: number
	data: string
}

const customBaseQuery: BaseQueryFn<
	{ body: QueryBody },
	ResultType,
	ErrorType
> = async ({ body }, api) => {
	try {
		const token: string | null = (api.getState() as RootState).auth
			?.accessToken

		const { data } = await client.query({
			...body,
			context: {
				headers: {
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			},
		})

		return { data }
	} catch (error) {
		return { error: { status: 500, data: "Unable to fetch users" } }
	}
}

export const graphqlApi = createApi({
	reducerPath: "graphqlApi",
	baseQuery: customBaseQuery,
	endpoints: (builder) => ({
		getUsers: builder.query<User, void>({
			query: () => ({
				body: {
					query: GET_USERS,
				},
			}),
		}),
	}),
})

export const { useGetUsersQuery } = graphqlApi
