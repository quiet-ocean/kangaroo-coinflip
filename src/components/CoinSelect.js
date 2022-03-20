import React, { useState, useEffect } from 'react';
import { Row, Col, Stack, Image, Button } from "react-bootstrap";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Coin from "../assets/tails-logo.png";

const CoinSelect = () => {
  const [flipValue, setFlipValue] = useState(0);
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
      <Row className="coin_select_slider_bar">
        <Col>
          <span>0.1 Ⓝ</span>
        </Col>
        <Col>
          <Slider
          min={0}
          max={1}
          defaultValue={0.81}
          step={0.01}
          />
        </Col>
        <Col>
          <span>2 Ⓝ</span>
        </Col>
      </Row>
      <button className="coin_select_flip_btn coin_select_btn_tails bold-btn-string">
        <span className="bold-btn-string">Flip {flipValue}</span>
      </button>
    </div>
  );
};

export default CoinSelect;