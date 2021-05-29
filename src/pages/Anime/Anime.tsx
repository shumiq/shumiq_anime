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
import { Filter, SeasonList } from '../../utils/AnimeFilter';
import { Database } from '../../services/Firebase/Firebase';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import FilterBar from '../../containers/FilterBar/FilterBar';
import AnimeFolderDialog from '../../containers/AnimeFolderDialog/AnimeFolderDialog';
import AnimeEditDialog from '../../containers/AnimeEditDialog/AnimeEditDialog';
import AnimeInfoDialog from '../../containers/AnimeInfoDialog/AnimeInfoDialog';

const Anime = ({ location }) => {
  const dispatch = useDispatch();
  const filter = useSelector(Selector.getFilter);
  const isAdmin = useSelector(Selector.isAdmin);
  const [animeList, setAnimeList] = useState<Record<string, AnimeType>>(
    (getLocalStorage('database') as DatabaseType).anime
  );
  const [pageList, setPageList] = useState<[string, AnimeType][]>(
    Filter(animeList, filter)
  );

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      setAnimeList(db?.anime);
    });
  }, []);

  useEffect(() => {
    setPageList(Filter(animeList, filter));
  }, [animeList, filter]);

  useEffect(() => {
    /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
    const params = queryString.parse(location?.search || '') as {
      search: string;
    };
    if (params.search) {
      dispatch(
        Action.applyFilter({
          keyword: params.search,
        })
      );
    }
  }, [location, dispatch]);

  return (
    <React.Fragment>
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
        <FilterBar seasonList={SeasonList(animeList)} />
      </Container>
      <AnimeFolderDialog />
      <AnimeEditDialog />
      <AnimeInfoDialog />
    </React.Fragment>
  );
};

export default withRouter(Anime);
