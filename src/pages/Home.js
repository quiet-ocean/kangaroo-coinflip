import React from 'react';
import CoinSelect from '../components/CoinSelect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Flip from '../components/Flip';
import RecentFlips from '../components/RecentFlips';
const Home = () => {
  return (
    <>
      <>HOME</>
      <Header />
      <div>
        <CoinSelect />
        <Flip />
        <RecentFlips />
      </div>
      <Footer />
    </>
  );
};

export default Home;