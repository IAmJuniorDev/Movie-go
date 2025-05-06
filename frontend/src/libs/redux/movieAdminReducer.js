import { createSlice } from '@reduxjs/toolkit'

export const movieAdminReducer = createSlice({
  name: 'movieAdmin',
  initialState: {
    id:"",
    title_en:"",
    title_th:"",
    year:0,
    rating:0.0,
    main_genre:"",
    movie_type:"",
    video:""
  },
  reducers: {
    setMovieAdmin: (state,action) => {
      const formattedData = action.payload.map(({ imdb_id, ...rest }) => ({
        id: imdb_id,
        ...rest
      }));
      return formattedData;
    },
    updateMovieAdmin: (state, action) => {
      const { imdb_id, ...rest } = action.payload;
      const updatedMovie = {
        id: imdb_id,
        ...rest
      };
      const index = state.findIndex(movie => movie.id === updatedMovie.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...updatedMovie };
      }else {
        state.push(updatedMovie); 
      }
    },
    deleteMovieAdmin: (state, action) => {
      return state.filter(movie => movie.id !== action.payload);
    },
  },
})

export const { setMovieAdmin,updateMovieAdmin,deleteMovieAdmin } = movieAdminReducer.actions

export default movieAdminReducer.reducer