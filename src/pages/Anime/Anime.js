import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import AnimeCard from '../../components/Card/AnimeCard';
import Filterbar from '../../components/Filterbar/Filterbar';
import { AnimeFilter, SeasonList } from './Anime.filter';
import React, { useState, useEffect, useCallback } from 'react';

const Anime = () => {
  const [animeList, setAnimeList] = useState(
    getLocalStorage('database')?.animeList
  );
  const [pageList, setPageList] = useState(AnimeFilter(animeList));
  const [filter, setFilter] = useState({});
  const [popup, setPopup] = useState('');

  useEffect(() => {
    onFirebaseDatabaseUpdate((db) => {
      setAnimeList(db?.animeList);
    });
  }, []);

  useEffect(() => {
    setPageList(AnimeFilter(animeList, filter));
  }, [animeList, filter]);

  const updateFilter = useCallback(
    (newFilter) => {
      setFilter(newFilter);
      setPageList(AnimeFilter(animeList, newFilter));
    },
    [animeList]
  );

  return (
    <div className="Anime">
      <div className="container p-0 my-5">
        <div className="row text-center w-100 m-0">
          {pageList.map(
            (anime) =>
              anime !== null && (
                <AnimeCard anime={anime} key={anime?.key} setPopup={setPopup} />
              )
          )}
        </div>
      </div>
      {animeList && SeasonList(animeList) && (
        <Filterbar
          filter={filter}
          seasonlist={SeasonList(animeList)}
          setFilter={updateFilter}
        />
      )}
      {popup}
    </div>
  );
};

export default Anime;
