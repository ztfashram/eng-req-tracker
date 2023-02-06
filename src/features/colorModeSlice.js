import { createSlice } from '@reduxjs/toolkit'

const initialState = { mode: 'dark' }

export const colorModeSlice = createSlice({
    name: 'colorMode',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
    },
})

export const { setMode } = colorModeSlice.actions

export default colorModeSlice.reducer
