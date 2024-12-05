import {
	DndContext,
	DragEndEvent,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	useGetTicketsQuery,
	useUpdateTicketMutation,
} from "../../api/tickets.grapql"
import Spinner from "../../components/Spinner"
import {
	Box,
	debounce,
	Input,
	InputProps,
	styled,
	useMediaQuery,
	useTheme,
} from "@mui/material"
import { columnsConfig } from "../../config/kanbanConfig"

import { useDispatch, useSelector } from "react-redux"
import { setSearchText, setTickets } from "./ticketSlice"
import { RootState } from "../../app/store"
import { TicketStatus } from "../../types/VerticalKanbanBoard.types"
import { getEnumValueByKey } from "../../utils"
import { selectSearchText } from "./ticketSelectors"
import { useCallback, useState } from "react"
import { CustomPointerSensor } from "../../utils/CustomPointerSensor"
import KanbanLane from "../../components/KanbanLane"

const StyledInput = styled(Input)<InputProps>(({ theme }) => ({
	borderRadius: "8px",
	border: "1px solid #ccc",
	padding: "8px 12px",
	transition: "border-color 0.3s ease, box-shadow 0.3s ease",
	"&:hover": {
		borderColor: theme.palette.primary.main,
	},
	"&.Mui-focused": {
		borderColor: theme.palette.primary.main,
		boxShadow: `0 0 4px ${theme.palette.primary.main}`,
	},
	"&.Mui-error": {
		borderColor: theme.palette.error.main,
		boxShadow: `0 0 4px ${theme.palette.error.main}`,
	},
	"& input": {
		fontSize: "16px",
		color: theme.palette.text.primary,
	},
}))

const VerticalKanban = () => {
	const theme = useTheme()
	const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"))
	const pointerSensor = useSensor(CustomPointerSensor, {
		activationConstraint: {
			delay: 100,
			tolerance: 5,
		},
	})

	const sensors = useSensors(pointerSensor)
	const dispatch = useDispatch()
	const data = useSelector((state: RootState) => state.tickets.tickets)
	const searchText = useSelector(selectSearchText)
	const [debouncedSearchText, setDebouncedSearchText] = useState(searchText)
	const { isLoading } = useGetTicketsQuery({
		searchText:
			debouncedSearchText.length > 3 ? debouncedSearchText : undefined,
	})

	const [updateTicket] = useUpdateTicketMutation()

	const handleSearchChange = useCallback(
		debounce((value: string) => {
			setDebouncedSearchText(value)
		}, 300),
		[]
	)

	if (isLoading) {
		return <Spinner />
	}

	const handleDragEnd = async (event: DragEndEvent) => {
		const draggedTo = event.over?.id
		const activeCard = event.active.id
		if (
			draggedTo &&
			event.active.data.current &&
			draggedTo !== event.active.data.current.parent
		) {
			const updatedTickets = data?.map((ticket) => {
				if (ticket.id === activeCard) {
					return { ...ticket, status: String(draggedTo) }
				} else {
					return { ...ticket }
				}
			})

			dispatch(setTickets(updatedTickets ?? []))
			const statusKey = getEnumValueByKey(TicketStatus, String(draggedTo))
			updateTicket({
				id: String(activeCard),
				status: statusKey,
			}).unwrap()
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		dispatch(setSearchText(value))
		handleSearchChange(value)
	}

	return (
		<DndContext
			collisionDetection={rectIntersection}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					p: 2,
				}}
			>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<StyledInput
						placeholder="Search tickets..."
						sx={{
							width: {
								xs: "100%",
								md: "50%",
							},
						}}
						value={searchText}
						onChange={handleInputChange}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						gap: "16px",
						height: "100%",
						padding: 2,
						overflow: "auto",
					}}
				>
					{columnsConfig.map((column) => (
						<Box
							key={column.alias}
							sx={{
								width: isMobileOrTablet ? "250px" : "33%",
								minWidth: "250px",
							}}
						>
							<KanbanLane
								column={column}
								items={
									data.filter(
										(card) => card.status === column.alias
									) ?? []
								}
							/>
						</Box>
					))}
				</Box>
			</Box>
		</DndContext>
	)
}

export default VerticalKanban
