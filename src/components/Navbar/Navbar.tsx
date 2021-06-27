import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import SyncIcon from '@material-ui/icons/Sync';
import BackupIcon from '@material-ui/icons/Backup';
import MovieIcon from '@material-ui/icons/Movie';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import Login from './Login';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../../utils/Store/AppStore';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Fab from '@material-ui/core/Fab';
import { useLocation } from 'react-router-dom';
import BookIcon from '@material-ui/icons/ImportContacts';
import LinkMaterial from '@material-ui/core/Link';
import TheatersIcon from '@material-ui/icons/Theaters';
import StorageIcon from '@material-ui/icons/Storage';

export const drawerWidth = 240;

function NavBar({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = useSelector(Selector.isAdmin);
  const location = useLocation();
  const isMedia =
    ['/', '/sakura', '/keyaki', '/conan', '/anime', '/vtuber'].indexOf(
      location.pathname
    ) >= 0;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <List>
        <Login />
      </List>
      <Divider />
      <List>
        <ListItem button key={'anime'} component={Link} to="/anime">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={'Anime'} />
        </ListItem>
      </List>
      <List>
        <ListItem button key={'vtuber'} component={Link} to="/vtuber">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={'Vtuber'} />
        </ListItem>
      </List>
      <List>
        <ListItem button key={'conan'} component={Link} to="/conan">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={'Conan'} />
        </ListItem>
      </List>
      <List>
        <ListItem button key={'keyaki'} component={Link} to="/keyaki">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={'Keyakitte Kakenai'} />
        </ListItem>
      </List>
      <List>
        <ListItem button key={'sakura'} component={Link} to="/sakura">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={'Soko Magattara Sakurazaka'} />
        </ListItem>
      </List>
      {isAdmin && (
        <>
          <Divider />
          <List>
            <ListItem button key={'addAnime'} component={Link} to="/anime/add">
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary={'Add Anime'} />
            </ListItem>
            <ListItem
              button
              key={'addVtuber'}
              component={Link}
              to="/vtuber/add"
            >
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary={'Add Vtuber'} />
            </ListItem>
            <ListItem button key={'sync'} component={Link} to="/sync">
              <ListItemIcon>
                <SyncIcon />
              </ListItemIcon>
              <ListItemText primary={'Sync'} />
            </ListItem>
            <ListItem button key={'backup'} component={Link} to="/backup">
              <ListItemIcon>
                <BackupIcon />
              </ListItemIcon>
              <ListItemText primary={'Backup'} />
            </ListItem>
            <ListItem
              button
              key={'nas'}
              component={LinkMaterial}
              href="https://shumiq.synology.me:5001/"
              target={'_blank'}
              color={'initial'}
              underline={'none'}
            >
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={'NAS'} />
            </ListItem>
          </List>
        </>
      )}
      <Divider />
      <List>
        <ListItem
          button
          key={'book'}
          component={LinkMaterial}
          href="http://shumiq.synology.me:8083/"
          target={'_blank'}
          color={'initial'}
          underline={'none'}
        >
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary={'E-Books'} />
        </ListItem>
        <ListItem
          button
          key={'plex'}
          component={LinkMaterial}
          href="http://shumiq.synology.me:32400/"
          target={'_blank'}
          color={'initial'}
          underline={'none'}
        >
          <ListItemIcon>
            <TheatersIcon />
          </ListItemIcon>
          <ListItemText primary={'Plex'} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} color={'default'}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            onClick={() => window.open('/', '_self')}
          >
            IQ's Anime
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
      {isMedia && (
        <Fab
          color="primary"
          className={classes.fab}
          onClick={() => dispatch(Action.setRandom(true))}
        >
          <ShuffleIcon />
        </Fab>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default NavBar;
