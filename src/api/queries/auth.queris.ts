import { gql } from "@apollo/client"

export const LOGIN = gql`
	mutation {
		login {
			accessToken
		}
	}
`
