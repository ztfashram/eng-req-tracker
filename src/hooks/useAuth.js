import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isEngineer = false
    let isAdmin = false
    let status = 'Sales'

    if (token) {
        const decoded = jwtDecode(token)
        const { userId, username, roles } = decoded.UserInfo

        isEngineer = roles.includes('Engineer')
        isAdmin = roles.includes('Admin')

        if (isEngineer) status = 'Engineer'
        if (isAdmin) status = 'Admin'

        return { userId, username, roles, isEngineer, isAdmin, status }
    }
    return { userId: '', username: '', roles: [], isEngineer, isAdmin, status }
}

export default useAuth
