import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import KanbanLane from "../KanbanLane"
import { TicketStatus } from "../../types/VerticalKanbanBoard.types"
import { addNewTicket } from "../../features/kanban/ticketSlice"
import { useCreateTicketMutation } from "../../api/tickets.grapql"

jest.mock("../../api/tickets.grapql", () => ({
	useCreateTicketMutation: jest.fn(),
}))

jest.mock("../KanbanCard", () => () => <div data-testid="kanban-card" />)

const mockStore = configureStore([])
const mockCreateTicket = jest.fn(() => ({
	unwrap: jest.fn().mockResolvedValue({
		createTicket: { id: "new-ticket-id", title: "Double Click To Edit" },
	}),
}))

;(useCreateTicketMutation as jest.Mock).mockReturnValue([mockCreateTicket])

const mockColumn = {
	alias: TicketStatus.TO_DO,
	title: "To Do",
	headerColor: "#3498db",
	backgroundColor: "#ecf0f1",
	cardColor: "#ffffff",
}

const mockItems = [
	{ id: "1", title: "First Task", isNew: false },
	{ id: "2", title: "Second Task", isNew: false },
]

describe("KanbanLane Component", () => {
	let store

	beforeEach(() => {
		jest.clearAllMocks()
		store = mockStore({ tickets: [] })
	})

	const renderComponent = (props = {}) =>
		render(
			<Provider store={store}>
				<KanbanLane column={mockColumn} items={mockItems} {...props} />
			</Provider>
		)

	it("renders the KanbanLane correctly", () => {
		const { container } = renderComponent()
		expect(container).toMatchSnapshot()
	})

	it("renders the column title and item count", () => {
		renderComponent()

		expect(screen.getByText("To Do")).toBeInTheDocument()
		expect(screen.getByText("(2)")).toBeInTheDocument()
	})

	it("renders the correct number of KanbanCards", () => {
		renderComponent()

		const kanbanCards = screen.getAllByTestId("kanban-card")
		expect(kanbanCards).toHaveLength(mockItems.length)
	})

	it("dispatches addNewTicket when a new ticket is created", async () => {
		renderComponent()

		const user = userEvent.setup()
		const addButton = screen.getByTestId(`add-card-${mockColumn.alias}`)

		await user.click(addButton)

		expect(mockCreateTicket).toHaveBeenCalledWith({
			title: "Double Click To Edit",
			status: TicketStatus.TO_DO,
		})

		const actions = store.getActions()
		expect(actions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: addNewTicket.type,
					payload: {
						id: "new-ticket-id",
						title: "Double Click To Edit",
						isNew: true,
					},
				}),
			])
		)
	})
})
