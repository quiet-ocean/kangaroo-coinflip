import React, { useState } from 'react';
import '../styles/modal.scss';
import { Modal, Button, InputGroup,FormControl } from 'react-bootstrap';
import nearAPI from 'near-api-js';

function CModal(props) {
  const { show, setShow, deposit, withdrawal } = props;
  const [inputBox, setInputBox] = useState("0");

  const handleClose = () => setShow(false);

  const printer = () => {
    console.log(inputBox);
  }
  return (
    <div className='cmodal'>
      <Modal show={show} onHide={handleClose} className='cmodal'>
        <Modal.Header closeButton>
          <Modal.Title>Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            To play on Classy Kangaroo Coin Flip you first need to deposit some Ⓝ
            <br/>
            You also can't bet more than your deposited balance.
          </p>
          <p>How much do you want to deposit?</p>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ⓝ</InputGroup.Text>
            <FormControl
              value={inputBox}
              onChange={evt => setInputBox(evt.target.value)}
              placeholder="value to deposit"
              aria-label=""
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Modal.Body> 
        <Modal.Footer>
          <Button variant="secondary" onClick={_ =>deposit(inputBox)}>
            Deposit
          </Button>
          <Button variant="primary" onClick={_ => withdrawal()}>
            Withdraw my balance 
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CModal;