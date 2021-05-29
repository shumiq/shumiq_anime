import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import Button from '@material-ui/core/Button';
import SynologyApi from '../../services/Synology/Synology';
import Link from '@material-ui/core/Link';

export default function OpenVideoDialog() {
  const dispatch = useDispatch();
  const path = useSelector(Selector.getVideoAlt);
  const open = path !== '';

  const handleClose = () => {
    dispatch(Action.closeVideoAlt());
  };
  const handlePlay = () => {
    const url = SynologyApi.getAuthDownloadURL(
      SynologyApi.getDownloadURL(path)
    );
    dispatch(Action.openVideo(url));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          <Button
            variant="contained"
            onClick={handlePlay}
            style={{ margin: '2px' }}
          >
            Play
          </Button>
          <Link
            href={SynologyApi.getAuthDownloadURL(
              SynologyApi.getDownloadURL(path, true)
            )}
          >
            <Button variant="contained" style={{ margin: '2px' }}>
              Download
            </Button>
          </Link>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
