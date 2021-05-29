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
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import { TableHead } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import DownloadIcon from '@material-ui/icons/GetApp';
import Link from '@material-ui/core/Link';
import SynologyApi from '../../services/Synology/Synology';
import Checkbox from '@material-ui/core/Checkbox';
import { Anime } from '../../models/Type';
import { Database } from '../../services/Firebase/Firebase';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FilterOption } from '../../models/Constants';
import FormControl from '@material-ui/core/FormControl';
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

  const handleUpdateFormData = (
    event: ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    if (event.target.name) formState[event.target.name] = event.target.value;
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
              style={{ width: '100%' }}
              label="Title"
              name="title"
              defaultValue={data.anime.title}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Studio"
              name="studio"
              defaultValue={data.anime.studio}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              style={{ width: '100%' }}
              type="number"
              label="View"
              name="view"
              defaultValue={data.anime.view}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              style={{ width: '100%' }}
              type="number"
              label="Download"
              name="download"
              defaultValue={data.anime.download}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              style={{ width: '100%' }}
              label="All Episode"
              name="all_episode"
              defaultValue={data.anime.all_episode}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              style={{ width: '100%' }}
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
              style={{ width: '100%' }}
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
              style={{ width: '100%' }}
              type="number"
              label="Score"
              name="score"
              defaultValue={data.anime.score}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="Folder Path"
              name="path"
              defaultValue={data.anime.path}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="Cover Image Url"
              name="cover_url"
              defaultValue={data.anime.cover_url}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="Download Url"
              name="download_url"
              defaultValue={data.anime.download_url}
              onChange={handleUpdateFormData}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="Tags"
              name="genres"
              defaultValue={data.anime.genres}
              onChange={handleUpdateFormData}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleSave} color="default">
          Save
        </Button>
        <Button autoFocus onClick={handleClose} color="default">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
