import React, { useState } from 'react';
import { getLocalStorage } from '../../utils/localstorage';
import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import PhotoApi from '../../api/photo';
import GeneralPopup from '../../components/Popup/GeneralPopup';

const Sync = () => {
    const [database, setDatabase] = useState(getLocalStorage('database'));
    const [animeList, setAnimeList] = useState(database?.animelist.filter(anime => anime != null));
    const [albumList, setAlbumList] = useState([]);
    const [nextPageToken, setNextPageToken] = useState('');
    const [loadingPopup, setLoadingPopup] = useState(false);

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
        setAnimeList(db?.animelist.filter(anime => anime != null));
    });

    const getAlbums = async (all) => {
        setLoadingPopup(true);
        const response = await all ? await PhotoApi.getAllAlbums(nextPageToken) : await PhotoApi.getAlbums(nextPageToken);
        setLoadingPopup(false);
        let albums = albumList;
        response.albums.forEach(album => {
            if (album?.id) albums[album.id] = album;
        });
        setAlbumList(albums);
        setNextPageToken(response.nextPageToken);
        setAnimeList(animeList);
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
                            <tr key={anime.key}>
                                <td className="text-center align-middle">
                                    <a href={anime.url} target="blank">
                                        <img src={anime.cover_url} style={{ height: '50px' }} alt="cover" />
                                    </a>
                                </td>
                                <td className="text-left align-middle">{anime.title}</td>
                                <td className="text-center align-middle">{anime.download}{albumList[anime.gphotoid] && '/' + albumList[anime.gphotoid]?.mediaItemsCount}</td>
                                <td className="text-center align-middle"></td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
                    <div className="w-100 text-center">
                        <a className="btn btn-primary m-2" href="https://photos.google.com/search/_tra_">Recent Files</a>
                        {nextPageToken !== null &&
                            <span>
                                <button type="button" className="btn btn-primary m-2" onClick={() => getAlbums(false)}>Load more..</button>
                                <button type="button" className="btn btn-primary m-2" onClick={() => getAlbums(true)}>Load all</button>
                            </span>
                        }
                        {nextPageToken === null &&
                            <span>
                                <button type="button" className="btn btn-secondary m-2" disabled>Load more..</button>
                                <button type="button" className="btn btn-secondary m-2" disabled>Load all</button>
                            </span>
                        }
                    </div>
                </nav>
                <GeneralPopup show={loadingPopup} setShow={setLoadingPopup} message='Loading...' />
            </div>
        </div>
    );
};

export default Sync;