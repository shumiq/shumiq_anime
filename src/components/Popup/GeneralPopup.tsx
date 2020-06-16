import React, { useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';

const GeneralPopup = (props: {
  show: boolean;
  setShow?: (show: boolean) => void;
  canClose?: boolean;
  message: string;
}): JSX.Element => {
  const canClose = {
    backdrop: props.canClose ? true : 'static',
    keyboard: props.canClose,
    header: props.canClose,
  };
  const closePopup = useCallback(() => {
    if (props.setShow) props.setShow(false);
  }, [props]);
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
        {canClose.header && (
          <Modal.Header closeButton>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>
          <p className="text-center m-0 p-0">{props.message}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GeneralPopup;
