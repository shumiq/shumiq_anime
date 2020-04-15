import React from 'react';
import { getRouterConfig } from '../utils/router';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const App = () => {
    const getRouters = data => {
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
        <div className="app">
            <main className="app__container">
                <BrowserRouter>
                    <Navbar />
                    <div className="mt-5">
                        <Switch>
                            {getRouters()}
                        </Switch>
                    </div>
                </BrowserRouter>
            </main>
        </div>
    );
};

export default App;
