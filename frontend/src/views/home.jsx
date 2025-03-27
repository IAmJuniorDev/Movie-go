import React, { useState } from "react";
import "../styles/home.css";
import { item } from "../assets/jsons/mockup-movie";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Select, Space } from "antd";
import Layout from "./mainLayout";
import video from "../assets/video/background.mp4";
import profileImage from "../assets/images/boss.jpg";
import Theboy from "../assets/images/movie-TheBoy.jpg";


const Home = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const items = item;
  const movieTypes = {};
  const years = {};
  items.forEach((movie) => {
    Object.keys(movie).forEach((key) => {
      if (
        key.startsWith("is_") &&
        typeof movie[key] === "boolean" &&
        movie[key] === true
      ) {
        const type = key
          .replace("is_", "")
          .replace(/([A-Z])/g, " $1")
          .trim();
        movieTypes[type] = (movieTypes[type] || 0) + 1;
      }
    });
    const year = movie.year;
    years[year] = (years[year] || 0) + 1;
  });
  const movieTypesArray = Object.entries(movieTypes).map(([type, count]) => ({
    type,
    count,
  }));
  const yearArray = Object.entries(years).map(([year, count]) => ({
    year,
    count,
  }));
  const filteredMovies = items.filter((movie) => {
    const matchesYear = selectedYear
      ? movie.year === parseInt(selectedYear)
      : true;
    const matchesType = selectedType
      ? Object.keys(movie).some(
          (key) =>
            key.startsWith("is_") &&
            movie[key] === true &&
            key.includes(selectedType)
        )
      : true;
    return matchesYear && matchesType;
  });
  return (
    <div className="home-container">
      <video src={video} autoPlay muted loop></video>
      <nav>
        <div className="logo-ui">
          <h1 className="logo">LOGO</h1>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Series</a>
            </li>
            <li>
              <a href="#">Movies</a>
            </li>
            <li>
              <a href="#">Kids</a>
            </li>
          </ul>
        </div>
        <div className="search-user">
          <input type="text" placeholder="Search..." id="search" />
          <img src={profileImage} alt="" />
          <div className="search">
            <a className="card">
              <img src={Theboy} alt="" />
              <div className="cont">
                <h3>The Boys</h3>
                <p>Action, 2024, <span>IMDB</span><i className="bi bi-star-fill"></i> 9.6</p>
              </div>
            </a>
          </div>
        </div>
      </nav>
      <div className="content">
        <h1 id="title">Money Heist</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam perferendis temporibus nisi nesciunt excepturi laboriosam praesentium quas, rerum adipisci dicta ab dolorem! Itaque, corporis fugit!</p>
        <div className="details">
          <h6>A Netfix Origin Film</h6>
          <h5 id="gen">Thiller</h5>
          <h4>2025</h4>
          <h3 id="rate"><span>IMDB</span><i className="bi bi-star-fill"></i> 9.6</h3>
        </div>
        <div className="btns">
          <a href="#" id="paly">Watch <i class="bi bi-play-fill"></i> <i class="bi bi-badge-hd-fill top-right"></i></a>
        </div>
      </div>
    </div>
  );
};
export default Home;
