import React, { useState, useRef } from "react";
import "styles/home.css";
import { item } from "assets/jsons/mockup-movie";
import video from "assets/video/jurasic world.webm";
import profileImage from "assets/images/user.jpg";
import Mjson from "assets/jsons/movie.json";
import Layout from "components/mainLayout";

const Home = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isFocused, setIsFocused] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Adjust scroll amount as needed
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filterMjson = (data, searchQuery) => {
    return data.filter(
      (item) =>
        (searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.date.includes(searchQuery)  
          : true)
    );
  };

  const filterMjsonPopular = (data,selectedType)=>{
    return data.filter(
      (item)=>
      (selectedType !== "All" ? item.type.toLowerCase() === selectedType.toLowerCase() : true)
    )
  }

  const handleTypeClick = (type) => {
    setSelectedType(type);
  };
  return (
    <Layout>
      <video src={video} autoPlay muted loop></video>
      <nav>
        <div className="logo-ui">
          <h1 className="logo">LOGO</h1>
          <ul>
            <li>
              <a onClick={() => handleTypeClick("All")}>Home</a>
            </li>
            <li>
              <a onClick={() => handleTypeClick("series")}>Series</a>
            </li>
            <li>
              <a onClick={() => handleTypeClick("MOVIE")}>Movies</a>
            </li>
            <li>
              <a>All</a>
            </li>
          </ul>
        </div>
        <div className="search-user">
          <input
            type="text"
            placeholder="Search..."
            id="search"
            value={searchQuery}  // Bind search input to state
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <img src={profileImage} alt="" />
          <div className="search">
          {filterMjson(Mjson, searchQuery).map((e, index) => {
              return(
                <a className="card" key={index} style={{ display: isFocused ? 'flex' : 'none' }}>
              <img src={require(`../assets/images/${e.sposter}`)} alt="" />
              <div className="cont">
                <h3>{e.name}</h3>
                <p>
                  {e.type}, {e.date}, <span>IMDB</span>
                  <i className="bi bi-star-fill"></i> {e.imdb}
                </p>
              </div>
            </a>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="content">
        <h1 id="title">Money Heist</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          perferendis temporibus nisi nesciunt excepturi laboriosam praesentium
          quas, rerum adipisci dicta ab dolorem! Itaque, corporis fugit!
        </p>
        <div className="details">
          <h6>A Netfix Origin Film</h6>
          <h5 id="gen">Thiller</h5>
          <h4>2025</h4>
          <h3 id="rate">
            <span>IMDB</span>
            <i className="bi bi-star-fill"></i> 9.6
          </h3>
        </div>
        <div className="btns">
          <a href="#" id="paly">
            Watch <i class="bi bi-play-fill"></i>{" "}
            <i class="bi bi-badge-hd-fill top-right"></i>
          </a>
        </div>
      </div>
      <section>
        <h4>Popular</h4>
        <i
          class="bi bi-chevron-compact-left"
          onClick={() => scroll("left")}
        ></i>
        <i
          class="bi bi-chevron-compact-right"
          onClick={() => scroll("right")}
        ></i>
        <div className="cards" ref={scrollRef}>
          {filterMjsonPopular(Mjson,selectedType).map((e, index) => {
            return (
              <a key={index} className="card">
                <img src={require(`../assets/images/${e.sposter}`)} alt="" className="poster" />
                <div className="rest-card">
                  <img src={require(`../assets/images/${e.bposter}`)} alt="" />
                  <div className="cont">
                    <h4>{e.name}</h4>
                    <div className="sub">
                      <p>
                        {e.genre}, {e.date}
                      </p>
                      <h3>
                        <span>IMDB</span>
                        <i className="bi bi-star-fill"></i> {e.imdb}
                      </h3>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};
export default Home;
