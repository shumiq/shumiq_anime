import UserDetail from '../../services/UserDetail/UserDetail';
import Anime from '../../pages/Anime/Anime';
import Sync from '../../pages/old/Sync/Sync';
import Backup from '../../pages/old/Backup/Backup';
import Conan from '../../pages/old/Conan/Conan';
import Keyaki from '../../pages/old/Keyaki/Keyaki';
import Sakura from '../../pages/old/Sakura/Sakura';

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
