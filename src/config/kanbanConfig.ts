import { TicketStatus } from "../types/VerticalKanbanBoard.types"

export const columnsConfig = [
	{
		alias: TicketStatus.TO_DO,
		headerColor: "#1791D7",
		backgroundColor: "#BEE1F5",
		cardColor: "#54AFE0",
		title: "To Do",
	},
	{
		alias: TicketStatus.IN_PROGRESS,
		headerColor: "#E12755",
		backgroundColor: "#F4BEC3",
		cardColor: "#E66878",
		title: "In Progress",
	},
	{
		alias: TicketStatus.DONE,
		headerColor: "#0F233C",
		backgroundColor: "#B9C3C7",
		cardColor: "#4B5E73",
		title: "Done",
	},
]
