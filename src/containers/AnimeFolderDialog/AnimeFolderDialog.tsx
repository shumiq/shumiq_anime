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

export default function AnimeFolderDialog() {
  const dispatch = useDispatch();
  const open = useSelector(Selector.isAnimeFolderOpen);
  const folder = useSelector(Selector.getOpenedAnimeFolder);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const animeName = folder !== null ? folder[0].path.split('/')[3] : '';

  const handleClose = () => {
    dispatch(Action.closeAnimeFolder());
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
      <DialogTitle>{animeName}</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align={'center'}>Name</TableCell>
              <TableCell align={'center'}>Watch</TableCell>
              <TableCell align={'center'}>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folder !== null &&
              folder.map((file) => (
                <TableRow key={file.name}>
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
