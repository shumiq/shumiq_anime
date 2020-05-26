import { ROUTER_CONFIG } from './config/routerConfig';
import UserDetail from './userdetail';

export const getRouterConfig = () => {
  if (!UserDetail.isAdmin())
    return ROUTER_CONFIG.filter((router) => !router.auth.includes('Admin'));
  else return ROUTER_CONFIG;
};
