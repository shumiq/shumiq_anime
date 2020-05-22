import { onFirebaseDatabaseUpdate, SaveKeyaki } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import { IsAdmin } from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import FilesPopup from '../../components/Popup/FilesPopup';
import InputPopup from '../../components/Popup/InputPopup';
import React, { useState, createRef, useEffect, useCallback } from 'react';

const driveFolderId = '16jhCH2CkhVgZdmSx0cWhh364a1oqUm8U';
const photoAlbumId =
  'ACKboXDVl0yynHYnKsDhn5HNlV7AxRTmboF6WNjWyFek8nloYNKJ1B0fxWQZ5A7Vk-kh-FOmRTJE';

const Keyaki = () => {
  const [keyakiList, setKeyakiList] = useState(
    getLocalStorage('database')?.keyakilist
  );
  const [keyakiRef, setKeyakiRef] = useState([]);
  const [popup, setPopup] = useState('');

  useEffect(() => {
    function UpdateKeyakiRef() {
      let ref = [];
      if (keyakiList)
        Object.keys(keyakiList).forEach((ep) => {
          ref[ep] = createRef();
        });
      setKeyakiRef(ref);
    }
    onFirebaseDatabaseUpdate((db) => {
      UpdateKeyakiRef();
      setKeyakiList(db?.keyakilist);
    });
    UpdateKeyakiRef();
  }, [keyakiList]);

  const showFiles = useCallback((files) => {
    const url = files.url ? files.url : '';
    const photoUrl = files.photoUrl ? files.photoUrl : '';
    const showFilesPopup = (show) => {
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
    const showLoadingPopup = (show) => {
      setPopup(
        <GeneralPopup show={show} message="Loading..." canClose={false} />
      );
    };
    showLoadingPopup(true);
    let newKeyakiList = JSON.parse(JSON.stringify(keyakiList));
    const driveFiles = await GoogleDriveApi.getFiles(driveFolderId);
    const photoFiles = await GooglePhotoApi.getMedias(photoAlbumId);
    driveFiles.forEach((file) => {
      const ep = parseInt(file.name.split(' ')[2]);
      const sub = file.name.split(' ')[3].split('.')[0];
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      if (newKeyakiList[ep]) {
        newKeyakiList[ep].sub[sub] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      } else {
        newKeyakiList[ep] = {
          ep: ep.toString(),
          name: 'แก้ไข',
        };
        newKeyakiList[ep].sub = {};
        newKeyakiList[ep].sub[sub] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      }
    });
    SaveKeyaki(newKeyakiList);
    showLoadingPopup(false);
  }, [keyakiList]);

  const randomEp = useCallback(() => {
    let ep = 0;
    while (ep === 0 || keyakiList[ep] === null) {
      ep = Math.floor(Math.random() * Object.keys(keyakiList).length);
    }
    if (keyakiRef[ep]?.current) {
      keyakiRef.map((ref) =>
        ref.current?.className ? (ref.current.className = '') : ''
      );
      keyakiRef[ep].current.className = 'bg-dark';
      keyakiRef[ep].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [keyakiList, keyakiRef]);

  const showInput = useCallback(
    (ep) => {
      if (IsAdmin()) {
        const name = keyakiList[ep].name;
        const callback = (newName) => {
          let newList = JSON.parse(JSON.stringify(keyakiList));
          newList[ep].name = newName;
          SaveKeyaki(newList);
        };
        const showInputPopup = (show) => {
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
                keyakiList.map(
                  (keyaki) =>
                    keyaki !== null && (
                      <tr key={keyaki.ep} ref={keyakiRef[keyaki.ep]}>
                        <td>{keyaki.ep}</td>
                        <td className="text-left">
                          <span onClick={() => showInput(keyaki.ep)}>
                            {keyaki.name}
                          </span>
                        </td>
                        <td>
                          {Object.keys(keyaki.sub).map(
                            (sub) =>
                              keyaki.sub[sub]?.url && (
                                <button
                                  className="btn btn-primary m-1"
                                  onClick={() => showFiles(keyaki.sub[sub])}
                                  key={keyaki.ep + '_' + sub}
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
              {IsAdmin() && (
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
