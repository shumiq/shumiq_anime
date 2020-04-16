import Anime from '../../pages/Anime/Anime';
import Login from '../../pages/Login/Login';

export const ROUTER_CONFIG = [
    {
        path: '/',
        exact: true,
        component: Anime,
    },
    {
        path: '/login',
        exact: true,
        component: Login,
    },
];
