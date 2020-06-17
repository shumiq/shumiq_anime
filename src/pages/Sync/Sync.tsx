import React, { useState, useEffect, useCallback } from 'react';
import { getLocalStorage } from '../../utils/localstorage';
import { Database } from '../../utils/firebase';
import GooglePhotoApi from '../../api/googlephoto';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import GoogleDriveApi from '../../api/googledrive';
import {
  Anime,
  Database as DatabaseType,
  GooglePhotoAlbumResponse,
} from '../../utils/types';

const Sync = (): JSX.Element => {
  const [animeList, setAnimeList] = useState<Record<string, Anime>>(
    (getLocalStorage('database') as DatabaseType).animeList
  );
  const [albumList, setAlbumList] = useState<
    Record<string, GooglePhotoAlbumResponse>
  >({});
  const [nextPageToken, setNextPageToken] = useState('');
  const [popup, setPopup] = useState<JSX.Element | string>('');

  useEffect(() => {
    Database.subscribe((db) => {
      setAnimeList(db.animeList);
    });
    const fetchAlbums = async () => {
      setPopup(
        <GeneralPopup show={true} message="Loading..." canClose={false} />
      );
      const response = await GooglePhotoApi.getAlbums('');
      const albums: Record<string, GooglePhotoAlbumResponse> = {};
      response.albums.forEach((album) => {
        if (album?.id) albums[album.id] = album;
      });
      setAlbumList(albums);
      setNextPageToken(response.nextPageToken || '');
      setPopup(
        <GeneralPopup show={false} message="Loading..." canClose={false} />
      );
    };
    void fetchAlbums();
  }, []);

  const getAlbums = useCallback(
    async (all = false) => {
      setPopup(
        <GeneralPopup show={true} message="Loading..." canClose={false} />
      );
      const response = (await all)
        ? await GooglePhotoApi.getAllAlbums(nextPageToken)
        : await GooglePhotoApi.getAlbums(nextPageToken);
      const albums = albumList;
      response.albums.forEach((album) => {
        if (album?.id) albums[album.id] = album;
      });
      setAlbumList(albums);
      setNextPageToken(response.nextPageToken || '');
      setPopup(
        <GeneralPopup show={false} message="Loading..." canClose={false} />
      );
    },
    [albumList, nextPageToken]
  );

  const unsync = useCallback((anime: Anime) => {
    if (window.confirm('Do you want to unsync "' + anime.title + '" ?')) {
      anime.gphotoid = '';
      Database.update.anime(anime.key, anime);
    }
  }, []);

  const update = useCallback(
    async (anime: Anime) => {
      setPopup(
        <GeneralPopup show={true} message="Loading..." canClose={false} />
      );
      anime.gdriveid = await GoogleDriveApi.getPrivateFolderId(anime);
      anime.gdriveid_public = await GoogleDriveApi.getPublicFolderId(anime);
      const photo_medias = await GooglePhotoApi.getMedias(anime.gphotoid);
      const drive_upload = await GoogleDriveApi.getUploadFiles();
      photo_medias.forEach((media) => {
        const file = drive_upload.filter(
          (file) => file.name === media.filename
        )[0];
        if (file?.id) {
          void GoogleDriveApi.moveUploadFile(file.id, anime.gdriveid);
        }
      });
      anime.download = parseInt(albumList[anime.gphotoid].mediaItemsCount);
      Database.update.anime(anime.key, anime);
      setPopup(
        <GeneralPopup show={false} message="Loading..." canClose={false} />
      );
    },
    [albumList]
  );

  const sync = useCallback(
    (anime: Anime) => {
      anime.gphotoid = Object.entries(albumList).filter(
        (entry) => entry[1].title === '[Anime] ' + anime.title
      )[0]?.[0];
      Database.update.anime(anime.key, anime);
    },
    [albumList]
  );

  return (
    <div className="Sync">
      <div
        className="container text-center"
        style={{ marginTop: '80px', marginBottom: '80px' }}
      >
        <table className="table table-hover">
          <thead>
            <tr>
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
                (entries) =>
                  entries[1] !== null && (
                    <tr key={entries[1].key} className="row-anime">
                      <td className="text-center align-middle">
                        <a href={entries[1].url} target="blank">
                          <img
                            src={entries[1].cover_url}
                            style={{ height: '50px' }}
                            alt="cover"
                          />
                        </a>
                      </td>
                      <td className="text-left align-middle">
                        {entries[1].title}
                      </td>
                      <td className="text-center align-middle">
                        {entries[1].download}
                        {albumList[entries[1].gphotoid] &&
                          '/' + albumList[entries[1].gphotoid]?.mediaItemsCount}
                      </td>
                      <td className="text-center align-middle">
                        {entries[1].gphotoid &&
                          albumList[entries[1].gphotoid] &&
                          entries[1].download.toString() !==
                            albumList[
                              entries[1].gphotoid
                            ]?.mediaItemsCount.toString() &&
                          !entries[1].title.includes('Conan') && (
                            <button
                              id="btn-update"
                              type="button"
                              className="btn btn-success mx-1 col"
                              onClick={() => update(entries[1])}
                            >
                              Update
                            </button>
                          )}
                        {entries[1].gphotoid && (
                          <button
                            id="btn-unsync"
                            type="button"
                            className="btn btn-danger mx-1 col"
                            onClick={() => unsync(entries[1])}
                          >
                            Unsync
                          </button>
                        )}
                        {!entries[1].gphotoid &&
                          Object.entries(albumList).some(
                            (entry) =>
                              entry[1].title === '[Anime] ' + entries[1].title
                          ) && (
                            <button
                              id="btn-sync"
                              type="button"
                              className="btn btn-primary mx-1 col"
                              onClick={() => sync(entries[1])}
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

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
          <div className="w-100 text-center">
            <a
              className="btn btn-primary m-2"
              href="https://photos.google.com/search/_tra_"
            >
              Recent Files
            </a>
            {nextPageToken !== null && (
              <span>
                <button
                  id="btn-load-more"
                  type="button"
                  className="btn btn-primary m-2"
                  onClick={() => getAlbums(false)}
                >
                  Load more..
                </button>
                <button
                  id="btn-load-all"
                  type="button"
                  className="btn btn-primary m-2"
                  onClick={() => getAlbums(true)}
                >
                  Load all
                </button>
              </span>
            )}
            {nextPageToken === null && (
              <span>
                <button
                  id="btn-load-more"
                  type="button"
                  className="btn btn-secondary m-2"
                  disabled
                >
                  Load more..
                </button>
                <button
                  id="btn-load-all"
                  type="button"
                  className="btn btn-secondary m-2"
                  disabled
                >
                  Load all
                </button>
              </span>
            )}
          </div>
        </nav>
        {popup}
      </div>
    </div>
  );
};

export default Sync;
