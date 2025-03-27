import React from "react";
import "../styles/package.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Package = () => {
  const navigate = useNavigate();

  var items = [
    {
      title: "Free-tiar",
      available: ["360p", "480p", "720p"],
      price: "Free",
      life_time: "7",
    },
    {
      title: "Short",
      available: ["360p", "480p", "720p", "1080p", "1440p", "2160p"],
      price: 3.55,
      life_time: "90",
    },
    {
      title: "Normal",
      available: ["360p", "480p", "720p", "1080p", "1440p", "2160p"],
      price: 6.55,
      life_time: "180",
    },
    {
      title: "Long-term",
      available: ["360p", "480p", "720p", "1080p", "1440p", "2160p"],
      price: 10.0,
      life_time: "360",
    },
  ];
  return (
    <div className="package-container">
      <div className="another-container">
        <div className="item-container">
          {items.map((e) => {
            var time = parseInt(e.life_time);
            var day = time >= 30 ? "month" : "days";
            if (time >= 30) {
              time /= 30;
            }
            return (
              <div className="background-container">
                <div className="content-container">
                  <h3>{e.title}</h3>
                  <p className="inline-block">Included :</p>
                  {e.available.map((ee, i) => {
                    var item = i < e.available.length - 1 ? "," : null;
                    return (
                      <p key={i} className="inline-block">
                        {ee}
                        {item}
                      </p>
                    );
                  })}
                  <p>
                    Price : {e.price}
                    {e.price !== "Free" ? " $" : ""}
                  </p>
                  <p>
                    Life time : {time} {day}
                  </p>
                  <Button
                    onClick={() => {
                      navigate("/registor", {
                        state: {
                          data: {
                            title: e.title,
                            lifeTime: e.life_time,
                          },
                        },
                      });
                    }}
                    color="cyan"
                    variant="solid"
                  >
                    Register
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Package;
