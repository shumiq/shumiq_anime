import { Database } from '../../utils/firebase';
import { getLocalStorage } from '../../utils/localstorage';
import AnimeCard from '../../components/Card/AnimeCard';
import Filterbar from '../../components/Filterbar/Filterbar';
import { AnimeFilter, SeasonList } from './Anime.filter';
import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Database as DatabaseType,
  Anime as AnimeType,
} from '../../utils/types';
import queryString from 'query-string';

type TParams = { search: string };

const Anime = (props?: RouteComponentProps<TParams>) => {
  const [animeList, setAnimeList] = useState<(AnimeType | null)[]>(
    (getLocalStorage('database') as DatabaseType).animeList
  );
  const [pageList, setPageList] = useState<AnimeType[]>(AnimeFilter(animeList));
  const [filter, setFilter] = useState({});
  const [popup, setPopup] = useState<string>('');

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setAnimeList(db?.animeList);
    });
  }, []);

  useEffect(() => {
    setPageList(AnimeFilter(animeList, filter));
  }, [animeList, filter]);

  useEffect(() => {
    const params = queryString.parse(props?.location.search || '') as {
      search: string;
    };
    if (params.search) {
      setFilter({
        keyword: params.search,
      });
    }
  }, [props]);

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
            (anime: AnimeType) =>
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

export default withRouter(Anime);
