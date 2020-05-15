import React, { useState } from 'react';
import { getLocalStorage } from '../../utils/localstorage';
import { onFirebaseDatabaseUpdate, SaveAnime } from '../../utils/firebase';
import GooglePhotoApi from '../../api/googlephoto';
import GeneralPopup from '../../components/Popup/GeneralPopup';
import { IsAdmin, getAccessToken } from '../../utils/userdetail';
import GoogleDriveApi from '../../api/googledrive';

const Sync = () => {
    const [database, setDatabase] = useState(getLocalStorage('database'));
    const [animeList, setAnimeList] = useState(database?.animelist.filter(anime => anime != null));
    const [albumList, setAlbumList] = useState([]);
    const [nextPageToken, setNextPageToken] = useState('');
    const [loadingPopup, setLoadingPopup] = useState(false);

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
        setAnimeList(db?.animelist.filter(anime => anime != null));
        if (IsAdmin() && typeof getAccessToken() === 'string' && nextPageToken === '') {
            getAlbums();
        }
    });

    const getAlbums = async (all = false) => {
        setLoadingPopup(true);
        const response = await all ? await GooglePhotoApi.getAllAlbums(nextPageToken) : await GooglePhotoApi.getAlbums(nextPageToken);
        setLoadingPopup(false);
        let albums = albumList;
        response.albums.forEach(album => {
            if (album?.id) albums[album.id] = album;
        });
        setAlbumList(albums);
        setNextPageToken(response.nextPageToken);
        setAnimeList(animeList);
    }

    const unsync = (anime) => {

    }

    const update = async (anime) => {
        setLoadingPopup(true);
        anime.gdriveid = await GoogleDriveApi.getPrivateFolderId(anime);
        anime.gdriveid_public = await GoogleDriveApi.getPublicFolderId(anime);
        const photo_medias = await GooglePhotoApi.getMedias(anime.gphotoid);
        const drive_upload = await GoogleDriveApi.getUploadFiles();
        await photo_medias.forEach(async media => {
            const file = drive_upload.filter(file => file.name === media.filename)[0];
            if (file?.id) {
                await GoogleDriveApi.moveUploadFile(file.id, anime.gdriveid);
            }
        });
        anime.download = photo_medias.length;
        SaveAnime(anime.key, anime);
        setLoadingPopup(false);
    }

    return (
        <div className="Sync">
            <div className="container text-center" style={{ marginTop: '80px', marginBottom: '80px' }}>
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

                        {animeList.sort((a, b) => {
                            if ((b.year * 10 + b.season % 10) - (a.year * 10 + a.season % 10) === 0)
                                return a.title < b.title ? -1 : 1;
                            else
                                return (b.year * 10 + b.season % 10) - (a.year * 10 + a.season % 10);
                        }).map(anime =>
                            anime !== null &&
                            <tr key={anime.key} className="row-anime">
                                <td className="text-center align-middle">
                                    <a href={anime.url} target="blank">
                                        <img src={anime.cover_url} style={{ height: '50px' }} alt="cover" />
                                    </a>
                                </td>
                                <td className="text-left align-middle">{anime.title}</td>
                                <td className="text-center align-middle">{anime.download}{albumList[anime.gphotoid] && '/' + albumList[anime.gphotoid]?.mediaItemsCount}</td>
                                <td className="text-center align-middle">
                                    {anime.gphotoid && albumList[anime.gphotoid] && anime.download.toString() !== albumList[anime.gphotoid]?.mediaItemsCount.toString() && !anime.title.includes("Conan") && 
                                        <button id='btn-update' type="button col" className="btn btn-success mx-1" onClick={() => update(anime)}>Update</button>
                                    }
                                    {anime.gphotoid &&
                                        <button id='btn-unsync' type="button col" className="btn btn-danger mx-1" onClick={() => unsync(anime)}>Unsync</button>
                                    }
                                    {!anime.gphotoid && 
                                        <p className="m-0 p-0">Not found</p>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
                    <div className="w-100 text-center">
                        <a className="btn btn-primary m-2" href="https://photos.google.com/search/_tra_">Recent Files</a>
                        {nextPageToken !== null &&
                            <span>
                                <button id='btn-load-more' type="button" className="btn btn-primary m-2" onClick={() => getAlbums(false)}>Load more..</button>
                                <button id='btn-load-all' type="button" className="btn btn-primary m-2" onClick={() => getAlbums(true)}>Load all</button>
                            </span>
                        }
                        {nextPageToken === null &&
                            <span>
                                <button id='btn-load-more' type="button" className="btn btn-secondary m-2" disabled>Load more..</button>
                                <button id='btn-load-all' type="button" className="btn btn-secondary m-2" disabled>Load all</button>
                            </span>
                        }
                    </div>
                </nav>
                <GeneralPopup show={loadingPopup} message='Loading...' />
            </div>
        </div>
    );
};

export default Sync;