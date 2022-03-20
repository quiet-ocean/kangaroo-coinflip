import React, { useState, useEffect } from 'react';
import { Row, Col, Stack, Image, Button } from "react-bootstrap";
import Coin from "../assets/tails-logo.png";

const CoinSelect = () => {
  const [flipValue, setFlipValue] = useState(0);
  return (
    <Stack className="coin_select">
      <Image src={Coin} className="coin_select_img"/>
      <Stack direction="horizontal" style={{justifyContent: "center"}} gap={2}>
        <button className="coin_select_btn_head">
          <span className="bold-btn-string">Heads</span>
        </button>
        <button className="coin_select_btn_tails">
          <span className="bold-btn-string">Tails</span>
        </button>
      </Stack>
      <div className="coin_select_scroll_bar">
        scroll bar
      </div>
      <button className="coin_select_flip_btn coin_select_btn_tails bold-btn-string">
        <span className="bold-btn-string">Flip {flipValue}</span>
      </button>
    </Stack>
  );
};

export default CoinSelect;