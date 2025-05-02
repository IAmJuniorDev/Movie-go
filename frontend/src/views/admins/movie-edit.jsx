import React, { useEffect, useState, useCallback } from "react";
import { userRequest } from "utils/axiosCall.js";
import TableLayout from "components/admins/tableLayout.jsx";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  setMovieAdmin,
  updateMovieAdmin,
} from "libs/redux/movieAdminReducer.js";
import {
  Box,
  Modal,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Text } from "libs/text";
import AddIcon from "@mui/icons-material/Add";
import { MuiFileInput } from "mui-file-input";

const MovieEdit = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const movieAdmin = useSelector((state) => state.movieAdmin);

  const [headers, setHeaders] = useState([]);
  const [edit, setEdit] = useState(false);
  const [newMovie, setNewMovie] = useState(false);
  const [yearError, setYearError] = useState(false);
  const [editForm, setEditForm] = useState({
    imdb_id: "",
    title_en: "",
    title_th: "",
    year: null,
    rating: null,
    movie_type: "",
    main_genre: "",
  });
  const [newMovieForm, setNewMovieForm] = useState({
    imdb_id: "",
    title_en: "",
    title_th: "",
    year: null,
    rating: null,
    movie_type: "",
    main_genre: "",
    is_superhero: false,
    is_fiction: false,
    is_action: false,
    is_animated: false,
    is_thriller: false,
    is_drama: false,
    is_comedy: false,
    is_horror: false,
    is_mystery: false,
    is_crime: false,
    is_adventure: false,
    is_war: false,
    is_romance: false,
    is_fantasy: false,
    is_family: false,
    is_history: false,
    is_biography: false,
    is_documentary: false,
    is_western: false,
    is_sport: false,
    is_musical: false,
    video: "",
    image_h: "",
    image_v: "",
  });

  const openEdit = (e) => {
    setEdit(!edit);
    if (editForm.imdb_id === null || editForm.imdb_id === "") {
      setEditForm({
        imdb_id: e.id,
        title_en: e.title_en,
        title_th: e.title_th,
        year: e.year,
        rating: e.rating,
        movie_type: e.movie_type,
        main_genre: e.main_genre,
      });
    }
  };

  const onDelete = (e) => {
    console.log(`delete ${e}`);
  };

  const onImageEdit = (e) => {
    console.log(`delete ${e}`);
  };

  const onNewMovie = () => {
    setNewMovie(!newMovie);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewMovieChange = (e) => {
    const { name, value } = e.target;
    setNewMovieForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateUniqueMovieId = useCallback(() => {
    const existingIds = new Set(movieAdmin.map((movie) => movie.id));
    let newId;
    do {
      const randomNum = Math.floor(Math.random() * 10000000);
      const padded = String(randomNum).padStart(7, "0");
      newId = `tt${padded}`;
    } while (existingIds.has(newId));
    return newId;
  }, [movieAdmin]);

  const handleSubmitEditMovie = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const res = await userRequest.put(
        `/movies/${editForm.imdb_id}`,
        editForm
      );
      if (res.status === 200) {
        dispatch(updateMovieAdmin(res.data));
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `The data have been changed!!!`,
          timer: 2000,
          showConfirmButton: false,
        });
        setEdit(false);
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
  };

  const convertFileToBlob = (file,name)=>{
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovieForm((prevState) => ({
          ...prevState,
          [name]: reader.result, 
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmitNewMovie = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      convertFileToBlob(newMovieForm.image_h,"image_h");
      console.log(newMovieForm.image_h);
      return;
      const res = await userRequest.post(`/movies/admin`, newMovieForm);
      if (res.status === 200) {
        dispatch(updateMovieAdmin(res.data));
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `The data have been changed!!!`,
          timer: 2000,
          showConfirmButton: false,
        });
        setEdit(false);
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
  };

  const genreKeys = Object.keys(newMovieForm).filter((key) =>
    key.startsWith("is_")
  );

  const allChecked = genreKeys.every((key) => newMovieForm[key]);
  const someChecked = genreKeys.some((key) => newMovieForm[key]);

  const toggleAllGenres = (checked) => {
    const updated = {};
    genreKeys.forEach((key) => {
      updated[key] = checked;
    });
    setNewMovieForm((prev) => ({ ...prev, ...updated }));
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

  useEffect(() => {
    if (newMovie) {
      const newId = generateUniqueMovieId();
      setNewMovieForm((prev) => ({
        ...prev,
        imdb_id: newId,
      }));
    }
  }, [newMovie, generateUniqueMovieId]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", md: "-webkit-fill-available" },
    bgcolor: "background.paper",
    borderRadius: { xs: "8px", md: "16px" },
    boxShadow: 24,
    p: { xs: 2, md: 4 },
  };

  return (
    <Box width={1440}>
      <Box
        component="div"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          margin: "0 0 16px 0",
        }}
      >
        <Button
          variant="contained"
          sx={{
            margin: "0 10px",
            alignItems: "center",
            justifyItems: "center",
          }}
          onClick={() => {
            onNewMovie();
          }}
        >
          <AddIcon />
          {"New Movie"}
        </Button>
      </Box>
      {movieAdmin && movieAdmin.length > 0 ? (
        <TableLayout
          headers={headers}
          data={movieAdmin}
          onEdit={openEdit}
          onDelete={onDelete}
          onImageEdit={onImageEdit}
        />
      ) : null}
      <Modal
        open={edit}
        onClose={openEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          zIndex: 999,
        }}
      >
        <Box sx={style}>
          <Text
            variant="h4"
            id="modal-modal-title"
            sx={{
              marginBottom: "16px",
            }}
          >
            Edit Movie
          </Text>
          <Box
            component="form"
            onSubmit={handleSubmitEditMovie}
            sx={{
              display: "flex",
              flexDirection: "column",
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
                marginBottom: "16px",
              }}
            >
              <TextField
                name="id"
                label="IMDB ID"
                value={editForm.imdb_id}
                onChange={handleEditChange}
                disabled
              />
              <TextField
                required
                name="title_en"
                label="Title (eng)"
                value={editForm.title_en}
                onChange={handleEditChange}
              />
              <TextField
                required
                name="title_th"
                label="Title (th)"
                value={editForm.title_th}
                onChange={handleEditChange}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="year"
                  label="Year *"
                  views={["year"]}
                  inputFormat="YYYY"
                  value={editForm.year ? dayjs().year(editForm.year) : null}
                  onChange={(newValue) => {
                    const yearValue = newValue ? newValue.year() : null;
                    setEditForm((prev) => ({
                      ...prev,
                      year: yearValue,
                    }));
                    setYearError(!yearValue); // sets error state if year is null
                  }}
                  slotProps={{
                    textField: {
                      error: yearError,
                      helperText: yearError ? "Year is required" : "",
                    },
                  }}
                />
              </LocalizationProvider>

              <TextField
                required
                name="rating"
                label="Rating"
                value={editForm.rating === null ? "" : editForm.rating}
                onChange={handleEditChange}
              />
              <TextField
                required
                name="movie_type"
                label="Movie Type"
                value={editForm.movie_type}
                onChange={handleEditChange}
              />
              <TextField
                required
                name="main_genre"
                label="Main Genre"
                value={editForm.main_genre}
                onChange={handleEditChange}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "fit-content",
                alignSelf: "end",
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={newMovie}
        onClose={onNewMovie}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          zIndex: 999,
        }}
      >
        <Box sx={style}>
          <Text
            variant="h4"
            id="modal-modal-title"
            sx={{
              marginBottom: "16px",
            }}
          >
            New Movie
          </Text>
          <Box
            component="form"
            onSubmit={handleSubmitNewMovie}
            sx={{
              display: "flex",
              flexDirection: "column",
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
                marginBottom: "16px",
              }}
            >
              <TextField
                name="id"
                label="IMDB ID"
                value={newMovieForm.imdb_id}
                onChange={handleNewMovieChange}
                disabled
              />
              <TextField
                required
                name="title_en"
                label="Title (eng)"
                value={newMovieForm.title_en}
                onChange={handleNewMovieChange}
              />
              <TextField
                required
                name="title_th"
                label="Title (th)"
                value={newMovieForm.title_th}
                onChange={handleNewMovieChange}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="year"
                  label="Year *"
                  views={["year"]}
                  inputFormat="YYYY"
                  value={
                    newMovieForm.year ? dayjs().year(newMovieForm.year) : null
                  }
                  onChange={(newValue) => {
                    const yearValue = newValue ? newValue.year() : null;
                    setNewMovieForm((prev) => ({
                      ...prev,
                      year: yearValue,
                    }));
                    setYearError(!yearValue); // sets error state if year is null
                  }}
                  slotProps={{
                    textField: {
                      error: yearError,
                      helperText: yearError ? "Year is required" : "",
                    },
                  }}
                />
              </LocalizationProvider>
              <TextField
                required
                name="rating"
                label="Rating"
                type="number"
                value={newMovieForm.rating === null ? "" : newMovieForm.rating}
                onChange={handleNewMovieChange}
              />
              <TextField
                required
                name="movie_type"
                label="Movie Type"
                value={newMovieForm.movie_type}
                onChange={handleNewMovieChange}
              />
              <TextField
                required
                name="main_genre"
                label="Main Genre"
                value={newMovieForm.main_genre}
                onChange={handleNewMovieChange}
              />
              <TextField
                required
                name="video"
                label="Video link"
                value={newMovieForm.video}
                onChange={handleNewMovieChange}
              />
              <MuiFileInput
                required
                label="Image Horizontle"
                value={newMovieForm.image_h}
                onChange={(file) =>
                  setNewMovieForm((prev) => ({
                    ...prev,
                    image_h: file,
                  }))
                }
              />
              <MuiFileInput
                required
                label="Image Verticle"
                value={newMovieForm.image_v}
                onChange={(file) =>
                  setNewMovieForm((prev) => ({
                    ...prev,
                    image_v: file,
                  }))
                }
              />
            </Box>
            <Text variant="subtitle1">Movie-type</Text>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allChecked}
                    indeterminate={!allChecked && someChecked}
                    onChange={(e) => toggleAllGenres(e.target.checked)}
                  />
                }
                label="Select All type"
                sx={{
                  display: "block",
                  width: "fit-content",
                  margin: "0 0 0 15px",
                }}
              />
              {genreKeys.map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      name={key}
                      checked={newMovieForm[key]}
                      onChange={handleNewMovieChange}
                    />
                  }
                  label={key
                    .replace("is_", "")
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                />
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "fit-content",
                alignSelf: "end",
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieEdit;
