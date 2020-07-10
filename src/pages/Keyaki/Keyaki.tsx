import React, { useState, createRef, useEffect, useCallback } from 'react';
import { Database } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import UserDetail from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import FilesPopup from '../../components/Popup/FilesPopup';
import InputPopup from '../../components/Popup/InputPopup';
import {
  Database as DatabaseType,
  Keyaki as KeyakiType,
  File,
} from '../../utils/types';

const driveFolderId = '16jhCH2CkhVgZdmSx0cWhh364a1oqUm8U';
const photoAlbumId =
  'ACKboXDVl0yynHYnKsDhn5HNlV7AxRTmboF6WNjWyFek8nloYNKJ1B0fxWQZ5A7Vk-kh-FOmRTJE';

const Keyaki = (): JSX.Element => {
  const [keyakiList, setKeyakiList] = useState<Record<string, KeyakiType>>(
    (getLocalStorage('database') as DatabaseType)?.keyaki
  );
  const [keyakiRef, setKeyakiRef] = useState<
    React.RefObject<HTMLTableRowElement>[]
  >([]);
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db) => {
      setKeyakiList(db?.keyaki);
    });
  }, []);

  useEffect(() => {
    function UpdateKeyakiRef() {
      const ref = [];
      if (keyakiList)
        Object.keys(keyakiList).forEach((key) => {
          ref[key] = createRef();
        });
      setKeyakiRef(ref);
    }
    UpdateKeyakiRef();
  }, [keyakiList]);

  const showFiles = useCallback((files: File) => {
    const url = files.url ? files.url : '';
    const photoUrl = files.photoUrl ? files.photoUrl : '';
    const downloadUrl = files.downloadUrl ? files.downloadUrl : '';
    const showFilesPopup = (show: boolean) => {
      setPopup(
        <FilesPopup
          driveUrl={url}
          photoUrl={photoUrl}
          downloadUrl={downloadUrl}
          show={show}
          onClose={() => {
            setPopup('');
          }}
        />
      );
    };
    showFilesPopup(true);
  }, []);

  const update = useCallback(async () => {
    const showLoadingPopup = (show: boolean) => {
      setPopup(
        <GeneralPopup
          show={show}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
    };
    showLoadingPopup(true);
    const driveFiles = await GoogleDriveApi.getFiles(driveFolderId);
    const photoFiles = await GooglePhotoApi.getMedias(photoAlbumId);
    driveFiles.forEach((file: { name: string; id: string }) => {
      const ep = parseInt(file.name.split(' ')[2]);
      const sub = file.name.split(' ')[3].split('.')[0];
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      const downloadUrl =
        photoFiles.filter((f) => f.filename === file.name)[0]?.baseUrl + '=dv';
      if (
        Object.entries(keyakiList).filter(([key, keyaki]) => keyaki.ep === ep)
          .length > 0
      ) {
        Object.entries(keyakiList)
          .filter(([key, keyaki]) => keyaki.ep === ep)
          .forEach(([key, keyaki]) => {
            keyaki.sub[sub] = {
              url: url,
              photoUrl: photoUrl ? photoUrl : null,
              downloadUrl: downloadUrl ? downloadUrl : null,
            };
            Database.update.keyaki(key, keyaki);
          });
      } else {
        const keyaki: KeyakiType = {
          sub: {} as Record<string, File>,
          ep: ep,
          name: 'แก้ไข',
        };
        keyaki.sub[sub] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
          downloadUrl: downloadUrl ? downloadUrl : null,
        };
        Database.add.keyaki(keyaki);
      }
    });
    showLoadingPopup(false);
  }, [keyakiList]);

  const randomEp = useCallback(() => {
    const randomKey = Object.keys(keyakiList)[
      Math.floor(Math.random() * Object.keys(keyakiList).length)
    ];
    const currentRef: React.RefObject<HTMLTableRowElement> = keyakiRef[
      randomKey
    ] as React.RefObject<HTMLTableRowElement>;
    if (currentRef) {
      keyakiRef.map((ref) =>
        ref.current?.className ? (ref.current.className = '') : ''
      );
      const current = currentRef.current;
      if (current) {
        current.className = 'bg-dark';
        current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [keyakiList, keyakiRef]);

  const showInput = useCallback(
    (key: string) => {
      if (UserDetail.isAdmin()) {
        const name = keyakiList[key]?.name || '';
        const callback = (newName: string) => {
          keyakiList[key].name = newName;
          Database.update.keyaki(key, keyakiList[key]);
        };
        const showInputPopup = (show: boolean) => {
          setPopup(
            <InputPopup
              default={name}
              callback={callback}
              show={show}
              onClose={() => setPopup('')}
            />
          );
        };
        showInputPopup(true);
      }
    },
    [keyakiList]
  );

  return (
    <div className="Anime">
      <div className="container p-0 my-5">
        <div className="row text-center w-100 m-0">
          <div
            className="w-100 m-0 p-0"
            style={{ maxWidth: '100%', overflowX: 'auto' }}
          >
            <table className="table table-hover mt-5 table-borderless">
              <thead>
                <tr className="table-bordered">
                  <th className="text-center">Ep</th>
                  <th className="text-left">Name</th>
                  <th className="text-left"></th>
                </tr>
              </thead>
              <tbody>
                {keyakiList &&
                  Object.entries(keyakiList)
                    .sort((entryA, entryB) => entryA[1].ep - entryB[1].ep)
                    .map(
                      ([key, keyaki]) =>
                        keyakiList[key] !== null && (
                          <tr
                            key={key}
                            ref={
                              keyakiRef[key] as React.RefObject<
                                HTMLTableRowElement
                              >
                            }
                            className="table-bordered border-left-0 border-right-0"
                          >
                            <td>{keyakiList[key].ep}</td>
                            <td className="text-left">
                              <span onClick={() => showInput(key)}>
                                {keyakiList[key].name}
                              </span>
                            </td>
                            <td>
                              {Object.keys(keyakiList[key].sub).map(
                                (sub) =>
                                  keyakiList[key].sub[sub]?.url && (
                                    <button
                                      className="btn btn-primary m-1"
                                      onClick={() =>
                                        showFiles(keyakiList[key].sub[sub])
                                      }
                                      key={
                                        keyakiList[key].ep.toString() +
                                        '_' +
                                        sub
                                      }
                                    >
                                      {sub}
                                    </button>
                                  )
                              )}
                            </td>
                          </tr>
                        )
                    )}
              </tbody>
            </table>
          </div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
            <div className="w-100 text-center">
              <a
                className="btn"
                href={
                  'https://drive.google.com/drive/u/0/folders/' + driveFolderId
                }
                target="blank"
              >
                <i className="material-icons">folder</i>
              </a>
              <button id="btn-random" className="btn" onClick={randomEp}>
                <i className="material-icons">shuffle</i>
              </button>
              {UserDetail.isAdmin() && (
                <button id="btn-update" className="btn" onClick={update}>
                  <i className="material-icons">cached</i>
                </button>
              )}
            </div>
          </nav>
          {popup}
        </div>
      </div>
    </div>
  );
};

export default Keyaki;
