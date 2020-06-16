import React, { useCallback, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const InputPopup = (props: {
  show: boolean;
  setShow: (show: boolean) => void;
  default: string;
  callback: (text: string) => void;
}): JSX.Element => {
  const [input, setInput] = useState(props.default ? props.default : '');
  const closePopup = useCallback(() => props.setShow(false), [props]);
  const saveInput = useCallback(
    (text: string): void => {
      props.callback(text);
      closePopup();
    },
    [props, closePopup]
  );
  return (
    <div className="InputPopup">
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
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <table className="table m-0">
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InputPopup;
