import React from 'react';
import '../styles/modal.scss';
import { Modal, Button } from 'react-bootstrap';

function PopupModal(props) {
  const { show, setShow, msg } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose} className='popup'>
        <Modal.Header closeButton>
          <Modal.Title>Popup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{msg}</p>
        </Modal.Body> 
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopupModal;