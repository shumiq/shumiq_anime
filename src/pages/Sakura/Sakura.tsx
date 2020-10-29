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
  Sakura as SakuraType,
  File,
} from '../../utils/types';

const driveFolderId = '1RGMvXyS9Qmve8i4VMRM3_lgzWzMtJko8';
const photoAlbumId =
  'ACKboXDga5uYAkASW3i4lF-0pS5q5AoNWkT1qK9bGXiKycfhNaLLY_tInT_OZ2QNxSnTr8hyUz84';

const Sakura = (): JSX.Element => {
  const [sakuraList, setSakuraList] = useState<Record<string, SakuraType>>(
    (getLocalStorage('database') as DatabaseType)?.sakura
  );
  const [sakuraRef, setSakuraRef] = useState<
    React.RefObject<HTMLTableRowElement>[]
  >([]);
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db) => {
      setSakuraList(db?.sakura);
    });
  }, []);

  useEffect(() => {
    function UpdateSakuraRef() {
      const ref = [];
      if (sakuraList)
        Object.keys(sakuraList).forEach((key) => {
          ref[key] = createRef();
        });
      setSakuraRef(ref);
    }
    UpdateSakuraRef();
  }, [sakuraList]);

  const showFiles = useCallback((files: File) => {
    const url = files.url ? files.url : '';
    const photoUrl = files.photoUrl ? files.photoUrl : '';
    const photoId = files.photoId ? files.photoId : '';
    const showFilesPopup = (show: boolean) => {
      setPopup(
        <FilesPopup
          driveUrl={url}
          photoUrl={photoUrl}
          photoId={photoId}
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
      const ep = parseInt(file.name.split(' ')[3]);
      const sub = file.name.split(' ')[4].split('.')[0];
      const url =
        'https://drive.google.com/file/d/' + file.id + '/preview?usp=drivesdk';
      const photoUrl = photoFiles.filter((f) => f.filename === file.name)[0]
        ?.productUrl;
      const photoId = photoFiles.filter((f) => f.filename === file.name)[0]?.id;
      if (
        Object.entries(sakuraList).filter(([key, sakura]) => sakura.ep === ep)
          .length > 0
      ) {
        Object.entries(sakuraList)
          .filter(([key, sakura]) => sakura.ep === ep)
          .forEach(([key, sakura]) => {
            sakura.sub[sub] = {
              url: url,
              photoUrl: photoUrl ? photoUrl : null,
              photoId: photoId ? photoId : null,
            };
            Database.update.sakura(key, sakura);
          });
      } else {
        const sakura: SakuraType = {
          sub: {} as Record<string, File>,
          ep: ep,
          name: 'แก้ไข',
        };
        sakura.sub[sub] = {
          url: url,
          photoUrl: photoUrl ? photoUrl : null,
          photoId: photoId ? photoId : null,
        };
        Database.add.sakura(sakura);
      }
    });
    showLoadingPopup(false);
  }, [sakuraList]);

  const randomEp = useCallback(() => {
    const randomKey = Object.keys(sakuraList)[
      Math.floor(Math.random() * Object.keys(sakuraList).length)
    ];
    const currentRef: React.RefObject<HTMLTableRowElement> = sakuraRef[
      randomKey
    ] as React.RefObject<HTMLTableRowElement>;
    if (currentRef) {
      sakuraRef.map((ref) =>
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
  }, [sakuraList, sakuraRef]);

  const showInput = useCallback(
    (key: string) => {
      if (UserDetail.isAdmin()) {
        const name = sakuraList[key]?.name || '';
        const callback = (newName: string) => {
          sakuraList[key].name = newName;
          Database.update.sakura(key, sakuraList[key]);
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
    [sakuraList]
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
                {sakuraList &&
                  Object.entries(sakuraList)
                    .sort((entryA, entryB) => entryA[1].ep - entryB[1].ep)
                    .map(
                      ([key, sakura]) =>
                        sakuraList[key] !== null && (
                          <tr
                            key={key}
                            ref={
                              sakuraRef[key] as React.RefObject<
                                HTMLTableRowElement
                              >
                            }
                            className="table-bordered border-left-0 border-right-0"
                          >
                            <td>{sakuraList[key].ep}</td>
                            <td className="text-left">
                              <span onClick={() => showInput(key)}>
                                {sakuraList[key].name}
                              </span>
                            </td>
                            <td>
                              {Object.keys(sakuraList[key].sub).map(
                                (sub) =>
                                  sakuraList[key].sub[sub]?.url && (
                                    <button
                                      className="btn btn-primary m-1"
                                      onClick={() =>
                                        showFiles(sakuraList[key].sub[sub])
                                      }
                                      key={
                                        sakuraList[key].ep.toString() +
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

export default Sakura;
