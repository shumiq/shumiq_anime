import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import { Anime as AnimeType } from '../../models/Type';
import { Filter, SeasonList } from '../../utils/AnimeFilter';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import FilterBar from '../../components/FilterBar/FilterBar';
import AnimeFolderDialog from '../../components/Dialog/AnimeFolderDialog';
import AnimeEditDialog from '../../components/Dialog/AnimeEditDialog';
import AnimeInfoDialog from '../../components/Dialog/AnimeInfoDialog';
import AnimeCardList from '../../components/AnimeCard/AnimeCardList';

const Anime = ({ location }) => {
  const dispatch = useDispatch();
  const filter = useSelector(Selector.getFilter);
  const isAdmin = useSelector(Selector.isAdmin);
  const animeList = useSelector(Selector.getDatabase).anime;
  const [pageList, setPageList] = useState<[string, AnimeType][]>(
    Filter(animeList, filter)
  );

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
        <AnimeCardList pageList={pageList} isAdmin={isAdmin} />
        <FilterBar seasonList={SeasonList(animeList)} />
      </Container>
      <AnimeFolderDialog isAdmin={isAdmin} />
      {isAdmin && <AnimeEditDialog />}
      <AnimeInfoDialog isAdmin={isAdmin} />
    </React.Fragment>
  );
};

export default withRouter(Anime);
