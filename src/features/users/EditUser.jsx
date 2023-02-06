import { useParams } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import { CircularProgress } from '@mui/material'

const EditUser = () => {
    const { id } = useParams()
    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id],
        }),
    })

    return user ? <EditUserForm user={user} /> : <CircularProgress />
}

export default EditUser
