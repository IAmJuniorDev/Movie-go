import React, { useEffect, useState, useCallback } from "react";
import { userRequest } from "../../axiosCall.js";
import TableLayout from "../../components/admins/adminLayout.jsx";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setMovieAdmin } from "../../utils/movieAdminReducer.js";
import { Box } from "@mui/material";

const MovieEdit = () => {
  const dispatch = useDispatch();
  const movieAdmin = useSelector((state) => state.movieAdmin);
  const [headers, setHeaders] = useState([]);

  const handleSubmit = async (e) => {
    console.log(e);
  };

  const getMovie = useCallback(async () => {
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const res = await userRequest.get("/movies/admin");
      if (res.status === 200) {
        dispatch(setMovieAdmin(res.data));
        setHeaders(Object.keys(res.data[0] || {}));
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `The data from movie is already retrieved`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${err}`,
        timer: 2000,
        showConfirmButton: false,
      });
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    // If movieAdmin is undefined, empty, or contains empty objects, fetch.
    if (!movieAdmin || movieAdmin.length === 0 || Object.keys(movieAdmin[0] || {}).length === 0) {
      getMovie();
    } else {
      setHeaders(Object.keys(movieAdmin[0] || {}));
    }
  }, [movieAdmin, getMovie]);

  return (
    <Box width={1440}>
      {movieAdmin && movieAdmin.length > 0 ? (
        <TableLayout
          headers={headers}
          data={movieAdmin}
          onAction={handleSubmit}
        />
      ) : null}
    </Box>
  );
};

export default MovieEdit;
