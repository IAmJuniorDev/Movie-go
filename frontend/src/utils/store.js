import { configureStore } from '@reduxjs/toolkit'
import userReducer  from './userReducer'

export default configureStore({
  reducer: {
    user: userReducer,
  },
  // devTools: process.env.NODE_ENV !== "production",
})