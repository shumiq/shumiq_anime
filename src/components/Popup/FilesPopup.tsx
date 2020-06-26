import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'bootstrap';

type Modal = {
  show: () => void;
  hide: () => void;
};

const FilesPopup = (props: {
  show: boolean;
  onClose: () => void;
  driveUrl: string;
  photoUrl: string;
}): JSX.Element => {
  const driveUrl = props.driveUrl ? props.driveUrl : '';
  const photoUrl = props.photoUrl ? props.photoUrl : '';
  const onClose = useCallback(() => props.onClose(), [props]);
  const [modal, setModal] = useState<Modal>();
  useEffect(() => {
    const popupElement = document.querySelector('.modal');
    if (popupElement) {
      setModal(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new Modal(popupElement) as Modal
      );
    }
  }, []);
  useEffect(() => {
    if (modal)
      if (props.show) modal.show();
      else modal.hide();
  }, [modal, props.show]);
  useEffect(() => {
    const popupElement = document.querySelector('.modal');
    if (popupElement !== null) {
      popupElement.addEventListener('hidden.bs.modal', onClose);
    }
  }, [onClose]);
  return (
    <div className="FilesPopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-body text-center">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPopup;
