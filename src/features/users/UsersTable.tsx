import { useGetUsersQuery } from "./userSlice"

const UsersTable = () => {
	const { data, error, isLoading } = useGetUsersQuery()
	console.log(data)
	if (isLoading) return <p>Loading...</p>
	if (error) return <p>Error</p>
	return (
		<div>
			<h1>User List</h1>
			<ul>
				{data.getUsers.map(
					(user: { id: string; name: string; email: string }) => (
						<li key={user.id}>
							{user.name} ({user.email})
						</li>
					)
				)}
			</ul>
		</div>
	)
}

export default UsersTable
