import { configureStore } from '@reduxjs/toolkit'
import userReducer  from './userReducer'
import movieAdminReducer  from './movieAdminReducer'

export default configureStore({
  reducer: {
    user: userReducer,
    movieAdmin: movieAdminReducer,
  },
  // devTools: process.env.NODE_ENV !== "production",
})