import React, { useCallback, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';

const ClipboardPopup = (props) => {
  const inputRef = useRef('');
  const closePopup = useCallback(() => props.setShow(false), [props]);
  const copy = useCallback(() => {
    inputRef.current.select();
    document.execCommand('copy');
  }, []);
  return (
    <div className="ClipboardPopup">
      <Modal
        show={props.show}
        size="md"
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
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
