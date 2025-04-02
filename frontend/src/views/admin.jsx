import React, { useState } from "react";
import "../styles/admin.css";
import { publicRequest } from "../axiosCall.js";

const Admin = () => {
  const [id, setId] = useState("");
  const [vImage, setVImage] = useState("");
  const [hImage, setHImage] = useState("");

  const handleVImageChange = (e) => {
    setVImage(e.target.files[0]); // Store the file object
  };

  const handleHImageChange = (e) => {
    setHImage(e.target.files[0]); // Store the file object
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
  return (
    <div className="admin-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="imdbID"
          onChange={(e) => setId(e.target.value)}
          value={id}
        />
        <p>Vertical Image</p>
        <input type="file" onChange={handleVImageChange} />
        <p>Horizontal Image</p>
        <input type="file" onChange={handleHImageChange} />
        <button type="submit">update</button>
      </form>
      <hr />
      <hr />
    </div>
  );
};

export default Admin;
