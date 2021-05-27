import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'bootstrap';
import { File } from '../../models/SynologyApiModel';
import SynologyApi from '../../api/synology';

type Modal = {
  show: () => void;
  hide: () => void;
};

const AnimeFolderPopup = (props: {
  show: boolean;
  onClose: () => void;
  folderFiles: File[];
}): JSX.Element => {
  const files = props.folderFiles;
  //const filenames = Object.keys(files).sort();
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
  const play = useCallback((path: string) => {
    window.open(
      SynologyApi.getDownloadURL(SynologyApi.getAuthDownloadURL(path))
    );
  }, []);
  return (
    <div className="AnimeFolderPopup">
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-header">
              <h5 className="modal-title">Folder</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <table className="table table-hover table-borderless w-100 mx-auto">
                <thead>
                  <tr>
                    <th className="text-center">File</th>
                    <th className="text-center" style={{ width: '50px' }}>
                      Play
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.name}>
                      <td className="text-left align-middle">
                        <small>{file.name}</small>
                      </td>
                      <td className="text-center align-middle">
                        <button
                          className={'btn btn-outline-light h-auto border-0'}
                          type="button"
                          onClick={() => play(file.path)}
                        >
                          <small>
                            <i className="material-icons align-middle">
                              play_circle_outline
                            </i>
                          </small>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeFolderPopup;
