import React from 'react';
import { Anime } from '../../models/Type';
import Grid from '@material-ui/core/Grid';
import Share from '../../utils/Share/Share';
import SynologyApi from '../../services/Synology/Synology';
import { useDispatch } from 'react-redux';
import { Action } from '../../utils/Store/AppStore';
import AnilistApi from '../../services/Anilist/Anilist';
import AnimeCard from './AnimeCard';

export default function AnimeCardList({
  pageList,
  isAdmin,
}: {
  pageList: [string, Anime][];
  isAdmin: boolean;
}) {
  const dispatch = useDispatch();

  const handleShare = (key: string, anime: Anime) => {
    const title = anime.title;
    const host =
      process.env.REACT_APP_API_ENDPOINT?.toString() || 'http://localhost:3000';
    const url = `${host}/api/share?anime=${encodeURIComponent(key)}`;
    Share(title, url);
  };

  const handleEdit = (key: string, anime: Anime) => {
    dispatch(Action.editAnime({ key: key, anime: anime }));
  };

  const handleOpenFolder = async (key: string, anime: Anime) => {
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
  };

  const handleAnimeInfo = async (key: string, anime: Anime) => {
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
  };

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
