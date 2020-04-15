import React, { useState, useEffect } from 'react';
import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import AnimeCard from '../../components/Card/AnimeCard'
import { AnimeFilter } from '../../components/Card/AnimeCard.filter'

const Home = () => {
    const [database, setDatabase] = useState(JSON.parse(getLocalStorage('database')));
    const [animelist, setAnimeList] = useState(database?.animelist);
    const [currentPageAnimeList, setCurrentPageAnimeList] = useState(AnimeFilter(animelist));

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
        setAnimeList(db?.animelist);
    });

    useEffect(() => {
        if (animelist) setCurrentPageAnimeList(AnimeFilter(animelist));
    }, [animelist]);

    return (
        <div className="Home">
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

export default Home;
