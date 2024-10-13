import { configureStore } from '@reduxjs/toolkit'
import pageSlice from './features/pageSlice'

export const makeStore = () => {
  return configureStore({
    reducer:{
        page:pageSlice.reducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']