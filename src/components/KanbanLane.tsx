import { useDroppable } from "@dnd-kit/core"
import { Box, Typography, IconButton } from "@mui/material"
import KanbanCard from "./KanbanCard"
import AddIcon from "@mui/icons-material/Add"
import { TicketStatus } from "../types/VerticalKanbanBoard.types"
import { useCreateTicketMutation } from "../api/tickets.grapql"
import { useDispatch } from "react-redux"
import { addNewTicket } from "../features/kanban/ticketSlice"

interface ColumnConfig {
	alias: TicketStatus
	headerColor: string
	backgroundColor: string
	cardColor: string
}

interface KanbanLaneProps {
	column: ColumnConfig
	items: { title: string; id: string }[]
}

export function KanbanLane({ column, items }: KanbanLaneProps) {
	const { setNodeRef } = useDroppable({
		id: column.alias,
	})
	const dispatch = useDispatch()
	const [createTicket] = useCreateTicketMutation()

	const handleCreateTicket = async () => {
		const statusValue =
			TicketStatus[column.alias as unknown as keyof typeof TicketStatus]
		console.log(column.alias)
		const newTicket = await createTicket({
			title: "Double Click To Edit",
			status: statusValue,
		}).unwrap()
		dispatch(addNewTicket(newTicket.createTicket))
	}

	return (
		<Box
			sx={{
				flex: 3,
				display: "flex",
				flexDirection: "column",
				height: "100%",
				borderRadius: "12px",
			}}
		>
			<Box
				sx={{
					background: column.headerColor,
					color: "#ffffff",
					padding: 2,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					borderRadius: "12px",
					width: "100%",
				}}
			>
				<Box
					sx={{
						display: "flex",
						margin: "auto",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h6"
						fontWeight="bold"
						sx={{ marginBottom: 1 }}
					>
						{column.alias}
					</Typography>
					<Typography
						variant="subtitle2"
						fontWeight="bold"
						sx={{ marginBottom: 1 }}
					>
						{`(${items.length})`}
					</Typography>
				</Box>
				<Box sx={{ color: "#ffffff" }}>
					<IconButton color={"inherit"} onClick={handleCreateTicket}>
						<AddIcon color={"inherit"} />
					</IconButton>
				</Box>
			</Box>

			<Box
				ref={setNodeRef}
				sx={{
					background: column.backgroundColor,
					borderRadius: 2,
					flex: 1,
					padding: 2,
					display: "flex",
					gap: 1,
					flexDirection: "column",
				}}
			>
				{items.map(({ title: cardTitle, id }, key) => (
					<KanbanCard
						id={id}
						title={cardTitle}
						key={key}
						index={key}
						parent={column.alias}
					/>
				))}
			</Box>
		</Box>
	)
}
