import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'bootstrap';
import GooglePhotoApi from '../../api/googlephoto';

type Modal = {
  show: () => void;
  hide: () => void;
};

const FilesPopup = (props: {
  show: boolean;
  onClose: () => void;
  driveUrl: string;
  photoUrl: string;
  photoId?: string;
}): JSX.Element => {
  const driveUrl = props.driveUrl ? props.driveUrl : '';
  const photoUrl = props.photoUrl ? props.photoUrl : '';
  const photoId = props.photoId ? props.photoId : '';
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
  const share = useCallback(async (photoId: string) => {
    const downloadUrl = await GooglePhotoApi.getDownloadUrl(photoId);
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
    <div className="FilesPopup">
      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-auto mx-auto">
            <div className="modal-body text-center">
              <a
                className={
                  'btn btn-primary h-auto border-0 m-1' +
                  (driveUrl === '' ? ' disabled' : '')
                }
                role="button"
                href={driveUrl}
                target="blank"
              >
                Google Drive
              </a>
              <a
                className={
                  'btn btn-primary h-auto border-0 m-1' +
                  (photoUrl === '' ? ' disabled' : '')
                }
                type="button"
                href={photoUrl}
                target="blank"
              >
                Google Photo
              </a>
              {photoId && (
                <button
                  className={
                    'btn btn-primary h-auto border-0 m-1' +
                    (photoId === '' ? ' disabled' : '')
                  }
                  type="button"
                  //href={downloadUrl}
                  //target="blank"
                  onClick={() => share(photoId)}
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPopup;
