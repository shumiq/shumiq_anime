import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'bootstrap';

type Modal = {
  show: () => void;
  hide: () => void;
};

const InputPopup = (props: {
  show: boolean;
  onClose: () => void;
  default: string;
  callback: (text: string) => void;
}): JSX.Element => {
  const [input, setInput] = useState(props.default ? props.default : '');
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
  const saveInput = useCallback(
    (text: string): void => {
      props.callback(text);
      onClose();
    },
    [onClose, props]
  );
  return (
    <div className="InputPopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-body text-center">
              <table className="table m-0 table-borderless">
                <tbody>
                  <tr>
                    <td className="p-0 text-center w-100">
                      <input
                        type="text"
                        name="input"
                        className="form-control"
                        defaultValue={props.default}
                        onChange={(e) => setInput(e.target.value)}
                      />
                    </td>
                    <td className="p-0 pl-2 text-center">
                      <button
                        id="btn-save"
                        type="button"
                        className="btn btn-primary"
                        onClick={() => saveInput(input)}
                      >
                        Save
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

export default InputPopup;
