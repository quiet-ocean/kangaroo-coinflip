import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/modal.scss';

const About = (props) => {
  const { show, setShow } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose} className='dark-modal m-auto'>
      <Modal.Header closeButton>
        <Modal.Title>Flip Responsibly</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Please flip responsibly when playing KCF so it does not impact your well-being . Only play with NEAR you are willing to part with.</p>
        <h4 className='title'>
          Resources
        </h4>
        <p>
          Chat WWW.NCPGAMBLING.ORG/CHAT
        </p>
        <p>
          Call 1-900-522-4700
        </p>
        <p>
          Text 1-800-522-4700
        </p>        
      </Modal.Body>
    </Modal>
  )
}

export default About;