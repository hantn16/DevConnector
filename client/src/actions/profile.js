import axios from 'axios';
import { setAlert } from './alert';
import {
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from './type';
// Get current profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');
    return dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    return dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Get all profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile');
    return dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    return dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Get profile by userId
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    return dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    return dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Get Repos by github username
export const getRepos = (username) => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    return dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    return dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
}
//Create or update profile
export const createOrUpdateProfile =
  (formData, history, isEditProfile = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post('/api/profile', formData, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(
          isEditProfile ? 'Profile updated!' : 'Profile created!',
          'success'
        )
      );
      // if (!isEditProfile) {
      //   history.push('/dashboard');
      // }
      history.push('/dashboard');
    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => {
            dispatch(setAlert(error.msg, 'danger', 3000));
          });
        }
        return dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  };
// Add Experience
export const addExperience =
  (formData, history, isEdit) => async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.put('/api/profile/experience', formData, config);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert('Experience Added!', 'success'));
      history.push('/dashboard');
    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => {
            dispatch(setAlert(error.msg, 'danger', 3000));
          });
        }
        return dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  };
// Add Education
export const addEducation = (formData, history, isEdit) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.put('/api/profile/education', formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Education Added!', 'success', 3000));
    history.push('/dashboard');
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, 'danger', 3000));
        });
      }
      return dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Experience removed!', 'success', 3000));
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, 'danger', 3000));
        });
      }
      return dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Education removed!', 'success', 3000));
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert(error.msg, 'danger', 3000));
        });
      }
      return dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      });
    }
  }
};
// Delete Account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure to delete your account?')) {
    try {
      const res = await axios.delete('/api/profile');
      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({
        type: ACCOUNT_DELETED,
        payload: res.data,
      });
    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => {
            dispatch(setAlert(error.msg, 'danger', 3000));
          });
        }
        return dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      }
    }
  }
};
