import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import { makeStyles } from '@material-ui/core/styles';
import { GetApp, SkipNext, SkipPrevious } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SynologyApi from '../../services/Synology/Synology';

export default function VideoDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [startHidden, setStartHidden] = useState(false);
  const [hidden, setHidden] = useState(false);
  const videoPath = useSelector(Selector.getVideo);
  const playList = useSelector(Selector.getPlayList);
  const currentVideo = playList.find((play) => play[1] === videoPath);
  const currentIndex = currentVideo ? playList.indexOf(currentVideo) : -1;
  const videoUrl = SynologyApi.getAuthDownloadURL(
    SynologyApi.getDownloadURL(videoPath, true)
  );
  const open = videoPath !== '' && playList.length > 0 && currentIndex !== -1;

  const handleClose = () => {
    dispatch(Action.closeVideo());
  };

  const handleNext = (path: string) => {
    dispatch(Action.closeVideo());
    setTimeout(() => dispatch(Action.openVideo(path)), 500);
  };

  useEffect(() => {
    if (!startHidden) {
      if (timer) clearTimeout(timer);
      const t = setTimeout(() => setHidden(true), 5000);
      setTimer(t);
      setStartHidden(true);
      setHidden(false);
    }
  }, [startHidden, timer]);

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
        const id = ((e.target as unknown) as { id: string }).id;
        if (id === '') handleClose();
        else setStartHidden(false);
      }}
      onMouseMove={() => setStartHidden(false)}
      onTouchStart={() => setStartHidden(false)}
    >
      <video
        id="video-player"
        controls
        autoPlay
        className={classes.video}
        onEnded={() => {
          if (currentIndex < playList.length - 1)
            handleNext(playList[currentIndex + 1][1]);
        }}
      >
        <source src={videoUrl} type={'video/mp4'} />
      </video>
      <Box
        className={classes.customControl}
        style={{ opacity: hidden ? '0.0' : '1.0' }}
        id="custom-control-main"
      >
        <Typography id="custom-control-main2" align={'center'}>
          {currentIndex > 0 && (
            <IconButton
              id="custom-control-previous"
              color={'default'}
              onClick={() => {
                handleNext(playList[currentIndex - 1][1]);
              }}
            >
              <SkipPrevious id="custom-control-previous2" />
            </IconButton>
          )}
          {currentVideo && currentVideo[0]}
          {currentIndex < playList.length - 1 && (
            <IconButton
              id="custom-control-next"
              color={'default'}
              onClick={() => {
                handleNext(playList[currentIndex + 1][1]);
              }}
            >
              <SkipNext id="custom-control-next2" />
            </IconButton>
          )}
          <IconButton
            id="custom-control-download"
            color={'default'}
            onClick={() => window.open(videoUrl)}
          >
            <GetApp id="custom-control-download2" />
          </IconButton>
        </Typography>
      </Box>
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
  customControl: {
    position: 'absolute',
    top: '0px',
    width: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: 'opacity 1s',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}));
