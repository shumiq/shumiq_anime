import { getLocalStorage } from '../../utils/localstorage';
import { Database } from '../../utils/firebase';
import GooglePhotoApi from '../../api/googlephoto';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import GoogleDriveApi from '../../api/googledrive';
import React, { useState, useEffect, useCallback } from 'react';

const Sync = () => {
  const [animeList, setAnimeList] = useState(
    getLocalStorage('database')?.animeList?.filter((anime) => anime != null)
  );
  const [albumList, setAlbumList] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [popup, setPopup] = useState('');

  useEffect(() => {
    Database.subscribe((db) => {
      setAnimeList(db?.animeList.filter((anime) => anime != null));
    });
    const fetchAlbums = async () => {
      setPopup(
        <GeneralPopup show={true} message="Loading..." canClose={false} />
      );
      const response = await GooglePhotoApi.getAlbums('');
      let albums = [];
      response.albums.forEach((album) => {
        if (album?.id) albums[album.id] = album;
      });
      setAlbumList(albums);
      setNextPageToken(response.nextPageToken);
      setPopup(
        <GeneralPopup show={false} message="Loading..." canClose={false} />
      );
    };
    fetchAlbums();
  }, []);

  const getAlbums = useCallback(
    async (all = false) => {
      setPopup(
        <GeneralPopup show={true} message="Loading..." canClose={false} />
      );
      const response = (await all)
        ? await GooglePhotoApi.getAllAlbums(nextPageToken)
        : await GooglePhotoApi.getAlbums(nextPageToken);
      let albums = albumList;
      response.albums.forEach((album) => {
        if (album?.id) albums[album.id] = album;
      });
      setAlbumList(albums);
      setNextPageToken(response.nextPageToken);
      setPopup(
        <GeneralPopup show={false} message="Loading..." canClose={false} />
      );
    },
    [albumList, nextPageToken]
  );

  const unsync = useCallback((anime) => {
    if (window.confirm('Do you want to unsync "' + anime.title + '" ?')) {
      anime.gphotoid = null;
      Database.update.anime(anime.key, anime);
    }
  }, []);

  const update = useCallback(
    async (anime) => {
      setPopup(
        <GeneralPopup show={true} message="Loading..." canClose={false} />
      );
      anime.gdriveid = await GoogleDriveApi.getPrivateFolderId(anime);
      anime.gdriveid_public = await GoogleDriveApi.getPublicFolderId(anime);
      const photo_medias = await GooglePhotoApi.getMedias(anime.gphotoid);
      const drive_upload = await GoogleDriveApi.getUploadFiles();
      await photo_medias.forEach(async (media) => {
        const file = drive_upload.filter(
          (file) => file.name === media.filename
        )[0];
        if (file?.id) {
          await GoogleDriveApi.moveUploadFile(file.id, anime.gdriveid);
        }
      });
      anime.download = albumList[anime.gphotoid].mediaItemsCount;
      Database.update.anime(anime.key, anime);
      setPopup(
        <GeneralPopup show={false} message="Loading..." canClose={false} />
      );
    },
    [albumList]
  );

  const sync = useCallback(
    async (anime) => {
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
            {animeList
              .sort((a, b) => {
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
                (anime) =>
                  anime !== null && (
                    <tr key={anime.key} className="row-anime">
                      <td className="text-center align-middle">
                        <a href={anime.url} target="blank">
                          <img
                            src={anime.cover_url}
                            style={{ height: '50px' }}
                            alt="cover"
                          />
                        </a>
                      </td>
                      <td className="text-left align-middle">{anime.title}</td>
                      <td className="text-center align-middle">
                        {anime.download}
                        {albumList[anime.gphotoid] &&
                          '/' + albumList[anime.gphotoid]?.mediaItemsCount}
                      </td>
                      <td className="text-center align-middle">
                        {anime.gphotoid &&
                          albumList[anime.gphotoid] &&
                          anime.download.toString() !==
                            albumList[
                              anime.gphotoid
                            ]?.mediaItemsCount.toString() &&
                          !anime.title.includes('Conan') && (
                            <button
                              id="btn-update"
                              type="button col"
                              className="btn btn-success mx-1"
                              onClick={() => update(anime)}
                            >
                              Update
                            </button>
                          )}
                        {anime.gphotoid && (
                          <button
                            id="btn-unsync"
                            type="button col"
                            className="btn btn-danger mx-1"
                            onClick={() => unsync(anime)}
                          >
                            Unsync
                          </button>
                        )}
                        {!anime.gphotoid &&
                          Object.entries(albumList).some(
                            (entry) =>
                              entry[1].title === '[Anime] ' + anime.title
                          ) && (
                            <button
                              id="btn-sync"
                              type="button col"
                              className="btn btn-primary mx-1"
                              onClick={() => sync(anime)}
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
