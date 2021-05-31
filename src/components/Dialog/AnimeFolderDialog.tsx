import React, { useCallback } from 'react';
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
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import Checkbox from '@material-ui/core/Checkbox';
import { Anime } from '../../models/Type';
import { Database } from '../../services/Firebase/Firebase';

export default function AnimeFolderDialog({ isAdmin }: { isAdmin: boolean }) {
  const dispatch = useDispatch();
  const data = useSelector(Selector.getOpenedAnimeFolder);
  const open = data !== null;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const getPlayList = useCallback(() => {
    return (
      data?.folder.reduce(
        (result, file, index) =>
          result.concat([
            [
              `${data.anime.title} ตอนที่ ${index + 1}/${
                data.anime.all_episode
              }`,
              file.path,
            ],
          ]),
        [] as [string, string][]
      ) || []
    );
  }, [data]);

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

  const handlePlay = useCallback(
    (file: string) => {
      dispatch(Action.setPlaylist(getPlayList()));
      dispatch(Action.openVideo(file));
    },
    [dispatch, getPlayList]
  );

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
