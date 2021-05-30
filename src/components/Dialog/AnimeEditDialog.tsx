import React, { ChangeEvent } from 'react';
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
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

export default function AnimeEditDialog() {
  const dispatch = useDispatch();
  const open = useSelector(Selector.isAnimeEditOpen);
  const data = useSelector(Selector.getOpenedAnimeEdit);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  if (data === null) return null;
  const formState = { ...data.anime };

  const handleClose = () => {
    dispatch(Action.closeEditAnime());
  };

  const handleSave = () => {
    Database.update.anime(data.key, formState);
    handleClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${data.anime.title}"?`)) {
      Database.update.anime(data.key, null);
      handleClose();
    }
  };

  const handleUpdateFormData = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    if (event.target.name) formState[event.target.name] = event.target.value;
  };

  const handleUnSync = () => {
    if (
      window.confirm('Do you want to remove sync "' + data.anime.title + '" ?')
    ) {
      const state = { ...data.anime };
      state.path = '';
      state.size = 0;
      Database.update.anime(data.key, state);
      handleClose();
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>{data.anime.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              defaultValue={data.anime.title}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Studio"
              name="studio"
              defaultValue={data.anime.studio}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="View"
              name="view"
              defaultValue={data.anime.view}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Download"
              name="download"
              defaultValue={data.anime.download}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="All Episode"
              name="all_episode"
              defaultValue={data.anime.all_episode}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Year"
              name="year"
              defaultValue={data.anime.year}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel>Season</InputLabel>
            <Select
              fullWidth
              name="season"
              defaultValue={data.anime.season}
              onChange={handleUpdateFormData}
            >
              <MenuItem value="1">Winter</MenuItem>
              <MenuItem value="2">Spring</MenuItem>
              <MenuItem value="3">Summer</MenuItem>
              <MenuItem value="4">Fall</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="number"
              label="Score"
              name="score"
              defaultValue={data.anime.score}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Folder Path"
              name="path"
              defaultValue={data.anime.path}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cover Image Url"
              name="cover_url"
              defaultValue={data.anime.cover_url}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Download Url"
              name="download_url"
              defaultValue={data.anime.download_url}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              name="genres"
              defaultValue={data.anime.genres}
              onChange={handleUpdateFormData}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="default">
          Save
        </Button>
        <Button onClick={handleUnSync} color="default">
          Remove Sync
        </Button>
        <Button onClick={handleDelete} color="default">
          Delete
        </Button>
        <Button autoFocus onClick={handleClose} color="default">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
