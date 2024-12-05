import { CSS, Transform } from "@dnd-kit/utilities"
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
	deleteSelectedTicket,
	updateTicketById,
} from "../features/kanban/ticketSlice"
import { KanbanCardProps } from "../types/VerticalKanbanBoard.types"
import {
	useDeleteTicketMutation,
	useUpdateTicketMutation,
} from "../api/tickets.grapql"
import { styled } from "@mui/system"

const StyledCard = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== "transform" &&
		prop !== "isDragging" &&
		prop !== "isMobileOrTablet" &&
		prop !== "cardColor",
})<{
	transform: Transform
	isMobileOrTablet: boolean
	isDragging: boolean
	cardColor: string
}>(({ theme, transform, isMobileOrTablet, isDragging, cardColor }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: theme.spacing(2),
	backgroundColor: cardColor,
	marginBottom: theme.spacing(2),
	transform: CSS.Translate.toString(transform),
	opacity: isDragging ? 0.5 : 1,
	cursor: "grab",
	zIndex: 100,
	height: "80px",
	boxShadow: isMobileOrTablet ? "0px 0px 8px 4px rgba(0, 0, 0, 0.2)" : "none",
	"&:hover .iconButton": {
		display: "block",
		transform: "scale(1.1)",
	},
}))

const KanbanCard = ({
	id,
	title = "New Ticket",
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
			data: { id, title, index, parent },
		})

	const handleDelete = useCallback(async () => {
		try {
			await deleteTicket({ id }).unwrap()
			dispatch(deleteSelectedTicket(id))
		} catch (error) {
			console.error("Error deleting ticket:", error)
		}
	}, [id, deleteTicket, dispatch])

	const handleTitleEdit = useCallback(async () => {
		if (editedTitle.trim() === title) return
		setIsEditing(false)
		const updatedTicket = { id, title: editedTitle }

		try {
			await updateTicket(updatedTicket).unwrap()
			dispatch(updateTicketById(updatedTicket))
		} catch (error) {
			console.error("Error updating ticket:", error)
		}
	}, [id, editedTitle, title, updateTicket, dispatch])

	const handleInputKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") handleTitleEdit()
			if (e.key === "Escape") setIsEditing(false)
		},
		[handleTitleEdit]
	)

	return (
		<StyledCard
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			cardColor={cardColor}
			transform={transform}
			isDragging={!!isDragging}
			isMobileOrTablet={isMobileOrTablet}
			onDoubleClick={() => setIsEditing(true)}
			data-testid={`kanban-card-${id}`}
		>
			{isEditing ? (
				<TextField
					value={editedTitle}
					onChange={(e) => setEditedTitle(e.target.value)}
					onBlur={handleTitleEdit}
					onKeyDown={handleInputKeyDown}
					id="edit-input-id"
					autoFocus
					variant="standard"
					fullWidth
					sx={{
						flexGrow: 1,
						marginRight: 2,
						input: { color: "#fff" },
					}}
				/>
			) : (
				<Typography
					variant="body1"
					sx={{ cursor: "text", color: "#fff", flexGrow: 1 }}
				>
					{editedTitle}
				</Typography>
			)}

			<IconButton
				onClick={(e) => {
					e.stopPropagation()
					handleDelete()
				}}
				data-testid="delete-ticket"
				className="iconButton"
				sx={{
					p: 2,
					display: isMobileOrTablet ? "block" : "none",
					color: "#fff",
				}}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</StyledCard>
	)
}

export default KanbanCard
