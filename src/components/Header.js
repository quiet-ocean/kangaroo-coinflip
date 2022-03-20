import React from 'react';
import '../styles/header.scss';
import { Image, Stack } from 'react-bootstrap';
import KangarooLogo from '../assets/kangaroo-logo.png';

const Header = () => {
  return (
    <div className='header'>
      <div className='header_background'></div>
      <Stack direction='horizontal' className="header_navbar" gap={3}>
        <Image src={KangarooLogo} /><div></div>
        <Stack direction="horizontal" className="pull-right" gap={2}>
          <a href="/#">About</a>
          <a href="/#">How To Play</a>
          <a href="/#">FAQ</a>
          <a href="/#" className="bold-font header_connect_btn">Connect Wallet</a>
        </Stack>
      </Stack>      
    </div>
  );
};

export default Header;