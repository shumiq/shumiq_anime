import React, { useState, createRef, useEffect, useCallback } from 'react';
import { Database } from '../../../services/Firebase/Firebase';
import { getLocalStorage } from '../../../utils/LocalStorage/LocalStorage';
import GeneralPopup from '../../../components/old/Popup/GeneralPopup';
import UserDetail from '../../../services/UserDetail/UserDetail';
import SynologyApi from '../../../services/Synology/Synology';
import InputPopup from '../../../components/old/Popup/InputPopup';
import {
  Database as DatabaseType,
  Conan as ConanType,
} from '../../../models/Type';

const folderPath = 'Anime/Detective Conan';

const Conan = (): JSX.Element => {
  const [conanList, setConanList] = useState<Record<string, ConanType>>(
    (getLocalStorage('database') as DatabaseType)?.conan
  );
  const [conanRef, setConanRef] = useState<
    React.RefObject<HTMLTableRowElement>[]
  >([]);
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setConanList(db?.conan);
    });
  }, []);

  useEffect(() => {
    function UpdateConanRef() {
      const ref = [];
      if (conanList)
        Object.keys(conanList).forEach((key) => {
          ref[key] = createRef();
        });
      setConanRef(ref);
    }
    UpdateConanRef();
  }, [conanList]);

  const showFiles = useCallback((file: string) => {
    window.open(SynologyApi.getAuthDownloadURL(file));
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
    const files = await SynologyApi.list(folderPath);
    if (!files.data.files) return;
    files.data.files.forEach((file) => {
      const cs = parseInt(file.name.split(' ')[1]);
      const ep = parseInt(file.name.split(' ')[3].split('.')[0]);
      const url = SynologyApi.getDownloadURL(file.path);
      if (
        Object.entries(conanList).filter(([key, conan]) => conan.case === cs)
          .length > 0
      ) {
        Object.entries(conanList)
          .filter(([key, conan]) => conan.case === cs)
          .forEach(([key, conan]) => {
            conan.episodes[ep] = url;
            Database.update.conan(key, conan);
          });
      } else {
        const conan: ConanType = {
          episodes: {} as Record<number, string>,
          case: cs,
          name: 'แก้ไข',
        };
        conan.episodes[ep] = url;
        Database.add.conan(conan);
      }
    });
    showLoadingPopup(false);
  }, [conanList]);

  const randomEp = useCallback(() => {
    const randomKey = Object.keys(conanList)[
      Math.floor(Math.random() * Object.keys(conanList).length)
    ];
    const currentRef: React.RefObject<HTMLTableRowElement> = conanRef[
      randomKey
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
          conanList[key].name = newName;
          Database.update.conan(key, conanList[key]);
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
    [conanList]
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
                  <th className="text-center">Case</th>
                  <th className="text-left">Name</th>
                  <th className="text-left"></th>
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
                            className="table-bordered border-left-0 border-right-0"
                          >
                            <td className="align-middle">
                              {conanList[key].case}
                            </td>
                            <td className="text-left align-middle">
                              <span onClick={() => showInput(key)}>
                                {conanList[key].name}
                              </span>
                            </td>
                            <td>
                              {Object.keys(conanList[key].episodes).map(
                                (episode: string) =>
                                  conanList[key].episodes[
                                    parseInt(episode)
                                  ] && (
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
          </div>

          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
            <div className="w-100 text-center">
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
