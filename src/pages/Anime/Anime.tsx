import React, { useCallback, useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import AnimeCard from '../../components/Card/AnimeCard';
import Grid from '@material-ui/core/Grid';
import {
  Anime as AnimeType,
  Database as DatabaseType,
} from '../../utils/types';
import { getLocalStorage } from '../../utils/localstorage';
import { AnimeFilter } from './Anime.filter';
import { Auth, Database } from '../../utils/firebase';
import queryString from 'query-string';
import UserDetail from '../../utils/userdetail';

const Anime = ({ location }) => {
  const [animeList, setAnimeList] = useState<Record<string, AnimeType>>(
    (getLocalStorage('database') as DatabaseType).anime
  );
  const [pageList, setPageList] = useState<[string, AnimeType][]>(
    AnimeFilter(animeList)
  );
  const [filter, setFilter] = useState({});
  const [isAdmin, setIsAdmin] = useState<boolean>(UserDetail.isAdmin());

  useEffect(() => {
    Auth.subscribe(() => {
      setIsAdmin(UserDetail.isAdmin());
    });
  }, []);

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setAnimeList(db?.anime);
    });
  }, []);

  useEffect(() => {
    setPageList(AnimeFilter(animeList, filter));
  }, [animeList, filter]);

  useEffect(() => {
    /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
    const params = queryString.parse(location?.search || '') as {
      search: string;
    };
    if (params.search) {
      setFilter({
        keyword: params.search,
      });
    }
  }, [location]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justify={'space-evenly'}>
        {pageList.map(
          ([key, anime]) =>
            anime !== null && (
              <Grid item key={key}>
                <AnimeCard anime={anime} animeKey={key} isAdmin={isAdmin} />
              </Grid>
            )
        )}
      </Grid>
    </Container>
  );
};

export default withRouter(Anime);
