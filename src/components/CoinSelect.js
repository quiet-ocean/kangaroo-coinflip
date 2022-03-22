import React, { useState, useEffect } from 'react';
import { Row, Col, Stack, Image, Button } from "react-bootstrap";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import'../styles/coin_select.scss';
import TailsCoin from "../assets/tails-logo.png";
import HeadsCoin from "../assets/heads-logo.png";

import { FLIP_NONE, FLIP_GOING, FLIP_WON, FLIP_LOST, HEAD, TAIL } from '../constants';

const CoinSelect = (props) => {

  const [flipValue, setFlipValue] = useState(0.1);
  const { choice, setChoice, value, setValue, flip } = props;
  useEffect(() => {
  }, [choice])

  return (
    <div className="coin_select block">
      <Image src={HeadsCoin} style={{display: `${choice ? 'block' : 'none'}`}} width={438} height={438} className="coin_select_img"/>
      <Image src={TailsCoin} style={{display: `${!choice ? 'block' : 'none'}`}} className="coin_select_img"/>
      <Stack direction="horizontal" style={{justifyContent: "center"}} gap={3}>
        <button
        className={`btn ${choice === HEAD ? 'btn-dark-bg' : 'btn-transparent'}`}
        onClick={() => setChoice(HEAD)}
        >
          <span className="bold-font">Heads</span>
        </button>
        <button
        className={`btn ${choice === HEAD ? 'btn-transparent' : 'btn-dark-bg'}`}
        onClick={() => setChoice(TAIL)}
        >
          <span className="bold-font">Tails</span>
        </button>
      </Stack>
      <Stack direction="horizontal" className="coin_select_slider_bar">
        <div>
          <span>0.1 Ⓝ</span>
        </div>
        <div className="coin_select_slider">
          <Slider
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);
          }}
          min={0}
          max={5}
          defaultValue={0.1}
          step={0.01}
          />
        </div>
        <div>
          <span>5 Ⓝ</span>
        </div>
      </Stack>
      <button className="btn full-width btn-dark-bg coin_select_flip_btn bold-font">
        <span className="bold-font" onClick={flip}>Flip {value} Ⓝ</span>
      </button>
    </div>
  );
};

export default CoinSelect;