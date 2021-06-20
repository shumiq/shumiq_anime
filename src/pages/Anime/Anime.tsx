import React, { useCallback, useEffect, useState } from 'react';
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
import SynologyApi from '../../services/Synology/Synology';

const Anime = ({ location }) => {
  const dispatch = useDispatch();
  const filter = useSelector(Selector.getFilter);
  const isAdmin = useSelector(Selector.isAdmin);
  const isRandom = useSelector(Selector.isRandom);
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

  const handleOpenFolder = useCallback(
    async (key: string, anime: AnimeType) => {
      dispatch(Action.showLoading(true));
      const folder = await SynologyApi.list(`Anime${anime.path}`);
      dispatch(Action.showLoading(false));
      if (folder.success)
        dispatch(
          Action.openAnimeFolder(
            { key: key, anime: anime, folder: folder.data.files } || null
          )
        );
      else {
        dispatch(Action.showMessage(`Cannot load "${anime.title}"`));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isRandom) {
      const allAnime = Object.entries(animeList);
      const anime = allAnime[Math.floor(Math.random() * allAnime.length)];
      void handleOpenFolder(anime[0], anime[1]);
      dispatch(
        Action.applyFilter({
          season: `${anime[1].year},${anime[1].season}`,
        })
      );
      dispatch(Action.setRandom(false));
    }
  }, [isRandom, handleOpenFolder, dispatch, animeList]);

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <AnimeCardList
          pageList={pageList}
          isAdmin={isAdmin}
          handleOpenFolder={handleOpenFolder}
        />
        <FilterBar seasonList={SeasonList(animeList)} />
      </Container>
      <AnimeFolderDialog isAdmin={isAdmin} />
      {isAdmin && <AnimeEditDialog />}
      <AnimeInfoDialog isAdmin={isAdmin} />
    </React.Fragment>
  );
};

export default withRouter(Anime);
