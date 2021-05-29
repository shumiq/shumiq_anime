import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import { makeStyles } from '@material-ui/core/styles';

export default function VideoDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const videoUrl = useSelector(Selector.getVideo);
  const open = videoUrl !== '';

  const handleClose = () => {
    dispatch(Action.closeVideo());
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
      onClick={(e) => {
        /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
        if ((e.target as any).id !== 'video-player') handleClose();
      }}
    >
      <video id="video-player" controls autoPlay className={classes.video}>
        <source src={videoUrl} type={'video/mp4'} />
      </video>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  video: {
    width: '90vw',
    height: '50.625vw',
    maxHeight: '90vh',
    maxWidth: '160vh',
    margin: 'auto',
  },
}));
