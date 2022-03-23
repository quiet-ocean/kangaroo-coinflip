import React from 'react';
import '../styles/modal.scss';
import { Modal, Button } from 'react-bootstrap';

const PopupModal = (props) => {
  const { show, setShow, msg, title } = props;

  const handleClose = _ => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} className='cmodal'>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{msg}</p>
      </Modal.Body> 
      <Modal.Footer>
        <Button variant="primary" onClick={()=>handleClose()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )

}

export default PopupModal;