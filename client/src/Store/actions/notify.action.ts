import { SET_NOTIFY, CLOSE_NOTIFY } from 'Store/constants';

export const setNotify = (message: any) => ({
  type: SET_NOTIFY,
  message
});

export const closeNotify = (index: any) => ({
  type: CLOSE_NOTIFY,
  index
});
