import { configureStore } from '@reduxjs/toolkit'
import pageSlice from './features/pageSlice'
import authSlice from './features/authSlice'

export const makeStore = () => {
  return configureStore({
    reducer:{
        page:pageSlice.reducer,
        auth:authSlice.reducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']