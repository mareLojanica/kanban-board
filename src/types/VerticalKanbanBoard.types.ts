export enum TicketStatus {
	TO_DO = "TO_DO",
	IN_PROGRESS = "IN_PROGRESS",
	DONE = "DONE",
}
export interface KanbanCardProps {
	id: string
	title: string
	index: number
	parent: string
	isNew?: boolean
	cardColor: string
}
export interface ColumnConfig {
	alias: TicketStatus
	headerColor: string
	backgroundColor: string
	cardColor: string
	title: string
}

export interface KanbanLaneProps {
	column: ColumnConfig
	items: {
		title: string
		id: string
		isNew?: boolean
	}[]
}
