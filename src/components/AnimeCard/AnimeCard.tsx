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
import Link from '@material-ui/core/Link';

export default function AnimeCard({
  anime,
  animeKey,
  isAdmin,
  handleShare,
  handleEdit,
  handleOpenFolder,
  handleAnimeInfo,
}: {
  anime: Anime;
  animeKey: string;
  isAdmin: boolean;
  handleShare: (key: string, anime: Anime) => void;
  handleEdit: (key: string, anime: Anime) => void;
  handleOpenFolder: (key: string, anime: Anime) => void;
  handleAnimeInfo: (key: string, anime: Anime) => void;
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const isUnFinish = isAdmin && anime.download > anime.view;
  const focusDownload =
    anime.download_url !== '' &&
    anime.all_episode.toString() !== anime.download.toString() &&
    anime.last_update !== undefined &&
    Date.now() - anime.last_update > 1000 * 60 * 60 * 24 * 7;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={clsx(classes.root)}>
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
              <IconButton onClick={() => handleAnimeInfo(animeKey, anime)}>
                <MoreInfoIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </CardMedia>
      <CardContent style={{ padding: 0 }}>
        <Table size={'small'}>
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
                <TableCell
                  align={'right'}
                  className={clsx({
                    [classes.focusField]: isUnFinish,
                  })}
                >
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
          onClick={() => handleOpenFolder(animeKey, anime)}
        >
          <FolderIcon />
        </IconButton>
        <IconButton
          aria-label="share"
          onClick={() => handleShare(animeKey, anime)}
        >
          <ShareIcon />
        </IconButton>
        {isAdmin && (
          <>
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(animeKey, anime)}
            >
              <EditIcon />
            </IconButton>
            <Link href={anime.download_url} target={'blank'}>
              <IconButton
                aria-label="download"
                disabled={anime.download_url === ''}
                className={clsx({
                  [classes.focusField]: focusDownload,
                })}
              >
                <DownloadIcon />
              </IconButton>
            </Link>
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
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  focusField: {
    color: '#00FF00',
  },
}));
