import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import EditIcon from '@material-ui/icons/Edit';
import DownloadIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import StarIcon from '@material-ui/icons/Star';
import MoreInfoIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Anime } from '../../models/Type';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Season } from '../../models/Constants';
import Share from '../../utils/Share/Share';
import SynologyApi from '../../services/Synology/Synology';
import { useDispatch } from 'react-redux';
import { Action } from '../../utils/Store/AppStore';

export default function AnimeCard({
  anime,
  animeKey,
  isAdmin,
}: {
  anime: Anime;
  animeKey: string;
  isAdmin: boolean;
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const share = () => {
    const title = anime.title;
    const host =
      process.env.REACT_APP_API_ENDPOINT?.toString() || 'http://localhost:3000';
    const url = `${host}/api/share?anime=${encodeURIComponent(animeKey)}`;
    Share(title, url);
  };

  const handleOpenFolder = async () => {
    dispatch(Action.setLoading(true));
    const folder = await SynologyApi.list(`Anime${anime.path}`);
    dispatch(Action.setLoading(false));
    dispatch(
      Action.openAnimeFolder(
        { key: animeKey, anime: anime, folder: folder.data.files } || null
      )
    );
  };

  return (
    <Card className={classes.root}>
      <Box
        className={classes.score}
        display="flex"
        alignItems={'center'}
        justifyContent={'space-evenly'}
      >
        <StarIcon style={{ color: 'yellow', fontSize: '10px' }} />
        {anime.score}
      </Box>
      <CardMedia
        className={classes.media}
        image={anime.cover_url}
        title={anime.title}
      >
        <CardContent className={classes.header}>
          <Grid container alignItems={'center'} justify="space-between">
            <Grid item xs={10}>
              <Typography variant="body2" color="textPrimary" component="p">
                {anime.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" component="p">
                {anime.genres}
              </Typography>
            </Grid>
            <Grid item xs={2} className={'MuiTypography-alignRight'}>
              <IconButton aria-label="edit">
                <MoreInfoIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </CardMedia>
      <CardContent style={{ padding: 0 }}>
        <Table className={classes.table} size={'small'}>
          <TableBody>
            <TableRow hover={true}>
              <TableCell>Studio</TableCell>
              <TableCell align={'right'}>{anime.studio}</TableCell>
            </TableRow>
            <TableRow hover={true}>
              <TableCell>Season</TableCell>
              <TableCell align={'right'}>
                {anime.year} {Season[anime.season.toString()]}
              </TableCell>
            </TableRow>
            {isAdmin && (
              <TableRow hover={true}>
                <TableCell>View</TableCell>
                <TableCell align={'right'}>
                  {anime.view}/{anime.download}
                </TableCell>
              </TableRow>
            )}
            <TableRow hover={true}>
              <TableCell>Download</TableCell>
              <TableCell align={'right'}>
                {anime.download}/{anime.all_episode}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions disableSpacing style={{ justifyContent: 'space-around' }}>
        <IconButton
          aria-label="view"
          disabled={anime.path === ''}
          onClick={handleOpenFolder}
        >
          <FolderIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={share}>
          <ShareIcon />
        </IconButton>
        {isAdmin && (
          <>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="download"
              disabled={anime.download_url === ''}
              onClick={() => window.open(anime.download_url)}
            >
              <DownloadIcon />
            </IconButton>
          </>
        )}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph variant={'caption'} color={'textSecondary'}>
            {anime.info}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    [theme.breakpoints.up('md')]: {
      width: 360,
    },
  },
  media: {
    height: 0,
    paddingTop: '100%',
  },
  header: {
    background: 'rgba(0,0,0,0.5)',
    transform: 'translateY(-100%)',
    '&:last-child': {
      padding: '8px 16px',
    },
  },
  score: {
    position: 'absolute',
    width: 44,
    height: 22,
    margin: '5px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  table: {
    '& $td': {
      color: theme.palette.text.secondary,
      fontSize: theme.typography.caption.fontSize,
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));
