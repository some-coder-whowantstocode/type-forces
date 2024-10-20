import { createSlice } from '@reduxjs/toolkit'


export interface authsliceval{

}

const initialState : authsliceval = {
    
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signup(){

        }
    }
})

export const { signup } = authSlice.actions
export default authSlice
