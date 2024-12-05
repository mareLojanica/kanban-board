import { FC } from "react"
import { Box, CircularProgress } from "@mui/material"

const Spinner: FC = (): JSX.Element => {
	return (
		<Box
			data-testid="spinner"
			sx={{
				width: "100%",
				height: "100%",
			}}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<CircularProgress size={64} disableShrink thickness={3} />
		</Box>
	)
}

export default Spinner
