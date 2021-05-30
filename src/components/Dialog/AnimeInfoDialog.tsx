import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import { Database } from '../../services/Firebase/Firebase';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import { Anime } from '../../models/Type';

export default function AnimeInfoDialog({ isAdmin }: { isAdmin: boolean }) {
  const dispatch = useDispatch();
  const data = useSelector(Selector.getOpenedAnimeInfo);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  if (data === null) return null;
  const info = data.animeInfo;

  const handleClose = () => {
    dispatch(Action.closeAnimeInfo());
  };

  const handleUpdate = () => {
    const state: Anime = { ...data.anime };
    state.studio = info.studios?.nodes[0]?.name
      ? info.studios?.nodes[0]?.name
      : 'none';
    state.all_episode = info.episodes ? info.episodes.toString() : '?';
    state.year = info.startDate.year;
    const seasonNum = {
      WINTER: 1,
      SPRING: 2,
      SUMMER: 3,
      FALL: 4,
    };
    state.season = seasonNum[info.season] as number;
    state.info = info.description;
    if (info.averageScore) state.score = (info.averageScore / 10.0).toFixed(1);
    const genres = state.genres.split(', ');
    info.genres.forEach((g) => {
      if (!genres.includes(g)) genres.push(g);
    });
    state.genres = genres
      .filter((g) => g.trim() !== '')
      .sort()
      .join(', ');
    state.cover_url = info.coverImage.large;
    Database.update.anime(data.key, state);
    handleClose();
  };

  const handleBlackList = () => {
    if (window.confirm('This is wrong?')) {
      const state = { ...data.anime };
      if (!state.blacklist) state.blacklist = [];
      if (!state.blacklist.includes(info.id)) state.blacklist.push(info.id);
      Database.update.anime(data.key, state);
      handleClose();
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open
      onClose={handleClose}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>{data.anime.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <b>Title</b>: {info.title.romaji}{' '}
          {info.title.english &&
            info.title.english !== info.title.romaji &&
            '/ ' + info.title.english}
        </Typography>
        <Typography variant="body1">
          <b>Studio</b>: {info.studios?.nodes[0]?.name}
        </Typography>
        <Typography variant="body1">
          <b>Source</b>: {info.source}
        </Typography>
        <Typography variant="body1">
          <b>Episodes</b>: {info.episodes}
        </Typography>
        {info.nextAiringEpisode != null && (
          <Typography variant="body1">
            <b>Next Airing</b>: EP{info.nextAiringEpisode.episode} in{' '}
            {secondToDuration(info.nextAiringEpisode.timeUntilAiring)}
          </Typography>
        )}
        <Typography variant="body1">
          <b>Season</b>: {info.startDate.year} {info.season}
        </Typography>
        <Typography variant="body1">
          <b>Score</b>: {info.averageScore / 10.0}
        </Typography>
        <Typography variant="body1">
          <b>Genres</b>: {info.genres.join(', ')}
        </Typography>
        {info.bannerImage != null && (
          <img src={info.bannerImage} width="100%" alt="banner" />
        )}
        <Typography variant="body1" paragraph>
          {info.description}
        </Typography>

        {info.relations?.nodes && (
          <Typography variant="body1">
            <b>Related Media</b>:{' '}
            {info.relations.nodes
              .map(
                (related) =>
                  related.title.userPreferred + ' (' + related.type + ')'
              )
              .join(', ')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {isAdmin && (
          <Button autoFocus onClick={handleUpdate} color="default">
            Update
          </Button>
        )}
        {isAdmin && (
          <Button autoFocus onClick={handleBlackList} color="default">
            Change
          </Button>
        )}
        <Button autoFocus onClick={handleClose} color="default">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const secondToDuration = (t: number): string => {
  const cd = 24 * 60 * 60;
  const ch = 60 * 60;
  let d = Math.floor(t / cd);
  let h = Math.floor((t - d * cd) / ch);
  let m = Math.round((t - d * cd - h * ch) / 60000);
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return d.toString() + ' days ' + h.toString() + ' hours ';
};
