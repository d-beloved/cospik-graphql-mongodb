import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import actionCreator from 'Utils/actionCreator';
import { ADMIN_SIGN_IN_SUCCESS } from 'Store/constants';
import { logoutAdmin } from 'Store/actions/auth.action';

interface jwtSign {
  exp: any
}

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if(!token) return false;
  let decoded: jwtSign;

  try {
    decoded = jwt_decode(token);
  } catch (error) {
    return false;
  }

  const { exp } = decoded;

  const currentDate = new Date();

  return exp * 1000 > currentDate.getTime();
};

export const setUser = async (store: any) => {
  Axios.defaults.baseURL = 'http://localhost:3110/api';
  let user = null;
  const rawUser = localStorage.getItem('user');
  if (rawUser) {
    user = JSON.parse(rawUser);
  }

  if (user) {
    const token = localStorage.getItem('token');
    const valid = isLoggedIn();
    if (valid) {
      if (token) {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      return store.dispatch(actionCreator(ADMIN_SIGN_IN_SUCCESS, user));
    } else {
      return store.dispatch(logoutAdmin());
    }
  }
};
