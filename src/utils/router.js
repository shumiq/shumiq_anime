import { ROUTER_CONFIG } from './config/routerConfig';
import { IsAdmin } from './userdetail';

export const getRouterConfig = () => {
  if (!IsAdmin())
    return ROUTER_CONFIG.filter((router) => !router.auth.includes('Admin'));
  else return ROUTER_CONFIG;
};
