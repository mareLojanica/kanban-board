import { render, fireEvent, screen } from "@testing-library/react"

import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"

import {
	useDeleteTicketMutation,
	useUpdateTicketMutation,
} from "../../api/tickets.grapql"
import KanbanCard from "../KanbanCard"

jest.mock("../../api/tickets.grapql", () => ({
	useDeleteTicketMutation: jest.fn(),
	useUpdateTicketMutation: jest.fn(),
}))

const mockDeleteTicket = jest.fn()
const mockUpdateTicket = jest.fn()

;(useDeleteTicketMutation as jest.Mock).mockReturnValue([mockDeleteTicket])
;(useUpdateTicketMutation as jest.Mock).mockReturnValue([mockUpdateTicket])

const mockStore = configureStore([])

describe("KanbanCard Component", () => {
	let store: ReturnType<typeof mockStore>

	beforeEach(() => {
		jest.clearAllMocks()
		store = mockStore({
			tickets: {},
		})
	})

	const renderComponent = (props = {}) =>
		render(
			<Provider store={store}>
				<KanbanCard
					id="1"
					title="Test Ticket"
					index={0}
					parent="todo"
					cardColor="#fff"
					{...props}
				/>
			</Provider>
		)

	it("renders the card with the correct title", () => {
		renderComponent()
		expect(screen.getByText("Test Ticket")).toBeInTheDocument()
	})

	it("allows editing the title", async () => {
		const { container } = renderComponent()

		const user = userEvent.setup()
		const titleElement = screen.getByText("Test Ticket")

		fireEvent.doubleClick(titleElement)

		const input = container.querySelector("#edit-input-id")
		expect(input).toBeInTheDocument()

		await user.type(input, "Updated")

		fireEvent.blur(input)

		expect(mockUpdateTicket).toHaveBeenCalledWith({
			id: "1",
			title: "Updated",
		})
	})

	it("triggers delete action when delete button is clicked", async () => {
		renderComponent()

		const user = userEvent.setup()
		const deleteButton = screen.getByRole("button")

		await user.click(deleteButton)

		expect(mockDeleteTicket).toHaveBeenCalledWith({ id: "1" })
	})

	it("applies drag styles correctly when dragging", () => {
		renderComponent()
		const cardElement = screen.getByText("Test Ticket").closest("div")
		expect(cardElement).toHaveStyle("cursor: grab")
	})
})
