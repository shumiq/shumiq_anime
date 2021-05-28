import React, { useState, useEffect, useCallback } from 'react';
import { getLocalStorage } from '../../../utils/localstorage';
import { Database } from '../../../utils/firebase';
import GeneralPopup from '../../../components/old/Popup/GeneralPopup';
import { Anime, Database as DatabaseType } from '../../../utils/types';
import SynologyApi from '../../../api/synology';
import { ListResponse } from '../../../models/SynologyApiModel';

const Sync = (): JSX.Element => {
  const [animeList, setAnimeList] = useState<Record<string, Anime>>(
    (getLocalStorage('database') as DatabaseType).anime
  );
  const [folderList, setFolderList] = useState<ListResponse>({
    data: {},
    success: false,
  });
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db) => {
      setAnimeList(db.anime);
    });
    const fetchFolder = async () => {
      setPopup(
        <GeneralPopup
          show={true}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
      const folders = await SynologyApi.list('Anime', false, true);
      setFolderList(folders);
      setPopup(
        <GeneralPopup
          show={false}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
    };
    void fetchFolder();
  }, []);

  const unSync = useCallback((key: string, anime: Anime) => {
    if (window.confirm('Do you want to unsync "' + anime.title + '" ?')) {
      anime.path = '';
      Database.update.anime(key, anime);
    }
  }, []);

  const update = useCallback(
    async (key: string, anime: Anime) => {
      setPopup(
        <GeneralPopup
          show={true}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
      const folder = await SynologyApi.list(`Anime${anime.path}`);
      anime.download = folder.data.total || 0;
      anime.size =
        folderList.data.files?.find((folder) => folder.name === anime.title)
          ?.additional?.size || 0;
      Database.update.anime(key, anime);
      setPopup(
        <GeneralPopup
          show={false}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
    },
    [folderList]
  );

  const sync = useCallback(
    (key: string, anime: Anime) => {
      setPopup(
        <GeneralPopup
          show={true}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
      const folder = folderList.data.files?.find(
        (folder) => folder.name === anime.title
      );
      anime.path = '';
      if (folder?.name) anime.path = folder.name;
      Database.update.anime(key, anime);
      setPopup(
        <GeneralPopup
          show={false}
          message="Loading..."
          canClose={false}
          onClose={() => setPopup('')}
        />
      );
    },
    [folderList]
  );

  return (
    <div className="Sync">
      <div
        className="container text-center"
        style={{ marginTop: '80px', marginBottom: '80px' }}
      >
        <div
          className="w-100 m-0 p-0"
          style={{ maxWidth: '100%', overflowX: 'auto' }}
        >
          <table className="table table-hover mt-5 table-borderless">
            <thead>
              <tr className="table-bordered">
                <th></th>
                <th>Title</th>
                <th>Download</th>
                <th>Sync</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(animeList)
                .sort((entriesA, entriesB) => {
                  const a = entriesA[1];
                  const b = entriesB[1];
                  if (
                    b.year * 10 +
                      (b.season % 10) -
                      (a.year * 10 + (a.season % 10)) ===
                    0
                  )
                    return a.title < b.title ? -1 : 1;
                  else
                    return (
                      b.year * 10 +
                      (b.season % 10) -
                      (a.year * 10 + (a.season % 10))
                    );
                })
                .map(
                  ([key, anime]) =>
                    anime !== null && (
                      <tr
                        key={key}
                        className="row-anime table-bordered border-left-0 border-right-0"
                      >
                        <td className="text-center align-middle">
                          <img
                            src={anime.cover_url}
                            style={{ height: '50px' }}
                            alt="cover"
                          />
                        </td>
                        <td className="text-left align-middle">
                          {anime.title}
                        </td>
                        <td className="text-center align-middle">
                          {anime.download}
                        </td>
                        <td className="text-center align-middle">
                          {(anime.path || '').length > 0 &&
                            (folderList.data.files?.find(
                              (folder) => folder.name === anime.title
                            )?.additional?.size || 0) > anime.size && (
                              <button
                                id="btn-update"
                                type="button"
                                className="btn btn-success m-1"
                                onClick={() => update(key, anime)}
                              >
                                Update
                              </button>
                            )}
                          {(anime.path || '').length > 0 && anime.size > 0 && (
                            <button
                              id="btn-unsync"
                              type="button"
                              className="btn btn-danger m-1"
                              onClick={() => unSync(key, anime)}
                            >
                              Unsync
                            </button>
                          )}
                          {(anime.path || '') === '' &&
                            folderList.data.files?.find(
                              (folder) => folder.name === anime.title
                            ) && (
                              <button
                                id="btn-sync"
                                type="button"
                                className="btn btn-primary m-1"
                                onClick={() => sync(key, anime)}
                              >
                                Sync
                              </button>
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
            <button
              id="btn-load-more"
              type="button"
              className="btn btn-secondary m-2"
              disabled
            >
              Update all
            </button>
            <button
              id="btn-load-all"
              type="button"
              className="btn btn-secondary m-2"
              disabled
            >
              Sync all
            </button>
          </div>
        </nav>
        {popup}
      </div>
    </div>
  );
};

export default Sync;
