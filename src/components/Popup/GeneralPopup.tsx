import React, { useEffect, useCallback, useState } from 'react';
import { Modal } from 'bootstrap';

type Modal = {
  show: () => void;
  hide: () => void;
};

const GeneralPopup = (props: {
  show: boolean;
  onClose: () => void;
  canClose?: boolean;
  message: string;
}): JSX.Element => {
  const canClose = props.canClose === undefined ? true : props.canClose;
  const onClose = useCallback(() => props.onClose(), [props]);
  const [modal, setModal] = useState<Modal>();
  useEffect(() => {
    const popupElement = document.querySelector('.modal');
    if (popupElement) {
      setModal(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new Modal(popupElement, {
          backdrop: canClose ? true : 'static',
          keyboard: canClose,
        }) as Modal
      );
    }
  }, [canClose]);
  useEffect(() => {
    if (modal)
      if (props.show) modal.show();
      else modal.hide();
  }, [modal, props.show, canClose]);
  useEffect(() => {
    const popupElement = document.querySelector('.modal');
    if (popupElement !== null) {
      popupElement.addEventListener('hidden.bs.modal', onClose);
    }
  }, [onClose]);
  return (
    <div className="GeneralPopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-body text-center">
              <p className="text-center m-0 p-0">{props.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPopup;
