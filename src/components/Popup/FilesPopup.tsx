import React, { useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';

const FilesPopup = (props: {
  show: boolean;
  setShow: (show: boolean) => void;
  driveUrl: string;
  photoUrl: string;
}): JSX.Element => {
  const driveUrl = props.driveUrl ? props.driveUrl : '';
  const photoUrl = props.photoUrl ? props.photoUrl : '';
  const closePopup = useCallback(() => props.setShow(false), [props]);
  return (
    <div className="GeneralPopup">
      <Modal
        show={props.show}
        size="sm"
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Body className="text-center">
          <a
            className={
              'btn btn-primary h-auto border-0 m-1' +
              (driveUrl === '' ? ' disabled' : '')
            }
            role="button"
            href={driveUrl}
            target="blank"
          >
            Google Drive
          </a>
          <a
            className={
              'btn btn-primary h-auto border-0 m-1' +
              (photoUrl === '' ? ' disabled' : '')
            }
            type="button"
            href={photoUrl}
            target="blank"
          >
            Google Photo
          </a>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FilesPopup;
