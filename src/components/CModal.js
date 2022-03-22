import React from 'react';
import '../styles/modal.scss';
import { Modal, Button, InputGroup,FormControl } from 'react-bootstrap';

function CModal(props) {
  const { show, setShow } = props;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>How much do you deposit or withdraw?</p>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ⓝ</InputGroup.Text>
            <FormControl
              placeholder=""
              aria-label=""
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Modal.Body> 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Deposit
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Withdraw
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CModal;