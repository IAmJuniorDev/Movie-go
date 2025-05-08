import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userReducer';
import movieAdminReducer from './movieAdminReducer';
import movieImageReducer from './movieImageReducer';



export default configureStore({
  reducer: {
    user: userReducer,
    movieAdmin: movieAdminReducer,
    movieImage: movieImageReducer
  },
  // devTools: process.env.NODE_ENV !== "production",
})