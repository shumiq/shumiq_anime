import React, { useState, createRef, useEffect, useCallback } from 'react';
import { Database } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import UserDetail from '../../utils/userdetail';
import SynologyApi from '../../api/synology';
import InputPopup from '../../components/Popup/InputPopup';
import {
  Database as DatabaseType,
  Sakura as SakuraType,
} from '../../utils/types';

const folderPath = 'Soko Magattara Sakurazaka';

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
      const ep = parseInt(file.name.split(' ')[3]);
      const sub = file.name.split(' ')[4].split('.')[0];
      const url = SynologyApi.getDownloadURL(file.path);
      if (
        Object.entries(sakuraList).filter(([key, sakura]) => sakura.ep === ep)
          .length > 0
      ) {
        Object.entries(sakuraList)
          .filter(([key, sakura]) => sakura.ep === ep)
          .forEach(([key, sakura]) => {
            sakura.sub[sub] = url;
            Database.update.sakura(key, sakura);
          });
      } else {
        const sakura: SakuraType = {
          sub: {} as Record<string, string>,
          ep: ep,
          name: 'แก้ไข',
        };
        sakura.sub[sub] = url;
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
                            <td className="align-middle">
                              {sakuraList[key].ep}
                            </td>
                            <td className="text-left align-middle">
                              <span onClick={() => showInput(key)}>
                                {sakuraList[key].name}
                              </span>
                            </td>
                            <td>
                              {Object.keys(sakuraList[key].sub).map(
                                (sub) =>
                                  sakuraList[key].sub[sub] && (
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
