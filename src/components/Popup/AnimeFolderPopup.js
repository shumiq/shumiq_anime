import React from 'react';
import Modal from 'react-bootstrap/Modal';

const AnimeFolderPopup = (props) => {
  const files = props.folderFiles;
  const filenames = Object.keys(files).sort();
  const closePopup = () => props.setShow(false);
  return (
    <div className="AnimeFolderPopup">
      <Modal
        show={props.show}
        centered
        backdrop={true}
        keyboard={true}
        animation={true}
        onHide={closePopup}
      >
        <Modal.Body>
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-center">File</th>
                <th className="text-center" style={{ width: '50px' }}>
                  G.Photo
                </th>
                <th className="text-center" style={{ width: '50px' }}>
                  G.Drive
                </th>
              </tr>
            </thead>
            <tbody>
              {filenames.map((name) => (
                <tr key={name}>
                  <td>
                    <small>{files[name].name}</small>
                  </td>
                  <td className="text-center">
                    <a
                      className={
                        'btn btn-outline-light h-auto border-0' +
                        (files[name].photoUrl ? '' : ' disabled')
                      }
                      type="button"
                      href={files[name].photoUrl}
                      target="blank"
                    >
                      <small>
                        <i className="material-icons align-middle">movie</i>
                      </small>
                    </a>
                  </td>
                  <td className="text-center">
                    <a
                      className={
                        'btn btn-outline-light h-auto border-0' +
                        (files[name].driveUrl ? '' : ' disabled')
                      }
                      type="button"
                      href={files[name].driveUrl}
                      target="blank"
                    >
                      <small>
                        <i className="material-icons align-middle">movie</i>
                      </small>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AnimeFolderPopup;
