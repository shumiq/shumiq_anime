import React, { useState, useEffect } from 'react';
import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import AnimeCard from '../../components/Card/AnimeCard'
import { AnimeFilter } from './Anime.filter'

const Anime = () => {
    const [database, setDatabase] = useState(JSON.parse(getLocalStorage('database')));
    const [animelist, setAnimeList] = useState(database?.animelist);
    const [currentPageAnimeList, setCurrentPageAnimeList] = useState(AnimeFilter(animelist));
    const [filter, setFilter] = useState({});

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
        setAnimeList(db?.animelist);
    });

    useEffect(() => {
        if (animelist) setCurrentPageAnimeList(AnimeFilter(animelist, filter));
    }, [animelist, filter]);

    return (
        <div className="Anime">
            <div className="container p-0 my-5">
                <div className="row text-center w-100 m-0">
                    {currentPageAnimeList.map(anime =>
                        anime !== null &&
                        (< AnimeCard anime={anime} key={anime?.key} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Anime;
