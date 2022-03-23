import React, { useState } from 'react';
import { Row, Col, Image, Stack } from 'react-bootstrap';

import Flipping from '../assets/kangaflip.gif';
import HeadsLogo from '../assets/heads-logo.png';
import TailsLogo from '../assets/tails-logo.png';

import { FLIP_GOING, FLIP_WON, FLIP_LOST, FLIP_NONE, FLIP_DOUBLE, HEAD, TAIL } from '../constants';

const FlipBoard = (props) => {

  const { status, choice, value, setStatus } = props;

  const getText = () => {
    let head = '';
    let desc = '';
    let wonValue;
    if(status == FLIP_GOING) {
      head = 'Flipping ' + value + ' Ⓝ';
      desc = 'You Choose ' + (choice ? 'Heads' : 'Tails');
    } else if(status === FLIP_WON) {
      wonValue = (value * (0.955) * 2).toFixed(2).toString();
      head = 'You Won ' + wonValue + ' Ⓝ';
      desc = 'Current Streak: ' + 1;
    } else if(status === FLIP_LOST) {
      head = 'You Lost ' + value.toString() + ' Ⓝ';
      desc = 'Current Streak: ' + 0;
    } else {
      head = '';
      desc = '';
    }

    return { head: head, desc: desc }
  }

  let coinSection;
  if (status === FLIP_GOING) {
    coinSection = (
      <div className='logos'>
          <Image src={Flipping} style={{display: `${status===FLIP_GOING ? 'block' : 'none'}`}} className='coin' width={472} />
          <Image src={HeadsLogo} style={{display: `${status!=FLIP_GOING && choice===true? 'block' : 'none'}`}} className='coin' width={472} />
          <Image src={TailsLogo} style={{display: `${status!=FLIP_GOING && choice===false? 'block' : 'none'}`}} className='coin' width={472} />
      </div>
    )
  } else if (status === FLIP_WON) {
    coinSection = (
      <div className='logos'>
            <Image src={Flipping} style={{display: `${status===FLIP_GOING ? 'block' : 'none'}`}} className='coin' width={472} />
            <Image src={HeadsLogo} style={{display: `${status!=FLIP_GOING && choice===true? 'block' : 'none'}`}} className='coin' width={472} />
            <Image src={TailsLogo} style={{display: `${status!=FLIP_GOING && choice===false? 'block' : 'none'}`}} className='coin' width={472} />
      </div>
    )
  } else if (status === FLIP_LOST) {
    coinSection = (
      <div className='logos'>
            <Image src={Flipping} style={{display: `${status===FLIP_GOING ? 'block' : 'none'}`}} className='coin' width={472} />
            <Image src={HeadsLogo} style={{display: `${status!=FLIP_GOING && choice===false? 'block' : 'none'}`}} className='coin' width={472} />
            <Image src={TailsLogo} style={{display: `${status!=FLIP_GOING && choice===true? 'block' : 'none'}`}} className='coin' width={472} />
      </div>
    )
  } else {
    coinSection = (
      <div className='logos'>
            <Image src={Flipping} style={{display: `${status===FLIP_GOING ? 'block' : 'none'}`}} className='coin' width={472} />
            <Image src={HeadsLogo} style={{display: `${status!=FLIP_GOING && choice===true? 'block' : 'none'}`}} className='coin' width={472} />
            <Image src={TailsLogo} style={{display: `${status!=FLIP_GOING && choice===false? 'block' : 'none'}`}} className='coin' width={472} />
      </div>
    )
  }

  return (
    <Col>
      <Stack className={``}>
        {coinSection}
        <p className="bold-font">{getText().head}</p>
        <p className="">{getText().desc}</p>
        <Stack gap={3} className='home_btn_group mt-2 mb-5'>
          <Stack direction="horizontal" gap={2} style={{visibility: `${status === FLIP_DOUBLE ? 'visible' : 'hidden'}`}}>
            <button className="btn-transparent" style={{width: '50%'}}>
              <span className="bold-font">Heads</span>
            </button>
            <button className="btn-transparent" style={{width: '50%'}}>
              <span className="bold-font">Tails</span>
            </button>
          </Stack>
          <button
          className="btn-dark-bg full-width"
          style={{display: `${status===FLIP_DOUBLE ? 'block' : 'none'}`}}
          >
            <span className="bold-font">Flip!</span>
          </button>
          <button
          className="btn-dark-bg full-width"
          style={{visibility: `${ status === FLIP_LOST ? 'visible' : 'hidden' }`}}
          onClick={()=>setStatus(FLIP_NONE)}
          >
            <span className="bold-font">Try Again!</span>
          </button>
          <button
          className="btn-dark-bg full-width"
          style={{display: `${ status === FLIP_WON ? 'block' : 'none' }`}}
          onClick={()=>setStatus(FLIP_NONE)}
          >
            <span className="bold-font">Play again!</span>
          </button>
        </Stack>
      </Stack>
    </Col>
  )
};

export default FlipBoard;