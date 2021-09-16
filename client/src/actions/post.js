import axios from "axios";
import { ADD_COMMENT, ADD_POST, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, REMOVE_COMMENT, UPDATE_LIKES } from "./type";
import {setAlert} from "./alert";

// Get all posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        return dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}
// Get post by id
export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        return dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}
// Add a like
export const addLike = (id) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);
        return dispatch({
            type: UPDATE_LIKES,
            payload: {id,likes: res.data}
        })
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}
// Remove a like
export const removeLike = (id) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);
        return dispatch({
            type: UPDATE_LIKES,
            payload: {id,likes: res.data}
        })
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}
// Delete post by id
export const deletePost = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${id}`);
        dispatch({
            type: DELETE_POST,
            payload: id
        });
        dispatch(setAlert(res.data.msg,'success',3000));
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}
// Add a post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post('/api/posts',formData,config);
        dispatch({
            type: ADD_POST,
            payload: res.data
        });
        dispatch(setAlert('Post created','success',3000));
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}
// Add a comment
export const addComment = (postId,formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`,formData,config);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('Comment added','success',3000));
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}
// Remove a comment
export const removeComment = (postId,commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type: REMOVE_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('Comment removed','success',3000));
    } catch (err) {
        return dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}
