import React, { useState, createRef, useEffect, useCallback } from 'react';
import { Database } from '../../../utils/firebase';
import { getLocalStorage } from '../../../utils/localstorage';
import GeneralPopup from '../../../components/old/Popup/GeneralPopup';
import UserDetail from '../../../utils/userdetail';
import SynologyApi from '../../../api/synology';
import InputPopup from '../../../components/old/Popup/InputPopup';
import {
  Database as DatabaseType,
  Keyaki as KeyakiType,
} from '../../../utils/types';

const folderPath = 'Keyakitte Kakenai';

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
      const ep = parseInt(file.name.split(' ')[2]);
      const sub = file.name.split(' ')[3].split('.')[0];
      const url = SynologyApi.getDownloadURL(file.path);
      if (
        Object.entries(keyakiList).filter(([key, keyaki]) => keyaki.ep === ep)
          .length > 0
      ) {
        Object.entries(keyakiList)
          .filter(([key, keyaki]) => keyaki.ep === ep)
          .forEach(([key, keyaki]) => {
            keyaki.sub[sub] = url;
            Database.update.keyaki(key, keyaki);
          });
      } else {
        const keyaki: KeyakiType = {
          sub: {} as Record<string, string>,
          ep: ep,
          name: 'แก้ไข',
        };
        keyaki.sub[sub] = url;
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
                            <td className="align-middle">
                              {keyakiList[key].ep}
                            </td>
                            <td className="text-left align-middle">
                              <span onClick={() => showInput(key)}>
                                {keyakiList[key].name}
                              </span>
                            </td>
                            <td>
                              {Object.keys(keyakiList[key].sub).map(
                                (sub) =>
                                  keyakiList[key].sub[sub] && (
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
