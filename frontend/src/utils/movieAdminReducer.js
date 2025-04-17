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
    
  },
})

export const { setMovieAdmin } = movieAdminReducer.actions

export default movieAdminReducer.reducer