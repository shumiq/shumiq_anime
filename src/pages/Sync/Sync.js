import React, { useState, useEffect } from 'react';
import { getLocalStorage } from '../../utils/localstorage';
import { onFirebaseDatabaseUpdate } from '../../utils/firebase';

const Sync = () => {
    const [database, setDatabase] = useState(getLocalStorage('database'));
    const [animelist, setAnimeList] = useState(database?.animelist.filter(anime => anime != null));

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
        setAnimeList(db?.animelist.filter(anime => anime != null));
    });

    useEffect(() => { }, [animelist]);


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

                        {animelist.sort((a, b) => {
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
                                <td className="text-center align-middle">{anime.download}</td>
                                <td className="text-center align-middle"></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sync;