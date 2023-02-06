import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, api) => {
        const accessToken = api.getState().auth.token

        if (accessToken) {
            headers.set('authorization', `Bearer ${accessToken}`)
        }
        return headers
    },
})

const customBaseQuery = async (args, api, extraOptions) => {
    // console.log('args: ', args);
    // console.log(api)
    // console.log(extraOptions)

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }))

            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired'
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: 'api', //default, optional
    baseQuery: customBaseQuery,
    tagTypes: ['Request', 'User'],
    endpoints: (builder) => ({}),
})
