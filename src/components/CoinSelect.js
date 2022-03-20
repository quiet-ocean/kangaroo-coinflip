import React, { useState, useEffect } from 'react';
import { Row, Col, Stack, Image, Button } from "react-bootstrap";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import'../styles/coin_select.scss';
import Coin from "../assets/tails-logo.png";

const CoinSelect = () => {
  const [flipValue, setFlipValue] = useState(0.1);
  return (
    <div className="coin_select">
      <Image src={Coin} className="coin_select_img"/>
      <Stack direction="horizontal" style={{justifyContent: "center"}} gap={3}>
        <button className="coin_select_btn_head">
          <span className="bold-btn-string">Heads</span>
        </button>
        <button className="coin_select_btn_tails">
          <span className="bold-btn-string">Tails</span>
        </button>
      </Stack>
      <Stack direction="horizontal" className="coin_select_slider_bar">
        <div>
          <span>0.1 Ⓝ</span>
        </div>
        <div className="coin_select_slider">
          <Slider
          value={flipValue}
          onChange={(nextValue) => {
            setFlipValue(nextValue);
          }}
          min={0}
          max={2}
          defaultValue={0.81}
          step={0.01}
          />
        </div>
        <div>
          <span>2 Ⓝ</span>
        </div>
      </Stack>
      <button className="coin_select_flip_btn coin_select_btn_tails bold-btn-string">
        <span className="bold-btn-string">Flip {flipValue} Ⓝ</span>
      </button>
    </div>
  );
};

export default CoinSelect;