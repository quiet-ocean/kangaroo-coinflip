import React, { useState, useEffect } from 'react';
import CoinSelect from '../components/CoinSelect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Flip from '../components/Flip';
import RecentFlips from '../components/RecentFlips';

import { Row, Col, ThemeProvider } from 'react-bootstrap';
const HOME = 1;
const FLIPPING = 2;
const WON = 3;
const LOST = 4;
const Home = () => {
  const [status, setStatus] = useState(HOME);

  return (
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    >
      <div className="main">
        <Row>
          <Header />
        </Row>    
        <Row>
          <Col md={12}>
            <CoinSelect />
            <RecentFlips />
          </Col>        
        </Row>
        <Row className="flipping">

        </Row>
        <Row className="won">

        </Row>
        <Row className="lost">

        </Row>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Home;