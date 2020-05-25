import { onFirebaseDatabaseUpdate, SaveConan } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import { IsAdmin } from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import FilesPopup from '../../components/Popup/FilesPopup';
import InputPopup from '../../components/Popup/InputPopup';
import React, { useState, createRef, useEffect, useCallback } from 'react';

const driveFolderId = '1ZXug0hPb-_ylKa45LX7H42cLLTvLiBdy';
const photoAlbumId =
  'ACKboXA-SW1-hje13C1evPH_HlgHlP9UasTb7u5ECLT2ds1ufDzcH9gDrL-XXAT3_mveyhNr_ELI';

const Conan = () => {
  const [conanList, setConanList] = useState(
    getLocalStorage('database')?.conanList
  );
  const [conanRef, setConanRef] = useState([]);
  const [popup, setPopup] = useState('');

  useEffect(() => {
    function UpdateConanRef() {
      let ref = [];
      if (conanList)
        Object.keys(conanList).forEach((cs) => {
          ref[cs] = createRef();
        });
      setConanRef(ref);
    }
    onFirebaseDatabaseUpdate((db) => {
      UpdateConanRef();
      setConanList(db?.conanList);
    });
    UpdateConanRef();
  }, [conanList]);

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
    let newConanList = JSON.parse(JSON.stringify(conanList));
    const driveFiles = await GoogleDriveApi.getFiles(driveFolderId);
    const photoFiles = await GooglePhotoApi.getMedias(photoAlbumId);
    driveFiles.forEach((file) => {
      const cs = parseInt(file.name.split(' ')[1]);
      const ep = parseInt(file.name.split(' ')[3].split('.')[0]);
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      if (newConanList[cs]) {
        newConanList[cs].episodes[ep] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      } else {
        newConanList[cs] = {
          case: cs.toString(),
          name: 'แก้ไข',
        };
        newConanList[cs].episodes = {};
        newConanList[cs].episodes[ep] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      }
    });
    SaveConan(newConanList);
    showLoadingPopup(false);
  }, [conanList]);

  const randomEp = useCallback(() => {
    let ep = 0;
    while (ep === 0 || conanList[ep] === null) {
      ep = Math.floor(Math.random() * Object.keys(conanList).length);
    }
    if (conanRef[ep]?.current) {
      conanRef.map((ref) =>
        ref.current?.className ? (ref.current.className = '') : ''
      );
      conanRef[ep].current.className = 'bg-dark';
      conanRef[ep].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [conanList, conanRef]);

  const showInput = useCallback(
    (cs) => {
      if (IsAdmin()) {
        const name = conanList[cs].name;
        const callback = (newName) => {
          let newList = JSON.parse(JSON.stringify(conanList));
          newList[cs].name = newName;
          SaveConan(newList);
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
    [conanList]
  );

  return (
    <div className="Anime">
      <div className="container p-0 my-5">
        <div className="row text-center w-100 m-0">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="text-center">Case</th>
                <th className="text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {conanList &&
                conanList.map(
                  (conan) =>
                    conan !== null && (
                      <tr key={conan.case} ref={conanRef[conan.case]}>
                        <td>{conan.case}</td>
                        <td className="text-left">
                          <span onClick={() => showInput(conan.case)}>
                            {conan.name}
                          </span>
                        </td>
                        <td>
                          {Object.keys(conan.episodes).map(
                            (episode) =>
                              conan.episodes[episode]?.url && (
                                <button
                                  className="btn btn-primary m-1"
                                  onClick={() =>
                                    showFiles(conan.episodes[episode])
                                  }
                                  key={episode}
                                >
                                  {episode}
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

export default Conan;
