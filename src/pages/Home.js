import React from 'react';
import "../styles/global.scss";
import CoinSelect from '../components/CoinSelect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Flip from '../components/Flip';
import RecentFlips from '../components/RecentFlips';

import { Row, Col, ThemeProvider } from 'react-bootstrap';

const Home = () => {
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
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Home;