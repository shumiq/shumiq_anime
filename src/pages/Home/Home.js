import React, { useState, useEffect } from 'react';
import './Home.css';
import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import AnimeCard from '../../components/Card/AnimeCard'

const Home = () => {
    const [database, setDatabase] = useState(JSON.parse(getLocalStorage('database')));

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
    });

    useEffect(() => { }, [database]);

    return (
        <div className="Home">
            <div className="container p-0 my-5">
                <div className="row text-center w-100 m-0">
                    {database?.animelist?.map(anime =>
                        anime !== null &&
                        (< AnimeCard anime={anime} key={anime?.key} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
