import React, { useCallback, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const InputPopup = (props) => {
  const [input, setInput] = useState(props.default ? props.default : '');
  const closePopup = useCallback(() => props.setShow(false), [props]);
  const saveInput = useCallback(
    (text) => {
      props.callback(text);
      closePopup();
    },
    [props, closePopup]
  );
  return (
    <div className="GeneralPopup">
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
                    type="text"
                    name="input"
                    className="form-control"
                    defaultValue={props.default}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </td>
                <td className="p-0 text-center">
                  <button
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InputPopup;
