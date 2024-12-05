import { render, fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import { act } from "react"

import {
	useDeleteTicketMutation,
	useUpdateTicketMutation,
} from "../../api/tickets.grapql"
import KanbanCard from "../KanbanCard"

jest.mock("../../api/tickets.grapql", () => ({
	useDeleteTicketMutation: jest.fn(),
	useUpdateTicketMutation: jest.fn(),
}))

const mockStore = configureStore([])

describe("KanbanCard Component", () => {
	let store
	const mockDeleteTicket = jest.fn(() => ({
		unwrap: jest.fn().mockResolvedValue({}),
	}))
	const mockUpdateTicket = jest.fn(() => ({
		unwrap: jest.fn().mockResolvedValue({}),
	}))

	;(useDeleteTicketMutation as jest.Mock).mockReturnValue([mockDeleteTicket])
	;(useUpdateTicketMutation as jest.Mock).mockReturnValue([mockUpdateTicket])

	beforeEach(() => {
		jest.clearAllMocks()
		store = mockStore({ tickets: {} })
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

	it("renders the KanbanCard correctly", () => {
		const { container } = renderComponent()
		expect(container).toMatchSnapshot()
	})

	it("allows editing the title", async () => {
		const { container } = renderComponent()
		const user = userEvent.setup()

		const titleElement = screen.getByText("Test Ticket")
		fireEvent.doubleClick(titleElement)

		const input = container.querySelector("#edit-input-id")
		expect(input).toBeInTheDocument()

		await user.clear(input)
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
		const deleteButton = screen.getByTestId("delete-ticket")

		await user.click(deleteButton)

		expect(mockDeleteTicket).toHaveBeenCalledWith({ id: "1" })
	})

	it("applies drag styles correctly when dragging", () => {
		renderComponent()
		const cardElement = screen.getByText("Test Ticket").closest("div")
		expect(cardElement).toHaveStyle("cursor: grab")
	})
})

describe("KanbanCard Component - Redux Integration", () => {
	let store
	const mockDeleteTicket = jest.fn(() => ({
		unwrap: jest.fn().mockResolvedValue({}),
	}))
	const mockUpdateTicket = jest.fn(() => ({
		unwrap: jest.fn().mockResolvedValue({}),
	}))

	beforeEach(() => {
		jest.clearAllMocks()
		store = mockStore({ tickets: {} })
		;(useDeleteTicketMutation as jest.Mock).mockReturnValue([
			mockDeleteTicket,
		])
		;(useUpdateTicketMutation as jest.Mock).mockReturnValue([
			mockUpdateTicket,
		])
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

	it("dispatches deleteSelectedTicket when delete button is clicked", async () => {
		renderComponent()

		const user = userEvent.setup()
		const deleteButton = screen.getByTestId("delete-ticket")

		await user.click(deleteButton)

		expect(mockDeleteTicket).toHaveBeenCalledWith({ id: "1" })

		const actions = store.getActions()
		expect(actions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: "tickets/deleteSelectedTicket",
					payload: "1",
				}),
			])
		)
	})

	it("dispatches updateTicketById when title is edited", async () => {
		const { container } = renderComponent()
		const user = userEvent.setup()

		const titleElement = screen.getByText("Test Ticket")
		await act(async () => {
			fireEvent.doubleClick(titleElement)
		})

		const input = container.querySelector(
			"#edit-input-id"
		) as HTMLInputElement
		expect(input).toBeInTheDocument()

		await user.clear(input)
		await user.type(input, "Updated")

		await act(async () => {
			input.blur()
		})

		const actions = store.getActions()

		expect(mockUpdateTicket).toHaveBeenCalledWith({
			id: "1",
			title: "Updated",
		})

		expect(actions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: "tickets/updateTicketById",
					payload: { id: "1", title: "Updated" },
				}),
			])
		)
	})
})
