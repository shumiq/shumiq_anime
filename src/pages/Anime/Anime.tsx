import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import AnimeCard from '../../containers/AnimeCard/AnimeCard';
import Grid from '@material-ui/core/Grid';
import {
  Anime as AnimeType,
  Database as DatabaseType,
} from '../../models/Type';
import { getLocalStorage } from '../../utils/LocalStorage/LocalStorage';
import { AnimeFilter } from './Anime.filter';
import { Database } from '../../services/Firebase/Firebase';
import queryString from 'query-string';
import {useSelector} from "react-redux";
import {Selector} from "../../utils/Store/AppStore";

const Anime = ({ location }) => {
  const [animeList, setAnimeList] = useState<Record<string, AnimeType>>(
    (getLocalStorage('database') as DatabaseType).anime
  );
  const [pageList, setPageList] = useState<[string, AnimeType][]>(
    AnimeFilter(animeList)
  );
  const [filter, setFilter] = useState({});
  const isAdmin = useSelector(Selector.isAdmin);

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
