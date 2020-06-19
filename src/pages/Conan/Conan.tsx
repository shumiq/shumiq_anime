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
  Conan as ConanType,
  File,
} from '../../utils/types';

const driveFolderId = '1ZXug0hPb-_ylKa45LX7H42cLLTvLiBdy';
const photoAlbumId =
  'ACKboXA-SW1-hje13C1evPH_HlgHlP9UasTb7u5ECLT2ds1ufDzcH9gDrL-XXAT3_mveyhNr_ELI';

const Conan = (): JSX.Element => {
  const [conanList, setConanList] = useState<Record<string, ConanType>>(
    (getLocalStorage('database') as DatabaseType)?.conanList
  );
  const [conanRef, setConanRef] = useState<
    React.RefObject<HTMLTableRowElement>[]
  >([]);
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setConanList(db?.conanList);
    });
  }, []);

  useEffect(() => {
    function UpdateConanRef() {
      const ref = [];
      if (conanList)
        Object.keys(conanList).forEach((cs) => {
          ref[cs] = createRef();
        });
      setConanRef(ref);
    }
    UpdateConanRef();
  }, [conanList]);

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
    const newConanList = JSON.parse(JSON.stringify(conanList)) as Record<
      string,
      ConanType
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
      const cs = parseInt(file.name.split(' ')[1]);
      const ep = parseInt(file.name.split(' ')[3].split('.')[0]);
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      if (newConanList['case' + cs.toString()]) {
        newConanList['case' + cs.toString()].episodes[ep] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      } else {
        newConanList['case' + cs.toString()] = {
          episodes: {} as Record<number, File>,
          case: cs,
          name: 'แก้ไข',
        };
        newConanList['case' + cs.toString()].episodes[ep] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
        };
      }
    });
    Database.update.conan(newConanList);
    showLoadingPopup(false);
  }, [conanList]);

  const randomEp = useCallback(() => {
    let ep = 0;
    while (ep === 0 || conanList['case' + ep.toString()] === null) {
      ep = Math.floor(Math.random() * Object.keys(conanList).length);
    }
    const currentRef: React.RefObject<HTMLTableRowElement> = conanRef[
      'case' + ep.toString()
    ] as React.RefObject<HTMLTableRowElement>;
    if (currentRef.current) {
      conanRef.map((ref) =>
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
  }, [conanList, conanRef]);

  const showInput = useCallback(
    (key: string) => {
      if (UserDetail.isAdmin()) {
        const name = conanList[key]?.name || '';
        const callback = (newName: string) => {
          const newList = JSON.parse(JSON.stringify(conanList)) as Record<
            string,
            ConanType
          >;
          newList[key].name = newName;
          Database.update.conan(newList);
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
                Object.entries(conanList)
                  .sort((entryA, entryB) => entryA[1].case - entryB[1].case)
                  .map(
                    ([key, conan]) =>
                      conanList[key] !== null && (
                        <tr
                          key={key}
                          ref={
                            conanRef[key] as React.RefObject<
                              HTMLTableRowElement
                            >
                          }
                        >
                          <td>{conanList[key].case}</td>
                          <td className="text-left">
                            <span onClick={() => showInput(key)}>
                              {conanList[key].name}
                            </span>
                          </td>
                          <td>
                            {Object.keys(conanList[key].episodes).map(
                              (episode: string) =>
                                conanList[key].episodes[parseInt(episode)]
                                  ?.url && (
                                  <button
                                    className="btn btn-primary m-1"
                                    onClick={() =>
                                      showFiles(
                                        conanList[key].episodes[episode]
                                      )
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

export default Conan;
