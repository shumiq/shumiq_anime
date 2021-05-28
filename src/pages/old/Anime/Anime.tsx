import { Database } from '../../../services/Firebase/Firebase';
import { getLocalStorage } from '../../../utils/LocalStorage/LocalStorage';
import AnimeCard from '../../../components/old/Card/AnimeCard';
import Filterbar from '../../../components/old/Filterbar/Filterbar';
import { AnimeFilter, SeasonList } from '../../Anime/Anime.filter';
import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Database as DatabaseType,
  Anime as AnimeType,
} from '../../../models/Type';
import queryString from 'query-string';

type TParams = { search: string };

const Anime = (props?: RouteComponentProps<TParams>) => {
  const [animeList, setAnimeList] = useState<Record<string, AnimeType>>(
    (getLocalStorage('database') as DatabaseType).anime
  );
  const [pageList, setPageList] = useState<[string, AnimeType][]>(
    AnimeFilter(animeList)
  );
  const [filter, setFilter] = useState({});
  const [popup, setPopup] = useState<string | JSX.Element>('');

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setAnimeList(db?.anime);
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
      <div className="container p-0 my-5 py-1">
        <div className="row text-center w-100 m-0">
          {pageList.map(
            ([key, anime]) =>
              anime !== null && (
                <AnimeCard
                  anime={anime}
                  key={key}
                  anime_key={key}
                  setPopup={setPopup}
                />
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
