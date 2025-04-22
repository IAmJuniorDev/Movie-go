import { createSlice } from '@reduxjs/toolkit'

export const movieImageReducer = createSlice({
  name: 'movieImage',
  initialState: [],
  reducers: {
    setMovieImage: (state, action) => {
      const newMovie = {
        id: action.payload.imdb_id,
        image_v: action.payload.image_v,
        image_h: action.payload.image_h,
      };
      const index = state.findIndex(item => item.id === newMovie.id);
      if (index !== -1) {
        state[index] = newMovie;
      } else {
        state.push(newMovie);
      }
    },
  },
})

export const { setMovieImage } = movieImageReducer.actions

export default movieImageReducer.reducer;
