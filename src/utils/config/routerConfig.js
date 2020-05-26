import Anime from '../../pages/Anime/Anime';
import Sync from '../../pages/Sync/Sync';
import Conan from '../../pages/Conan/Conan';
import Keyaki from '../../pages/Keyaki/Keyaki';

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
  {
    path: '/conan',
    exact: true,
    component: Conan,
    auth: [],
  },
  {
    path: '/keyaki',
    exact: true,
    component: Keyaki,
    auth: [],
  },
];
