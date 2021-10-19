import api from '../utils/api';
import {
  ADD_COMMENT,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  REMOVE_COMMENT,
  UPDATE_LIKES,
} from './type';
import { setAlert } from './alert';

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await api.get('/posts');
    return dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Get post by id
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/posts/${id}`);
    return dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Add a like
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/like/${id}`);
    return dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Remove a like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/unlike/${id}`);
    return dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Delete post by id
export const deletePost = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
    dispatch(setAlert(res.data.msg, 'success', 3000));
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Add a post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/posts', formData);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post created', 'success', 3000));
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Add a comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await api.put(`/posts/${postId}/comment`, formData);
    console.log('resdata', res.data);
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment added', 'success', 3000));
  } catch (err) {
    console.log(`errReq`, err.response);
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
// Remove a comment
export const removeComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await api.delete(`/posts/${postId}/comment/${commentId}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment removed', 'success', 3000));
  } catch (err) {
    return dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
