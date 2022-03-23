import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/modal.scss';

const Faq = (props) => {
  const { show, setShow } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose} className='dark-modal m-auto'>
      <Modal.Header closeButton>
        <Modal.Title>FAQ</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4 className='title'>
          What is Kangaroo Coin Flip?
        </h4>
        <p>Kangaroo Coin Flip is a smart contract that allows users to go double or nothing with NEAR tokens. Odds are 50/50 with a % fee that goes to KCF NFT holders.</p>
        <h4 className='title'>
          House Wallet
        </h4>
        <p>
          kcfhouse.near
        </p>
        <h4 className='title'>
          Developer Wallet
        </h4>
        <p>
          kcfteam.near
        </p>
        <h4 className='title'>
          Where can I learn more?
        </h4>
        <p>
          Hop on over to our Discord!
          https://discord.gg/M9BYrTAPZp
        </p>
        <h4 className='title'>
          Where can I learn more?
        </h4>
        <p>
          Each flip has a 4.5% fee applied with 4% going to holders, .25% going to the kcfhouse.near, and .25% going to the kcfteam.near
        </p>
      </Modal.Body>
    </Modal>
  )
}

export default Faq; 