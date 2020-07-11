import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'bootstrap';

type Modal = {
  show: () => void;
  hide: () => void;
};

const AnimeFolderPopup = (props: {
  show: boolean;
  onClose: () => void;
  folderFiles: Record<
    string,
    { name: string; photoUrl?: string; driveUrl?: string; downloadUrl?: string }
  >;
}): JSX.Element => {
  const files = props.folderFiles;
  const filenames = Object.keys(files).sort();
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
  const play = useCallback((downloadUrl: string) => {
    const baseUrl = process.env.REACT_APP_API_ENDPOINT?.toString() || '';
    window.open(baseUrl + '/api/view?url=' + downloadUrl, '_blank');
  }, []);
  const share = useCallback((downloadUrl: string) => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    /* eslint-disable  @typescript-eslint/no-unsafe-call */
    /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
    if ((navigator as any).share) {
      void (navigator as any).share({
        title: 'Download Video',
        url: downloadUrl,
      });
    } else {
      window.open(downloadUrl, '_blank');
    }
  }, []);
  return (
    <div className="AnimeFolderPopup">
      <div className="modal fade">
        <div className="modal-dialog modal-fullscreen">
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
              <table className="table table-hover table-borderless w-auto mx-auto">
                <thead>
                  <tr>
                    <th className="text-center">File</th>
                    <th className="text-center" style={{ width: '50px' }}>
                      Play
                    </th>
                    <th className="text-center" style={{ width: '50px' }}>
                      G.Photo
                    </th>
                    <th className="text-center" style={{ width: '50px' }}>
                      G.Drive
                    </th>
                    <th className="text-center" style={{ width: '50px' }}>
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filenames.map((name) => (
                    <tr key={name}>
                      <td className="align-middle">
                        <small>{files[name].name}</small>
                      </td>
                      <td className="text-center align-middle">
                        <button
                          className={
                            'btn btn-outline-light h-auto border-0' +
                            (files[name].downloadUrl ? '' : ' disabled')
                          }
                          type="button"
                          onClick={() => play(files[name].downloadUrl || '')}
                        >
                          <small>
                            <i className="material-icons align-middle">
                              play_circle_outline
                            </i>
                          </small>
                        </button>
                      </td>
                      <td className="text-center align-middle">
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
                      <td className="text-center align-middle">
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
                      <td className="text-center align-middle">
                        <button
                          className={
                            'btn btn-outline-light h-auto border-0' +
                            (files[name].downloadUrl ? '' : ' disabled')
                          }
                          type="button"
                          onClick={() => share(files[name].downloadUrl || '')}
                        >
                          <small>
                            <i className="material-icons align-middle">
                              vertical_align_bottom
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
