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
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Login from './Login';
import {useSelector} from "react-redux";
import {Selector} from "../../utils/Store/AppStore";

export const drawerWidth = 240;

function NavBar({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = useSelector(Selector.isAdmin);

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
        <ListItem button key={'anime'} component={Link} to="/">
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={'Anime'} />
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
            <ListItem button key={'add'} component={Link} to="/add">
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary={'Add Anime'} />
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
          </List>
        </>
      )}
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
          <Typography variant="h6" noWrap>
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
}));

export default NavBar;
