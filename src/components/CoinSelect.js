import React, { useState, useEffect } from 'react';
import { Row, Col, Stack, Image, Button } from "react-bootstrap";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import'../styles/coin_select.scss';
import Coin from "../assets/tails-logo.png";

const CoinSelect = () => {
  const [flipValue, setFlipValue] = useState(0.1);
  return (
    <div className="coin_select block">
      <Image src={Coin} className="coin_select_img"/>
      <Stack direction="horizontal" style={{justifyContent: "center"}} gap={3}>
        <button className="btn-transparent">
          <span className="bold-font">Heads</span>
        </button>
        <button className="btn-dark-bg">
          <span className="bold-font">Tails</span>
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
      <button className="btn-dark-bg coin_select_flip_btn bold-font">
        <span className="bold-font">Flip {flipValue} Ⓝ</span>
      </button>
    </div>
  );
};

export default CoinSelect;