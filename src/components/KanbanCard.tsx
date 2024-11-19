import { CSS } from "@dnd-kit/utilities"
import { useDraggable } from "@dnd-kit/core"
import { useDispatch } from "react-redux"
import { useCallback, useState } from "react"
import {
	Box,
	IconButton,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

import {
	useDeleteTicketMutation,
	useUpdateTicketMutation,
} from "../api/tickets.grapql"
import {
	deleteSelectedTicket,
	updateTicketById,
} from "../features/kanban/ticketSlice"
import { KanbanCardProps } from "../types/VerticalKanbanBoard.types"

const KanbanCard = ({
	id,
	title,
	index,
	parent,
	isNew = false,
	cardColor,
}: KanbanCardProps) => {
	const dispatch = useDispatch()
	const [deleteTicket] = useDeleteTicketMutation()
	const [updateTicket] = useUpdateTicketMutation()
	const [isEditing, setIsEditing] = useState(isNew)
	const [editedTitle, setEditedTitle] = useState(isNew ? "" : title)
	const theme = useTheme()
	const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"))
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

	const onDelete = useCallback(async () => {
		try {
			await deleteTicket({ id }).unwrap()
			dispatch(deleteSelectedTicket(id))
		} catch (error) {
			console.error("Error deleting ticket:", error)
		}
	}, [deleteTicket, dispatch, deleteSelectedTicket, id])

	const handleTitleEdit = useCallback(async () => {
		setIsEditing(false)
		const dataToUpdate = {
			id,
			title: editedTitle,
		}
		await updateTicket(dataToUpdate).unwrap()
		dispatch(updateTicketById(dataToUpdate))
	}, [setIsEditing, updateTicket, dispatch, updateTicketById])

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
				backgroundColor: cardColor,
				marginBottom: 2,
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : 1,
				cursor: "grab",
				zIndex: 100,
				height: "80px",
				boxShadow: isMobileOrTablet
					? "0px 0px 8px 4px rgba(0, 0, 0, 0.2)"
					: "none",
				"&:hover": {
					"& .iconButton": {
						display: "block",
						pointerEvents: "all",
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
					inputProps={{ id: "edit-input-id" }}
					autoFocus
					variant="standard"
					sx={{
						flexGrow: 1,
						marginRight: 2,
						border: "none",
						width: "80%",
						input: {
							color: "#ffffff",
							width: "inherit",
						},
					}}
				/>
			) : (
				<Typography
					variant="body1"
					sx={{ cursor: "text" }}
					color="#ffffff"
				>
					{title}
				</Typography>
			)}

			<Box>
				<IconButton
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
						onDelete()
					}}
					className="iconButton"
					sx={{
						p: 2,
						display: isMobileOrTablet ? "block" : "none",
						pointerEvents: isMobileOrTablet ? "all" : "none",
						color: "#ffffff",
					}}
				>
					<CloseIcon fontSize="small" color="inherit" />
				</IconButton>
			</Box>
		</Box>
	)
}

export default KanbanCard
