import Anime from '../../pages/Anime/Anime';
import Sync from '../../pages/old/Sync/Sync';
import Conan from '../../pages/old/Conan/Conan';
import Keyaki from '../../pages/old/Keyaki/Keyaki';
import Backup from '../../pages/old/Backup/Backup';
import { Router } from '../types';
import Sakura from '../../pages/old/Sakura/Sakura';

export const ROUTER_CONFIG: Router[] = [
  {
    path: '/',
    exact: true,
    component: Anime,
    auth: [''],
  },
  {
    path: '/sync',
    exact: true,
    component: Sync,
    auth: ['Admin'],
  },
  {
    path: '/backup',
    exact: true,
    component: Backup,
    auth: ['Admin'],
  },
  {
    path: '/conan',
    exact: true,
    component: Conan,
    auth: [''],
  },
  {
    path: '/keyaki',
    exact: true,
    component: Keyaki,
    auth: [''],
  },
  {
    path: '/sakura',
    exact: true,
    component: Sakura,
    auth: [''],
  },
];
