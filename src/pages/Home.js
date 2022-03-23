import { utils as nearUtils } from "near-api-js";
import regeneratorRuntime from "regenerator-runtime";

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CoinSelect from '../components/CoinSelect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecentFlips from '../components/RecentFlips';
import FlipBoard from '../components/FlipBoard';
import CModal from '../components/CModal';
import PopupModal from '../components/PopupModal';
import Spinner from '../components/Spinner';
import About from '../components/About';
import Faq from '../components/Faq';
import HowTo from '../components/HowTo';

import { Row, Col, Stack, Image, ThemeProvider, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

import { initContract } from '../utils.js';
import { FLIP_GOING, FLIP_WON, FLIP_LOST, FLIP_NONE, FLIP_DOUBLE, HEAD, TAIL } from '../constants';
import reactDom from "react-dom";

const Home = () => {

  const [status, setStatus] = useState(FLIP_NONE);
  const [choice, setChoice] = useState(HEAD);
  // const [result, setResult] = useState(FLIP_NONE);
  const [value, setValue] = useState(0.1);
  const [txHistory, setTxHistory] = useState([]);
  const [limit, setLimit] = useState(10);
  const [showDeposit, setshowDeposit] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errTitle, setErrTitle] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [balance, setBalance] = useState(null);

  const [shows, setShows] = useState({about: false, faq: false, howTo: false, login: false, funding: false});


  useEffect(async () => {
    // setStatus(FLIPPING);
    setLoading(true);
    await initContract();
    // await loadTxHistory();
    
    let newBalance = await window.contract.get_credits({ account_id: window.accountId }).catch(err=>{
      console.log(err)
    });
    setBalance(newBalance)
    loadTxHistory();
    setLoading(false);
  }, []);

  const nearConversion = (amount) => {
    if (amount == null) {
      return null;
    } else if (amount.length > 24) {
      return amount.slice(0, amount.length - 24) + "." + amount.slice(amount.length - 24, (amount.length - 24) + 2);
    } else {
      return "0." + amount.slice(0, 3);
    }
  }

  const yoctoConversion = (amount) => {
    if (amount.toString().includes(".")) {
      return amount.toString().split(".")[0] + amount.toString().split(".")[1] + "000000000000000000000000".slice(amount.toString().split(".")[1].length)
    } else {
      return amount.toString() + "000000000000000000000000"
    }
  }

  const deposit = async (nearAmount) => {
    if (window.accountId == null || typeof window.accountId === 'undefined' || accountId == '') {
      showPopupModal("You need to login", "To access this functionality you should log in first. Just click on the connect wallet button on the top of the page");
      return
    }
    setLoading(true);
    await window.contract.deposit(
      {},
      '300000000000000',
      yoctoConversion(nearAmount)
    )
    .then(async res =>{
      let newBalance = await window.contract.get_credits({ account_id: window.accountId }).catch(err=>{
        console.log(err)
      });
      setBalance(newBalance);
      setLoading(false);
    })
    .catch(err=>{
      console.log(err);
      setLoading(false);
      showPopupModal('deposit failed', JSON.stringify(err));
    })
  };

  const withdrawal = async () => {
    if (window.accountId == null || typeof window.accountId === 'undefined' || accountId == '') {
      showPopupModal("You need to login", "To access this functionality you should log in first. Just click on the connect wallet button on the top of the page");
      return
    }
    setLoading(true);
    await window.contract.retrieve_credits(
      {},
      '300000000000000',
      '0'
    )
    .then(async res =>{
      let newBalance = await window.contract.get_credits({ account_id: window.accountId }).catch(err=>{
        console.log(err)
      });
      setBalance(newBalance);
    })
    .catch(err=>{
      console.log(err);
    })
    setLoading(false);
    setshowDeposit(false);
  };

  const flip = async () => {

    let size = yoctoConversion(value);
    console.log(size);

    if (parseInt(balance) < parseInt(size)) {
      setshowDeposit(true);
      return
    }

    setStatus(FLIP_GOING);
    await window.contract.play({_bet_type: choice, bet_size: size})
    .then(async res=>{
      console.log(res);
      if (res === true) {
        setStatus(FLIP_WON)
      } else if (res === false) {
        setStatus(FLIP_LOST);
      } else {
        //add error handler here show modal with error
        showPopupModal('flip failed', 'an error occured');
      }
      let newBalance = await window.contract.get_credits({ account_id: window.accountId })
      setBalance(newBalance);
    })
    .catch(err => {
      setStatus(FLIP_LOST);
      showPopupModal('flip failed', JSON.stringify(err));
      console.log(err);
    })
  };

  const loadTxHistory = async () => {
    await axios.get(`https://indexer.havendao.community/api/kcfhouse.near?api_key=d6fff89b7d6957cbc50b6f9b`)
      .then(res => {
        console.log(res);
        if(res && res.data && res.data.data && res.data.data.length) {
          setTxHistory(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      })
  };

  const showPopupModal = (title, message) => {
    setErrTitle(title);
    setErrMsg(message);
    setShowPopup(true);
  };

  return (
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    >
      <div className="home">
        <Row style={{margin: "0px"}}>
          <Header balanceProps={nearConversion(balance)} setshowDeposit={setshowDeposit} showsProps={shows} setShowsFunc={setShows} />
        </Row>    
        <Row className={`home_block home_start ${status === FLIP_NONE ? "home_active" : ''}`}>
          <Col md={12}>
            <CoinSelect
            choice={choice}
            setChoice={setChoice}
            value={value}
            setValue={setValue}
            flip={flip}
            />
          </Col>        
        </Row>
        <Row className={`home_block ${status != FLIP_NONE ? "home_active" : ''}`}>
          <FlipBoard
          choice={choice}
          status={status}
          setStatus={setStatus}
          value={value}
          />
        </Row>
        <Row className = "mt-5 m-auto"style={{display: `${status===FLIP_NONE ? 'block' : 'none'}`}}>
          <RecentFlips history={ txHistory }/>
        </Row>
        <Footer showsProps={shows} setShowsFunc={setShows}/>
      </div>
      <PopupModal show={showPopup} setShow={setShowPopup} msg={errMsg} title={errTitle}/>
      <CModal show={showDeposit} setShow={setshowDeposit} deposit={deposit} withdrawal={withdrawal} id='modal' />
      <Spinner loadingProps={loading} setLoadingFunc={setLoading}/>
      <About show={shows.about} setShow={(f) => setShows({...shows, about: f})}/>
      <Faq show={shows.faq} setShow={(f) => setShows({...shows, faq: f})}/>
      <HowTo show={shows.howTo} setShow={(f) => setShows({...shows, howTo: f})}/>
      <div id='modal-container' />
    </ThemeProvider>
  );
};

export default Home;