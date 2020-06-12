import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { getRouterConfig } from '../utils/router';
import Navbar from '../components/Navbar/Navbar';
import { Database } from '../utils/firebase';
import UserDetail from '../utils/userdetail';

const App = (): JSX.Element => {
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

  useEffect(() => {
    if (UserDetail.isAdmin()) {
      void Database.runAutoDelete();
      void Database.runAutoBackup();
    }
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
