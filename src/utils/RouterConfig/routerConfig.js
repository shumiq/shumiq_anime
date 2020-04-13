import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login'

export const ROUTER_CONFIG = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/login',
    exact: true,
    component: Login
  }
];