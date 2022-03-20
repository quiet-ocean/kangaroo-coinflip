import React from 'react';
import { Stack, Image } from "react-bootstrap";
import Paras from '../assets/paras.png';
import Twitter from '../assets/twitter.png';
import Discord from '../assets/discord.svg';

const Footer = () => {
  return (
    <div className="footer">
      <Stack className="footer_content" gap={1}>
        <Stack direction="horizontal" className="pull-right" gap={3}>
          <a href="/#">About</a>
          <a href="/#">How To Play</a>
          <a href="/#">FAQ</a>
        </Stack>
        <Stack direction="horizontal" gap={3}>
          <Image src={Paras} />          
          <Image src={Twitter} />          
          <Image src={Discord} />          
        </Stack>
      </Stack>
    </div>
  );
};

export default Footer;