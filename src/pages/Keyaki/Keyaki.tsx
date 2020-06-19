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
    (getLocalStorage('database') as DatabaseType)?.keyakiList
  );
  const [keyakiRef, setKeyakiRef] = useState<
    React.RefObject<HTMLTableRowElement>[]
  >([]);
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db) => {
      setKeyakiList(db?.keyakiList);
    });
  }, []);

  useEffect(() => {
    function UpdateKeyakiRef() {
      const ref = [];
      if (keyakiList)
        Object.keys(keyakiList).forEach((ep) => {
          ref[ep] = createRef();
        });
      setKeyakiRef(ref);
    }
    UpdateKeyakiRef();
  }, [keyakiList]);

  const showFiles = useCallback((files: File) => {
    const url = files.url ? files.url : '';
    const photoUrl = files.photoUrl ? files.photoUrl : '';
    const showFilesPopup = (show: boolean) => {
      setPopup(
        <FilesPopup
          driveUrl={url}
          photoUrl={photoUrl}
          show={show}
          setShow={showFilesPopup}
        />
      );
    };
    showFilesPopup(true);
  }, []);

  const update = useCallback(async () => {
    const showLoadingPopup = (show: boolean) => {
      setPopup(
        <GeneralPopup show={show} message="Loading..." canClose={false} />
      );
    };
    showLoadingPopup(true);
    const newKeyakiList = JSON.parse(JSON.stringify(keyakiList)) as Record<
      string,
      KeyakiType
    >;
    const driveFiles = (await GoogleDriveApi.getFiles(driveFolderId)) as {
      name: string;
      id: string;
    }[];
    const photoFiles = (await GooglePhotoApi.getMedias(photoAlbumId)) as {
      filename: string;
      productUrl: string;
    }[];
    driveFiles.forEach((file: { name: string; id: string }) => {
      const ep = parseInt(file.name.split(' ')[2]);
      const sub = file.name.split(' ')[3].split('.')[0];
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      if (newKeyakiList['ep' + ep.toString()]) {
        newKeyakiList['ep' + ep.toString()].sub[sub] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      } else {
        newKeyakiList['ep' + ep.toString()] = {
          sub: {} as Record<string, File>,
          ep: ep,
          name: 'แก้ไข',
        };
        newKeyakiList['ep' + ep.toString()].sub[sub] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      }
    });
    Database.update.keyaki(newKeyakiList);
    showLoadingPopup(false);
  }, [keyakiList]);

  const randomEp = useCallback(() => {
    let ep = 0;
    while (ep === 0 || keyakiList['ep' + ep.toString()] === null) {
      ep = Math.floor(Math.random() * Object.keys(keyakiList).length);
    }
    const currentRef: React.RefObject<HTMLTableRowElement> = keyakiRef[
      'ep' + ep.toString()
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
          const newList = JSON.parse(JSON.stringify(keyakiList)) as Record<
            string,
            KeyakiType
          >;
          newList[key].name = newName;
          Database.update.keyaki(newList);
        };
        const showInputPopup = (show: boolean) => {
          setPopup(
            <InputPopup
              default={name}
              callback={callback}
              show={show}
              setShow={showInputPopup}
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
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-center">Ep</th>
                <th className="text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {keyakiList &&
                Object.keys(keyakiList).map(
                  (key) =>
                    keyakiList[key] !== null && (
                      <tr
                        key={key}
                        ref={
                          keyakiRef[key] as React.RefObject<HTMLTableRowElement>
                        }
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
                                    keyakiList[key].ep.toString() + '_' + sub
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
