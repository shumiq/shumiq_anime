import Anime from '../../pages/Anime/Anime';
import Sync from '../../pages/Sync/Sync';

export const ROUTER_CONFIG = [
  {
    path: '/',
    exact: true,
    component: Anime,
    auth: [],
  },
  {
    path: '/sync',
    exact: true,
    component: Sync,
    auth: ['Admin'],
  },
];
