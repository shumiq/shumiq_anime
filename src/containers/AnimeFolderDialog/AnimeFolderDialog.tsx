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
  const anime = useSelector(Selector.getOpenedAnimeFolder);
  const isAdmin = useSelector(Selector.isAdmin);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    dispatch(Action.closeAnimeFolder());
  };

  const isView = (fileName: string) => {
    if (anime === null) return false;
    const view = anime.anime.view;
    const fileIndex =
      anime.folder.findIndex((file) => file.name === fileName) + 1;
    return fileIndex <= view;
  };

  const updateView = (fileName: string) => {
    if (anime === null) return;
    const currentView = anime.anime.view;
    const fileIndex =
      anime.folder.findIndex((file) => file.name === fileName) + 1;
    const targetView = fileIndex === currentView ? fileIndex - 1 : fileIndex;
    const updatedAnime = {
      ...anime.anime,
      view: targetView,
    } as Anime;
    Database.update.anime(anime.key, updatedAnime);
    dispatch(
      Action.openAnimeFolder({
        key: anime.key,
        anime: updatedAnime,
        folder: anime.folder,
      })
    );
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
      <DialogTitle>{anime?.anime.title || ''}</DialogTitle>
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
            {anime !== null &&
              anime.folder !== null &&
              anime.folder.map((file) => (
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
                    <Link
                      href={SynologyApi.getAuthDownloadURL(
                        SynologyApi.getDownloadURL(file.path)
                      )}
                      target={'blank'}
                    >
                      <IconButton>
                        <PlayIcon />
                      </IconButton>
                    </Link>
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
