import { onFirebaseDatabaseUpdate, SaveConan } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import { IsAdmin } from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';
import GooglePhotoApi from '../../api/googlephoto';
import React, { useState, createRef } from 'react';

const driveFolderId = '1ZXug0hPb-_ylKa45LX7H42cLLTvLiBdy';
const photoAlbumId =
  'ACKboXA-SW1-hje13C1evPH_HlgHlP9UasTb7u5ECLT2ds1ufDzcH9gDrL-XXAT3_mveyhNr_ELI';

const Conan = () => {
  const [state, setState] = useState({
    conanList: getLocalStorage('database')?.conanlist,
    conanRef: [],
    currentEp: 0,
    currentUrl: '',
    currentPhotoUrl: '',
    popupFiles: false,
    popupLoading: false,
  });

  onFirebaseDatabaseUpdate((db) => {
    let conanRef = [];
    Object.keys(db?.conanlist).forEach((cs) => {
      conanRef[cs] = createRef();
    });
    setState({
      ...state,
      conanList: db?.conanlist,
      conanRef: conanRef,
    });
  });

  const showFiles = (ep, files) => {
    setState({
      ...state,
      currentEp: ep,
      currentUrl: files.url ? files.url : '',
      currentPhotoUrl: files.photoUrl ? files.photoUrl : '',
      popupFiles: true,
    });
  };

  const update = async () => {
    setState({ ...state, popupLoading: true });
    let conanList = JSON.parse(JSON.stringify(state.conanList));
    const driveFiles = await GoogleDriveApi.getFiles(driveFolderId);
    const photoFiles = await GooglePhotoApi.getMedias(photoAlbumId);
    driveFiles.forEach((file) => {
      const cs = parseInt(file.name.split(' ')[1]);
      const ep = parseInt(file.name.split(' ')[3].split('.')[0]);
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      if (conanList[cs]) {
        conanList[cs].episodes[ep] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      } else {
        conanList[cs] = {
          case: cs.toString(),
          name: 'แก้ไข',
        };
        conanList[cs].episodes[ep] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      }
    });
    SaveConan(conanList);
    setState({ ...state, popupLoading: false });
  };

  const randomEp = () => {
    let ep = 0;
    while (ep === 0 || state.conanList[ep] === null) {
      ep = Math.floor(Math.random() * Object.keys(state.conanList).length);
    }
    if (state.conanRef[ep]?.current) {
      state.conanRef.map((ref) =>
        ref.current?.className ? (ref.current.className = '') : ''
      );
      state.conanRef[ep].current.className = 'bg-dark';
      state.conanRef[ep].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

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
              {state.conanList.map(
                (conan) =>
                  conan !== null && (
                    <tr key={conan.case} ref={state.conanRef[conan.case]}>
                      <td>{conan.case}</td>
                      <td className="text-left">{conan.name}</td>
                      <td>
                        {Object.keys(conan.episodes).map(
                          (episode) =>
                            conan.episodes[episode]?.url && (
                              <button
                                className="btn btn-primary mx-1"
                                onClick={() =>
                                  showFiles(episode, conan.episodes[episode])
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
              <button className="btn" onClick={randomEp}>
                <i className="material-icons">shuffle</i>
              </button>
              {IsAdmin() && (
                <button className="btn" onClick={update}>
                  <i className="material-icons">cached</i>
                </button>
              )}
            </div>
          </nav>
          <GeneralPopup
            message={[
              <a
                key={'drive_' + state.currentEp}
                id="btn-gdrive"
                className={
                  'btn btn-primary h-auto border-0 m-1' +
                  (state.currentUrl === '' ? ' disabled' : '')
                }
                role="button"
                href={state.currentUrl}
                target="blank"
              >
                Google Drive
              </a>,
              <a
                key={'photo_' + state.currentEp}
                id="btn-gphoto"
                className={
                  'btn btn-primary h-auto border-0 m-1' +
                  (state.currentPhotoUrl === '' ? ' disabled' : '')
                }
                type="button"
                href={state.currentPhotoUrl}
                target="blank"
              >
                Google Photo
              </a>,
            ]}
            show={state.popupFiles}
            setShow={(show) => setState({ ...state, popupFiles: show })}
            canClose={true}
          />
          <GeneralPopup
            show={state.popupLoading}
            message="Loading..."
            canClose={false}
            setShow={(show) => setState({ ...state, popupLoading: show })}
          />
        </div>
      </div>
    </div>
  );
};

export default Conan;
