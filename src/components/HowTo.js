import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/modal.scss';

const HowTo = (props) => {
  const { show, setShow } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose} className='dark-modal m-auto'>
      <Modal.Header closeButton>
        <Modal.Title>How to Play</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>1. Connect your NEAR wallet. (Get NEAR wallet @https://wallet.near.org/ )</p>
        <p>2. Pick either heads or tails.</p>
        <p>3. Select the desired amount to flip.</p>
        <p>4. Click “Flip”.</p>
        <p>5. Click approve and allow coin to flip.</p>
        <h4 className='title'>
          What is a NEAR wallet?
        </h4>
        <p>
          NEAR wallet is a program that allows users to manage digital assets on NEAR protocol. Visit https://wallet.near.org/, create an account and fund your wallet. Purchase NEAR via Kucoin, Binance, Gate.io, etc.
        </p>
        <h4 className='title'>
          How do I fund my NEAR wallet?
        </h4>
        <p>
          Purchase NEAR via a central exchange such as Kucoin, Binance, Gate.io, etc and send your NEAR to your wallet address after creating a NEAR wallet account.
        </p>   
      </Modal.Body>
    </Modal>
  )
}

export default HowTo;