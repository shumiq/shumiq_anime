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

export default function AnimeFolderDialog() {
  const dispatch = useDispatch();
  const open = useSelector(Selector.isAnimeFolderOpen);
  const data = useSelector(Selector.getOpenedAnimeFolder);
  const isAdmin = useSelector(Selector.isAdmin);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const handleClose = () => {
    dispatch(Action.closeAnimeFolder());
  };

  const isView = (fileName: string) => {
    if (data === null) return false;
    const view = data.anime.view;
    const fileIndex =
      data.folder.findIndex((file) => file.name === fileName) + 1;
    return fileIndex <= view;
  };

  const updateView = (fileName: string) => {
    if (data === null) return;
    const currentView = data.anime.view;
    const fileIndex =
      data.folder.findIndex((file) => file.name === fileName) + 1;
    const targetView = fileIndex === currentView ? fileIndex - 1 : fileIndex;
    const updatedAnime = {
      ...data.anime,
      view: targetView,
    } as Anime;
    Database.update.anime(data.key, updatedAnime);
    dispatch(
      Action.openAnimeFolder({
        key: data.key,
        anime: updatedAnime,
        folder: data.folder,
      })
    );
  };

  const handlePlay = (path: string) => {
    const url = SynologyApi.getAuthDownloadURL(
      SynologyApi.getDownloadURL(path, true)
    );
    dispatch(Action.openVideo(url));
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle>{data?.anime.title || ''}</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              {isAdmin && <TableCell align={'center'}></TableCell>}
              <TableCell align={'center'}>Name</TableCell>
              <TableCell align={'center'}>Watch</TableCell>
              <TableCell align={'center'}>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data !== null &&
              data.folder !== null &&
              data.folder.map((file) => (
                <TableRow key={file.name}>
                  {isAdmin && (
                    <TableCell align={'center'}>
                      <Checkbox
                        color={'default'}
                        checked={isView(file.name)}
                        onClick={() => updateView(file.name)}
                      />
                    </TableCell>
                  )}
                  <TableCell>{file.name}</TableCell>
                  <TableCell align={'center'}>
                    <IconButton onClick={() => handlePlay(file.path)}>
                      <PlayIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align={'center'}>
                    <Link
                      href={SynologyApi.getAuthDownloadURL(
                        SynologyApi.getDownloadURL(file.path, true)
                      )}
                    >
                      <IconButton>
                        <DownloadIcon />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="default">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
