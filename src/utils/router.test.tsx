import UserDetail from './userdetail';
import { getRouterConfig } from './router';

jest.mock('./userdetail');
jest.mock('./config/routerConfig', () => ({
  ROUTER_CONFIG: [
    {
      path: '/',
      exact: true,
      component: null,
      auth: [],
    },
    {
      path: '/sync',
      exact: true,
      component: null,
      auth: ['Admin'],
    },
  ],
}));

describe('Router', () => {
  it('should return all routers when admin', () => {
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(true);
    const routers = getRouterConfig();
    expect(routers).toHaveLength(2);
  });

  it('should return only non-admin routers when not admin', () => {
    (UserDetail.isAdmin as jest.Mock).mockReturnValue(false);
    const routers = getRouterConfig();
    expect(routers).toHaveLength(1);
  });
});
