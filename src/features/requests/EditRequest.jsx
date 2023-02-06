import { useParams } from 'react-router-dom'
import EditRequestForm from './EditRequestForm'
import { CircularProgress } from '@mui/material'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetRequestsQuery } from './requestsApiSlice'

const EditRequest = () => {
    const { id } = useParams()

    // const request = useSelector((state) => selectRequestById(state, id))
    const { request } = useGetRequestsQuery('requestsList', {
        selectFromResult: ({ data }) => ({
            request: data?.entities[id],
        }),
    })

    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.reduce((list, id) => {
                const user = data?.entities[id]
                if (user.roles.includes('Engineer')) list.push(user)
                return list
            }, []),
        }),
    })

    return request && users ? <EditRequestForm users={users} request={request} /> : <CircularProgress />
}

export default EditRequest
