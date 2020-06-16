import React, { useCallback, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';

const ClipboardPopup = (props: {
  show: boolean;
  setShow: (show: boolean) => void;
  text: string;
}): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const closePopup = useCallback(() => props.setShow(false), [props]);
  const copy = useCallback(() => {
    inputRef.current?.select();
    document.execCommand('copy');
  }, []);
  return (
    <div className="ClipboardPopup">
      <Modal
        show={props.show}
        size="lg"
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <table className="table m-0">
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
                <td className="p-0 text-center">
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClipboardPopup;
