import React from 'react';
import '../styles/modal.scss';
import { Modal, Button } from 'react-bootstrap';

const PopupModal = (props) => {
  const { show, setShow, msg, title } = props;

  const handleClose = _ => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} className='dark-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{msg}</p>
      </Modal.Body> 
      <Modal.Footer>
        <Button variant="primary" className="bg-white text-purple" onClick={()=>handleClose()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )

}

export default PopupModal;