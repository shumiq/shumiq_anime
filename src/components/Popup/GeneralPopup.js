import React from 'react';
import Modal from 'react-bootstrap/Modal';

const GeneralPopup = (props) => {
  const closePopup = () => props.setShow(false);
  const canClose = {
    backdrop: props.canClose ? true : 'static',
    keyboard: props.canClose,
  };
  return (
    <div className="GeneralPopup">
      <Modal
        show={props.show}
        size="sm"
        centered
        backdrop={canClose.backdrop}
        keyboard={canClose.keyboard}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Body>
          <p className="text-center m-0 p-0">{props.message}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GeneralPopup;
