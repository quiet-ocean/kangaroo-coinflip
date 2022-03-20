import React from 'react';
import { Image, Stack } from 'react-bootstrap';
import KangarooLogo from '../assets/kangaroo-logo.png';

const Header = () => {
  return (
    <div className='header'>
      <div className='header-background'></div>
      <Stack direction='horizontal' gap={3}>
        <Image src={KangarooLogo} />
        <div style={{}}></div>
        <Stack direction="horizontal" className="pull-right" gap={2}>
          <a href="/#">About</a>
          <a href="/#">How To Play</a>
          <a href="/#">FAQ</a>
        </Stack>
        <a href="/#" className="bold-btn-string">Connect Wallet</a>
      </Stack>      
    </div>
  );
};

export default Header;