import React, { useCallback } from 'react';
import { Anime } from '../../models/Type';
import Grid from '@material-ui/core/Grid';
import Share from '../../utils/Share/Share';
import { useDispatch } from 'react-redux';
import { Action } from '../../utils/Store/AppStore';
import AnilistApi from '../../services/Anilist/Anilist';
import AnimeCard from './AnimeCard';

export default function AnimeCardList({
  pageList,
  isAdmin,
  handleOpenFolder,
}: {
  pageList: [string, Anime][];
  isAdmin: boolean;
  handleOpenFolder: (key: string, anime: Anime) => Promise<void>;
}) {
  const dispatch = useDispatch();

  const handleShare = useCallback((key: string, anime: Anime) => {
    const title = anime.title;
    const host =
      process.env.REACT_APP_API_ENDPOINT?.toString() ||
      'https://anime-api.shumiq.synology.me';
    const url = `${host}/api/share?anime=${encodeURIComponent(key)}`;
    Share(title, url);
  }, []);

  const handleEdit = useCallback(
    (key: string, anime: Anime) => {
      dispatch(Action.editAnime({ key: key, anime: anime }));
    },
    [dispatch]
  );

  const handleAnimeInfo = useCallback(
    async (key: string, anime: Anime) => {
      dispatch(Action.showLoading(true));
      const anilistResult = await AnilistApi.getAnime(
        anime.title,
        anime.blacklist
      );
      dispatch(Action.showLoading(false));
      if (anilistResult)
        dispatch(
          Action.openAnimeInfo({
            key: key,
            anime: anime,
            animeInfo: anilistResult,
          })
        );
      else {
        dispatch(Action.showMessage(`Not found`));
      }
    },
    [dispatch]
  );

  return (
    <Grid container spacing={3} justify={'space-evenly'}>
      {pageList.map(
        ([key, anime]) =>
          anime !== null && (
            <Grid item key={key}>
              <AnimeCard
                anime={anime}
                animeKey={key}
                isAdmin={isAdmin}
                handleShare={handleShare}
                handleEdit={handleEdit}
                handleOpenFolder={handleOpenFolder}
                handleAnimeInfo={handleAnimeInfo}
              />
            </Grid>
          )
      )}
    </Grid>
  );
}
