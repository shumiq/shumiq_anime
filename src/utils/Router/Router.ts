import UserDetail from '../../services/UserDetail/UserDetail';
import Anime from '../../pages/Anime/Anime';
import Sync from '../../pages/Sync/Sync';
import Conan from '../../pages/Conan/Conan';
import Keyaki from '../../pages/Keyaki/Keyaki';
import Sakura from '../../pages/Sakura/Sakura';
import AddAnime from '../../pages/Anime/AddAnime';
import Backup from '../../pages/Backup/Backup';
import AddVtuber from "../../pages/Vtuber/AddVtuber";

interface Router {
  path: string;
  exact: boolean;
  component: React.ComponentClass | (() => JSX.Element);
  auth: string[];
}

const ROUTER_CONFIG: Router[] = [
  {
    path: '/',
    exact: true,
    component: Anime,
    auth: [''],
  },
  {
    path: '/anime',
    exact: true,
    component: Anime,
    auth: [''],
  },
  {
    path: '/anime/add',
    exact: true,
    component: AddAnime,
    auth: ['Admin'],
  },
  {
    path: '/vtuber/add',
    exact: true,
    component: AddVtuber,
    auth: ['Admin'],
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

export const getRouterConfig = (): Router[] => {
  if (!UserDetail.isAdmin())
    return ROUTER_CONFIG.filter((router) => !router.auth.includes('Admin'));
  else return ROUTER_CONFIG;
};
