import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from 'bootstrap';

type Modal = {
  show: () => void;
  hide: () => void;
};

const ClipboardPopup = (props: {
  show: boolean;
  onClose: () => void;
  text: string;
}): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
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
  const copy = useCallback(() => {
    inputRef.current?.select();
    document.execCommand('copy');
  }, []);
  return (
    <div className="ClipboardPopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-body text-center">
              <table className="table m-0 table-borderless">
                <tbody>
                  <tr>
                    <td className="p-0 text-center">
                      <input
                        ref={inputRef}
                        type="text"
                        name="input"
                        className="form-control"
                        defaultValue={props.text}
                        readOnly
                      />
                    </td>
                    <td className="p-0 pl-1 text-center">
                      <button
                        id="btn-copy"
                        type="button"
                        className="btn btn-primary"
                        onClick={copy}
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipboardPopup;
