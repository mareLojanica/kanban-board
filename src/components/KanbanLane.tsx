import { FC, useCallback } from "react"
import { Box, IconButton, Typography } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useDispatch } from "react-redux"
import { useDroppable } from "@dnd-kit/core"

import { useCreateTicketMutation } from "../api/tickets.grapql"
import { addNewTicket } from "../features/kanban/ticketSlice"
import KanbanCard from "./KanbanCard"

import {
	KanbanLaneProps,
	TicketStatus,
} from "../types/VerticalKanbanBoard.types"

const KanbanLane: FC<KanbanLaneProps> = ({ column, items }) => {
	const { setNodeRef } = useDroppable({
		id: column.alias,
	})
	const dispatch = useDispatch()
	const [createTicket] = useCreateTicketMutation()

	const handleCreateTicket = useCallback(async () => {
		try {
			const statusValue =
				TicketStatus[
					column.alias as unknown as keyof typeof TicketStatus
				]

			const newTicket = await createTicket({
				title: "Double Click To Edit",
				status: statusValue,
			}).unwrap()

			dispatch(addNewTicket({ ...newTicket.createTicket, isNew: true }))
		} catch (error) {}
	}, [column.alias, dispatch, addNewTicket])

	return (
		<Box
			sx={{
				flex: 3,
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "100%",
			}}
		>
			<Box
				sx={{
					background: column.headerColor,
					color: "#ffffff",
					padding: {
						xs: 1,
						md: 2,
					},
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
				}}
			>
				<Box
					sx={{
						display: "flex",
						margin: "auto",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "90px",
					}}
				>
					<Typography
						variant="h6"
						fontWeight="bold"
						sx={{
							fontSize: {
								xs: 16,
								md: 24,
							},
						}}
					>
						{column.title}
					</Typography>
					<Typography variant="subtitle2" fontWeight="bold">
						{`(${items.length})`}
					</Typography>
				</Box>
				<Box
					sx={{
						color: "#ffffff",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}
				>
					<IconButton color={"inherit"} onClick={handleCreateTicket}>
						<AddIcon color={"inherit"} />
					</IconButton>
				</Box>
			</Box>

			<Box
				ref={setNodeRef}
				sx={{
					background: column.backgroundColor,
					flex: 1,
					px: {
						xs: 2,
						md: 14,
					},
					py: 4,
					display: "flex",
					gap: 1,
					flexDirection: "column",
				}}
			>
				{items.map(({ title: cardTitle, id, isNew }, key) => (
					<KanbanCard
						id={id}
						title={cardTitle}
						key={key}
						index={key}
						parent={column.alias}
						isNew={!!isNew}
						cardColor={column.cardColor}
					/>
				))}
			</Box>
		</Box>
	)
}
export default KanbanLane
