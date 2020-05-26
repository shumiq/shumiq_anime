import { getRouterConfig } from '../utils/router';
import Navbar from '../components/Navbar/Navbar';
import { Database } from '../utils/firebase';
import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

const App = () => {
  const getRouters = (data) => {
    return getRouterConfig().map((route, index) => {
      const props = {
        path: route.path,
        exact: route.exact,
        component: route.component,
      };
      return <Route key={index} {...props} />;
    });
  };

  useEffect(() => {
    Database.runAutoDelete();
    Database.runAutoBackup();
  }, []);

  return (
    <div className="app">
      <main className="app__container">
        <BrowserRouter>
          <Navbar />
          <div className="mt-5">
            <Switch>{getRouters()}</Switch>
          </div>
        </BrowserRouter>
      </main>
    </div>
  );
};

export default App;
