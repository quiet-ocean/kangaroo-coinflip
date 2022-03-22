import React from 'react';
import '../styles/spinner.scss';
import { Modal, Button, InputGroup,FormControl } from 'react-bootstrap';

function Spinner(props) {
  const { loadingProps, setLoadingFunc } = props;

  const show = loadingProps;
  const setShow = setLoadingFunc;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show}>
        <p>Loading</p>
      </Modal>
    </>
  );
}

export default Spinner;