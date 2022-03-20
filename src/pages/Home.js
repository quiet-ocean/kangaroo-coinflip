import React, { useState, useEffect } from 'react';
import CoinSelect from '../components/CoinSelect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CoinFlipping from '../components/CoinFlipping';
import RecentFlips from '../components/RecentFlips';
import Flipping from '../assets/kangaflip.gif';

import { Row, Col, Stack, Image, ThemeProvider } from 'react-bootstrap';
const HOME = 1;
const FLIPPING = 2;
const WON = 3;
const LOST = 4;
const Home = () => {
  const [status, setStatus] = useState(HOME);

  useEffect(() => {
    setStatus(FLIPPING);
  }, []);

  return (
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    >
      <div className="home">
        <Row>
          <Header />
        </Row>    
        <Row className={`home_block home_start ${status === HOME ? "home_active" : ''}`}>
          <Col md={12}>
            <CoinSelect />
          </Col>        
        </Row>
        <Row className={`home_block ${status != HOME ? "home_active" : ''}`} >
          <Col>
            <Stack className={``}>
              <Image src={Flipping} width={472} />
              <p className="bold-font">Flipping 0.1 Ⓝ</p>
              <p className="">You Choose Heads</p>
              <div className='home_btn_group'>

              </div>
            </Stack>
          </Col>
        </Row>
        <Row className = "mt-5"style={{display: `${status===HOME ? 'block' : 'none'}`}}>
          <RecentFlips/>
        </Row>
        <Footer />
      </div>
      {/* <div className="background" /> */}
    </ThemeProvider>
  );
};

export default Home;