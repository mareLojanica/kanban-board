import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Box, Typography, IconButton, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import {
	useDeleteTicketMutation,
	useUpdateTicketMutation,
} from "../api/tickets.grapql"
import { useDispatch } from "react-redux"
import {
	deleteSelectedTicket,
	updateTicketById,
} from "../features/kanban/ticketSlice"

const KanbanCard = ({
	id,
	title,
	index,
	parent,
}: {
	id: string
	title: string
	index: number
	parent: string
}) => {
	const dispatch = useDispatch()
	const [deleteTicket] = useDeleteTicketMutation()
	const [updateTicket] = useUpdateTicketMutation()
	const [isEditing, setIsEditing] = useState(false)
	const [editedTitle, setEditedTitle] = useState(title)

	const onDelete = async () => {
		try {
			await deleteTicket({ id }).unwrap()
			dispatch(deleteSelectedTicket(id))
		} catch (error) {
			console.error("Error deleting ticket:", error)
		}
	}

	const handleTitleEdit = async () => {
		setIsEditing(false)
		const dataToUpdate = {
			id,
			title: editedTitle,
		}
		await updateTicket(dataToUpdate).unwrap()
		dispatch(updateTicketById(dataToUpdate))
	}

	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
			data: {
				id,
				title,
				index,
				parent,
			},
		})

	return (
		<Box
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: 2,
				backgroundColor: "white",
				marginBottom: 2,
				borderRadius: 2,
				border: "2px solid",
				borderColor: isDragging ? "blue" : "grey.500",
				boxShadow: "0px 0px 5px 2px #2121213b",
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : 1,
				cursor: "grab",
				zIndex: 100,
				"&:hover": {
					boxShadow: "0px 0px 8px 4px rgba(0, 0, 0, 0.2)",
					"& .iconButton": {
						opacity: 1,
						transform: "scale(1.1)",
					},
				},
			}}
			onDoubleClick={() => setIsEditing(true)}
		>
			{isEditing ? (
				<TextField
					value={editedTitle}
					onChange={(e) => setEditedTitle(e.target.value)}
					onBlur={handleTitleEdit}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleTitleEdit()
						if (e.key === "Escape") setIsEditing(false)
					}}
					autoFocus
					sx={{ flexGrow: 1, marginRight: 2 }}
				/>
			) : (
				<Typography variant="body1" sx={{ cursor: "text" }}>
					{title}
				</Typography>
			)}
			<IconButton
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onDelete()
				}}
				className="iconButton"
				sx={{
					pointerEvents: "all",
					backgroundColor: "white",
					p: 2,
					opacity: 0,
					"&:hover": {
						backgroundColor: "grey.200",
						opacity: 1,
					},
				}}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Box>
	)
}

export default KanbanCard
