import { CircularProgress } from '@mui/material'
import NewRequestForm from './NewRequestForm'
import { useGetUsersQuery } from '../users/usersApiSlice'

const NewRequest = () => {
    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.reduce((list, id) => {
                const user = data?.entities[id]
                if (user.roles.includes('Engineer')) list.push(user)
                return list
            }, []),
        }),
    })
    return users ? <NewRequestForm users={users} /> : <CircularProgress />
}

export default NewRequest
