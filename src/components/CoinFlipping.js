import React from 'react';
import { Row, Col, Image, Stack } from 'react-bootstrap';
import Flipping from '../assets/kangaflip.gif';
const CoinFlipping = () => {
  return (
    <div className="block">
      <Stack>
        <Image src={Flipping} width={472} />
        <p className="bold-font">Flipping 0.1 Ⓝ</p>
        <p className="">You Choose Heads</p>
      </Stack>
    </div>
  )
};

export default CoinFlipping;