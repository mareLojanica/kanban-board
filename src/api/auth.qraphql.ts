import { createApi } from "@reduxjs/toolkit/query/react"
import { gql } from "@apollo/client"
import client from "./Apollo.Client"
import { DocumentNode } from "graphql"

type GraphQLMutationBody = {
	mutation: DocumentNode
}
const LOGIN = gql`
	mutation {
		login {
			accessToken
		}
	}
`

export const graphqlApiAuth = createApi({
	reducerPath: "graphqlApiAuth",
	baseQuery: async ({ body }: { body: GraphQLMutationBody }) => {
		try {
			const { data } = await client.mutate({
				mutation: body.mutation,
			})
			return { data: data?.login }
		} catch (error) {
			return { error: { status: 401, data: "Not authorized" } }
		}
	},
	endpoints: (builder) => ({
		login: builder.mutation<{ accessToken: string }, void>({
			query: () => ({
				body: {
					mutation: LOGIN,
				},
			}),
		}),
	}),
})

export const { useLoginMutation } = graphqlApiAuth
