import React from 'react';
import { ToastContainer, Toast } from "react-bootstrap";

const CToast = (props) => {
  const { showToast, title, content } = props;
  return (
    <ToastContainer>
      <Toast show={showToast}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small className="text-muted">just now</small>
        </Toast.Header>
        <Toast.Body>See? Just like this.</Toast.Body>
      </Toast>
    </ToastContainer>
  )
};

export default CToast;