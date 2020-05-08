import Anime from '../../pages/Anime/Anime';
import Sync from '../../pages/Sync/Sync';

export const ROUTER_CONFIG = [
    {
        path: '/',
        exact: true,
        component: Anime,
    },
    {
        path: '/sync',
        exact: true,
        component: Sync,
    }
];
