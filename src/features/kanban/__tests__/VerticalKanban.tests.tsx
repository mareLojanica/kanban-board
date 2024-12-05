import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import VerticalKanban from "../VerticalKanban"
import { setSearchText, setTickets } from "../ticketSlice"
import {
	useGetTicketsQuery,
	useUpdateTicketMutation,
} from "../../../api/tickets.grapql"
import { TicketStatus } from "../../../types/VerticalKanbanBoard.types"
import { act } from "react"

jest.mock("../../../api/tickets.grapql", () => ({
	useUpdateTicketMutation: jest.fn(),
}))

const mockStore = configureStore([])

jest.mock("../../../components/Spinner", () => () => (
	<div data-testid="spinner" />
))

jest.mock("../../../api/tickets.grapql", () => ({
	useGetTicketsQuery: jest.fn(),
	useUpdateTicketMutation: jest.fn(),
}))

jest.mock("../../../components/KanbanLane", () => ({ column, items }: any) => (
	<div data-testid={`kanban-lane-${column.alias}`}>
		{items.map((item: any) => (
			<div key={item.id} data-testid={`kanban-card-${item.id}`} />
		))}
	</div>
))

jest.mock("../../../utils", () => ({
	...jest.requireActual("../../../utils"),
	debounce: (fn: any) => fn,
}))
const mockGetTicketsQuery = jest.fn(() => ({
	isLoading: false,
	data: [
		{ id: "1", title: "Ticket 1", status: "TO_DO" },
		{ id: "2", title: "Ticket 2", status: "IN_PROGRESS" },
		{ id: "3", title: "Ticket 3", status: "DONE" },
	],
}))
jest.mock("../../../utils", () => ({
	...jest.requireActual("../../../utils"),
	debounce: (fn: any) => fn,
}))

const mockUpdateTicket = jest.fn(() => ({
	unwrap: jest.fn().mockResolvedValue({}),
}))

;(useGetTicketsQuery as jest.Mock).mockImplementation(mockGetTicketsQuery)
;(useUpdateTicketMutation as jest.Mock).mockReturnValue([mockUpdateTicket])

describe("VerticalKanban Component", () => {
	let store

	beforeEach(() => {
		jest.clearAllMocks()
		store = mockStore({
			tickets: {
				tickets: [
					{ id: "1", title: "Ticket 1", status: TicketStatus.TO_DO },
					{
						id: "2",
						title: "Ticket 2",
						status: TicketStatus.IN_PROGRESS,
					},
					{ id: "3", title: "Ticket 3", status: TicketStatus.DONE },
				],
				searchText: "",
			},
		})
	})

	const renderComponent = () =>
		render(
			<Provider store={store}>
				<VerticalKanban />
			</Provider>
		)
	it("renders the VerticalKanban correctly", () => {
		const { container } = renderComponent()
		expect(container).toMatchSnapshot()
	})

	it("filters tickets based on search input", async () => {
		renderComponent()

		const searchInput = screen.getByPlaceholderText("Search tickets...")
		const user = userEvent.setup()

		await user.type(searchInput, "Ticket 1")

		const actions = store.getActions()
		const action = actions.reduce(
			(acc, curr: { type: string; payload: string }) => {
				acc.payload += curr.payload
				acc.type = curr.type
				return acc
			},
			{ payload: "", type: "" }
		)

		expect(action).toEqual(setSearchText("Ticket 1"))
	})

	// it("dispatches setTickets on drag-and-drop", () => {
	// 	renderComponent()

	// 	const kanbanCard = screen.getByTestId("kanban-card-1")
	// 	const targetLane = screen.getByTestId("kanban-lane-IN_PROGRESS")
	// 	const mockEvent = {
	// 		active: { id: "1" },
	// 		over: { id: "IN_PROGRESS" },
	// 	}
	// 	fireEvent.touchStart(kanbanCard)
	// 	fireEvent.dragEnd(kanbanCard, mockEvent)
	// 	fireEvent.touchEnd(kanbanCard)
	// 	const actions = store.getActions()
	// 	expect(actions).toContainEqual(
	// 		setTickets([
	// 			{ id: "1", title: "Ticket 1", status: "IN_PROGRESS" },
	// 			{ id: "2", title: "Ticket 2", status: "IN_PROGRESS" },
	// 			{ id: "3", title: "Ticket 3", status: "DONE" },
	// 		])
	// 	)
	// })
})
