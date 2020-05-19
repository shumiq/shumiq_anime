import { onFirebaseDatabaseUpdate } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import AnimeCard from '../../components/Card/AnimeCard';
import Filterbar from '../../components/Filterbar/Filterbar';
import { AnimeFilter, SeasonList } from './Anime.filter';
import React, { useState } from 'react';

const Anime = () => {
  const [state, setState] = useState({
    animelist: getLocalStorage('database')?.animelist,
    pagelist: AnimeFilter(getLocalStorage('database')?.animelist),
    filter: {},
  });

  onFirebaseDatabaseUpdate((db) => {
    setState({
      ...state,
      animelist: db?.animelist,
      pagelist: AnimeFilter(db?.animelist, state.filter),
    });
  });

  const updateFilter = (newFilter) => {
    setState({
      ...state,
      filter: newFilter,
      pagelist: AnimeFilter(state.animelist, state.filter),
    });
  };

  return (
    <div className="Anime">
      <div className="container p-0 my-5">
        <div className="row text-center w-100 m-0">
          {state.pagelist.map(
            (anime) =>
              anime !== null && <AnimeCard anime={anime} key={anime?.key} />
          )}
        </div>
      </div>
      {state.animelist && SeasonList(state.animelist) && (
        <Filterbar
          filter={state.filter}
          seasonlist={SeasonList(state.animelist)}
          setFilter={updateFilter}
        />
      )}
    </div>
  );
};

export default Anime;
