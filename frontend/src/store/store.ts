import { configureStore } from '@reduxjs/toolkit'
import pdfGeneratorReducer from './pdfGeneratorSlice'

export const store = configureStore({
  reducer: {
    pdfGenerator: pdfGeneratorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
