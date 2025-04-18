import React, { useEffect, useState, useCallback } from "react";
import { userRequest } from "../../axiosCall.js";
import TableLayout from "../../components/admins/adminLayout.jsx";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setMovieAdmin } from "../../utils/movieAdminReducer.js";
import {
  Box,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { Text1, Text2, Text4 } from "../../components/admins/textService.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {xs:"90%",md:"-webkit-fill-available"},
  bgcolor: "background.paper",
  borderRadius: {xs:"8px",md:"16px"},
  boxShadow: 24,
  p: {xs:2,md:4},
};

const MovieEdit = () => {
  const dispatch = useDispatch();
  const movieAdmin = useSelector((state) => state.movieAdmin);
  const [headers, setHeaders] = useState([]);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title_en: "",
    title_th: "",
    year: null,
    rating: null,
    movie_type: "",
    main_genre: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const openEdit = (e) => {
    setEdit(!edit);
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
    if (
      !movieAdmin ||
      movieAdmin.length === 0 ||
      Object.keys(movieAdmin[0] || {}).length === 0
    ) {
      getMovie();
    } else {
      setHeaders(Object.keys(movieAdmin[0] || {}));
    }
  }, [movieAdmin, getMovie]);

  return (
    <Box width={1440}>
      {movieAdmin && movieAdmin.length > 0 ? (
        <TableLayout headers={headers} data={movieAdmin} onAction={openEdit} />
      ) : null}
      <Modal
        open={edit}
        onClose={openEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Text2
            id="modal-modal-title"
            sx={{
              marginBottom: "10px",
            }}
          >
            Edit Movie
          </Text2>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display:"flex",
              flexDirection:"column",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "flex", lg: "grid" },
                gridTemplateColumns: { lg: "1fr 1fr" },
                flexDirection: { xs: "column", md: "column" },
                gap: { xs: 1, sm: 2 },
                width: "100%",
                marginBottom:"16px"
              }}
            >
              <TextField
                name="id"
                label="IMDB ID"
                value={formData.id}
                onChange={handleChange}
              />
              <TextField
                name="title_en"
                label="Title (eng)"
                value={formData.title_en}
                onChange={handleChange}
              />
              <TextField
                name="title_th"
                label="Title (th)"
                value={formData.title_th}
                onChange={handleChange}
              />
              <TextField
                name="year"
                label="Year"
                value={formData.year}
                onChange={handleChange}
              />
              <TextField
                name="rating"
                label="Rating"
                value={formData.rating}
                onChange={handleChange}
              />
              <TextField
                name="movie_type"
                label="Movie Type"
                value={formData.movie_type}
                onChange={handleChange}
              />
              <TextField
                name="main_genre"
                label="Main Genre"
                value={formData.main_genre}
                onChange={handleChange}
              />
            </Box>
            <Button type="submit" variant="contained" sx={{
              width:"fit-content",
              alignSelf:"end",
            }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieEdit;
