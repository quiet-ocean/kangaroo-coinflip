import React, { useState, useEffect } from "react";
import RealTimeIcon from "../../assets/img/realtime.png";

export default function FlipData() {



    
  const baseURL =
  "https://indexer.havendao.community/api/coinflip-house.near?api_key=f743dcb217d1d615dd1bf652&limit=7";

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch('https://randomuser.me/api/')
      .then(results => results.json())
      .then(data => {
        setUser(data.results[0]);
        console.log(user, "testing")
      });
  }, []); // Pass empty array to only run once on mount.


  return (
    <div className="row justify-content-center mt-5">
    <div className="col justify-content-center mt-4 recent-flips-card">
      <h1 class="recent-flips">Recent Flips</h1>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          testing flipped <span className="near-amount">0.5 Ⓝ</span> and
          lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          swiftyyy.near flipped{" "}
          <span className="near-amount">0.5 Ⓝ</span> and lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          swiftyyy.near flipped{" "}
          <span className="near-amount">0.5 Ⓝ</span> and lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          swiftyyy.near flipped{" "}
          <span className="near-amount">0.5 Ⓝ</span> and lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          swiftyyy.near flipped{" "}
          <span className="near-amount">0.5 Ⓝ</span> and lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          swiftyyy.near flipped{" "}
          <span className="near-amount">0.5 Ⓝ</span> and lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
      <div className="row justify-content-center mt-4">
        <img class="realtime-image" src={RealTimeIcon} />
        <p class="realtime-info">
          swiftyyy.near flipped{" "}
          <span className="near-amount">0.5 Ⓝ</span> and lost
        </p>
        <span class="realtime-info">1m</span>
      </div>
    </div>
  </div>
  )
}
