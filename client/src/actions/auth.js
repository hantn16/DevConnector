import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './type';

//load user
export const loadUser = () => async (dispatch) => {
  try {
    if (!localStorage.token) {
      return dispatch({ type: AUTH_ERR });
    }
    setAuthToken(localStorage.token);
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger', 3000));
      });
    }
    dispatch({
      type: AUTH_ERR,
    });
  }
};

//register user
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = { name, email, password };
      const res = await axios.post('/api/users', body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, 'danger', 3000));
        });
      }
      // if (err.response) {
      //     // The request was made and the server responded with a status code
      //     // that falls out of the range of 2xx
      //     console.log('Error Data: ',err.response.data);
      //     console.log(err.response.status);
      //     console.log('headers:',err.response.headers);
      //     console.log('Err Request',err.request);
      //   } else if (err.request) {
      //     // The request was made but no response was received
      //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //     // http.ClientRequest in node.js
      //     console.log('Request: ',err.request);
      //   } else {
      //     // Something happened in setting up the request that triggered an Error
      //     console.log('Error', err.message);
      //   }
      //   console.log('Config: ',err.config);
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

//login user
export const login = (email, password) => async (dispatch) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = { email, password };
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger', 3000));
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//logout & remove profiles
// export const logout = () => ({ type: LOGOUT });
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
