import { Button, Typography, Box } from "@mui/material"
import { useAppSelector } from "../../hooks/useAppSelector"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { increment, decrement, reset, setValue } from "./counterSlice"
import { selectCounterValue } from "./counterSelector"

const Counter: React.FC = () => {
	const count = useAppSelector(selectCounterValue)
	const dispatch = useAppDispatch()

	return (
		<Box display="flex" alignItems="center" gap={2}>
			<Button
				variant="contained"
				color="primary"
				onClick={() => dispatch(decrement())}
			>
				-
			</Button>
			{<Typography variant="h5">{count}</Typography>}
			<Button
				variant="contained"
				color="primary"
				onClick={() => dispatch(increment())}
			>
				+
			</Button>
			<Button
				variant="contained"
				color="primary"
				onClick={() => dispatch(reset())}
			>
				Reset
			</Button>
			<Button
				variant="contained"
				color="primary"
				onClick={() => dispatch(setValue(20))}
			>
				set value
			</Button>
		</Box>
	)
}

export default Counter
