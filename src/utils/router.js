import { ROUTER_CONFIG } from './RouterConfig/routerConfig';
import { IsAdmin } from './userDetail';

export const getRouterConfig = () => {
    if (!IsAdmin()) return ROUTER_CONFIG.filter(router => !router.auth.includes('Admin'));
    else return ROUTER_CONFIG;
};
