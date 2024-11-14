import { Container, Box, CssBaseline } from "@mui/material"
import Counter from "./features/counter/Counter"

function App() {
	return (
		<>
			<CssBaseline />
			<Container
				maxWidth="sm"
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<Box
					sx={{
						padding: 3,
						borderRadius: 2,
						boxShadow: 3,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						bgcolor: "background.paper",
					}}
				>
					<Counter />
				</Box>
			</Container>
		</>
	)
}

export default App
