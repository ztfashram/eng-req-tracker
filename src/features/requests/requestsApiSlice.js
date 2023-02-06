import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const requestsAdapter = createEntityAdapter({
    // it only works on the Adapter provided selectors like requestsAdapter.selectAll.
    // In this app I provided sorted requests in RequestsList.jsx
    sortComparer: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1),
})

const initialState = requestsAdapter.getInitialState()

export const requestsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRequests: builder.query({
            query: () => ({
                url: '/requests',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: (responseData) => {
                const loadedRequests = responseData.map((request) => {
                    request.id = request._id
                    return request
                })
                return requestsAdapter.setAll(initialState, loadedRequests)
            },
            providesTags: (result, error, arg) =>
                result?.ids
                    ? [
                          { type: 'Request', id: 'LIST' },
                          ...result.ids.map((id) => ({
                              type: 'Request',
                              id,
                          })),
                      ]
                    : [{ type: 'Request', id: 'LIST' }],
        }),
        addNewRequest: builder.mutation({
            query: (initialRequest) => ({
                url: '/requests',
                method: 'POST',
                body: { ...initialRequest },
            }),
            invalidatesTags: [{ type: 'Request', id: 'LIST' }],
        }),
        updateRequest: builder.mutation({
            query: (initialRequest) => ({
                url: '/requests',
                method: 'PATCH',
                body: { ...initialRequest },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Request', id: arg.id }],
        }),
        deleteRequest: builder.mutation({
            query: ({ id }) => ({
                url: '/requests',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Request', id: arg.id }],
        }),
    }),
})

export const { useGetRequestsQuery, useAddNewRequestMutation, useUpdateRequestMutation, useDeleteRequestMutation } =
    requestsApiSlice

// returns the query result object
export const selectRequestsResult = requestsApiSlice.endpoints.getRequests.select()

// creates memoized selector
const selectRequestsData = createSelector(
    selectRequestsResult,
    (requestsResult) => requestsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllRequests,
    selectById: selectRequestById,
    selectIds: selectRequestIds,
    // Pass in a selector that returns the requests slice of state
} = requestsAdapter.getSelectors((state) => selectRequestsData(state) ?? initialState)
