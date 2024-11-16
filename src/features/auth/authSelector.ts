import { useSelector } from "react-redux"
import { RootState } from "../../app/store"

export const accessToken = useSelector(
	(state: RootState) => state.auth.accessToken
)
