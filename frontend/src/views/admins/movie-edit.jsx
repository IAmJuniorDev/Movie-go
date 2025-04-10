import React, { useState } from "react";
import { Text1, Text2, Text3, Text4 } from "../../components/admins/textService";
import { publicRequest } from "../../axiosCall.js";
import TableLayout from "../../components/admins/adminLayout.jsx";

const MovieEdit = () => {
  const [id, setId] = useState("");
  const [vImage, setVImage] = useState(null);
  const [hImage, setHImage] = useState(null);

  const handleVImageChange = (e) => {
    setVImage(e.target.files[0]);
  };

  const handleHImageChange = (e) => {
    setHImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !vImage || !hImage) {
      alert("Please provide all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("image_v", vImage);
    formData.append("image_h", hImage);

    try {
      const res = await publicRequest.put(`/movies/addpic/${id}`, formData);

      if (res.status === 200) {
        alert("Update successful!");
      } else {
        alert("Error occurred while updating.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Error during upload.");
    }
  };

  const headers = ["ID", "ImdbID", "TitleEn", "TitleTh", "Year", "Rating", "Type"];
  const data = [
    {
      id: 1,
      imdbid: "tt1234567",
      titleen: "The Boys",
      titleth: "เดอะ บอยส์",
      year: 2022,
      rating: 9.3,
      genre: "Action",
      type: "series",
    },
    {
      id: 2,
      imdbid: "tt9876543",
      titleen: "Stranger Things",
      titleth: "สเตรนเจอร์ ธิงส์",
      year: 2023,
      rating: 8.9,
      genre: "Sci-Fi",
      type: "series",
    }
  ];

  return (
    <TableLayout headers={headers} data={data} onAction={handleSubmit} />
  );
};

export default MovieEdit;
