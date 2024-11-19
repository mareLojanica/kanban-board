import { FC, PropsWithChildren, useEffect } from "react"
import { useSelector } from "react-redux"

import { useLoginMutation } from "../../api/auth.qraphql"
import { RootState } from "../../app/store"
import Spinner from "../../components/Spinner"

const Auth: FC<PropsWithChildren> = ({ children }) => {
	const [login, { isLoading }] = useLoginMutation()
	const accessToken = useSelector(
		(state: RootState) => state.auth.accessToken
	)
	const handleLogin = async () => {
		try {
			await login().unwrap()
		} catch (err) {}
	}
	useEffect(() => {
		handleLogin()
	}, [])
	return <>{!isLoading && accessToken ? children : <Spinner />}</>
}

export default Auth
