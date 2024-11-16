import { CssBaseline } from "@mui/material"

import Auth from "./features/auth/Auth"
import VerticalKanban from "./features/kanban/VerticalKanban"

function App() {
	return (
		<>
			<CssBaseline />
			<Auth>
				<VerticalKanban />
			</Auth>
		</>
	)
}

export default App
