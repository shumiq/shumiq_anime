import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { getRouterConfig } from '../utils/Router/Router';
import Navbar from '../components/Navbar/Navbar';
import {
  createMuiTheme,
  createStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Selector } from '../utils/Store/AppStore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MessageDialog from '../components/Dialog/MessageDialog';
import VideoDialog from '../components/Dialog/VideoDialog';
import { Database } from '../services/Firebase/Firebase';
import { Database as DatabaseType } from '../models/Type';

const App = (): JSX.Element => {
  const classes = useStyles();
  const isLoading = useSelector(Selector.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    Database.subscribe((db: DatabaseType) => {
      dispatch(Action.updateDatabase(db));
    });
  }, [dispatch]);
  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      text: {
        secondary: 'rgba(255,255,255,0.5)',
      },
    },
  });
  const getRouters = () => {
    return getRouterConfig().map((route, index) => {
      const props = {
        path: route.path,
        exact: route.exact,
        component: route.component,
      };
      return <Route key={index} {...props} />;
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="app">
        <main className="app__container">
          <BrowserRouter>
            <Navbar>
              <div className="mt-5">
                <Switch>{getRouters()}</Switch>
              </div>
            </Navbar>
          </BrowserRouter>
        </main>
      </div>
      <Backdrop open={isLoading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MessageDialog />
      <VideoDialog />
    </ThemeProvider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

export default App;
