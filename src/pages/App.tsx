import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { getRouterConfig } from '../utils/Router/Router';
import Navbar from '../containers/Navbar/Navbar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

const App = (): JSX.Element => {
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
    </ThemeProvider>
  );
};

export default App;
