import React, { useState, useEffect } from 'react';
import './Home.css';
import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';

const Home = () => {
    const [database, setDatabase] = useState(JSON.parse(getLocalStorage('database')));

    onFirebaseDatabaseUpdate(db => {
        setDatabase(db);
    });

    useEffect(() => { }, [database]);

    return (
        <div className="Home">
            {database?.animelist?.map(anime =>
                anime !== null &&
                (<p key={anime?.key}>{anime?.title}</p>)
            )}
        </div>
    );
};

export default Home;
