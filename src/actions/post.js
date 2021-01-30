import axios from 'axios'
import {setAlert} from './alert'
import {ADD_POST, DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES, GET_POST,ADD_COMMENT,REMOVE_COMMENT, GET_USERS_POSTS} from './types'

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts')
    dispatch ({
      type:GET_POSTS,
      payload: res.data
    })
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const getUsersPosts = (userId) => async dispatch => {
  try {
    const res = await axios.get('/api/posts')
    dispatch ({
      type:GET_USERS_POSTS,
      payload: {userId, ThePosts: res.data}
    })
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const addLike = (postId) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`)
    dispatch ({
      type:UPDATE_LIKES,
      payload: {postId, likes: res.data}
    })
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const removeLike = (postId) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`)
    dispatch ({
      type:UPDATE_LIKES,
      payload: {postId, likes: res.data}
    })
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const deletePost = (postId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}`)
    dispatch ({
      type:DELETE_POST,
      payload: postId      
    })
    dispatch(setAlert('Post removed', 'warning'))
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const addPost = (formData) => async dispatch => {
  try {
    const config = {
      headers:{
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.post(`/api/posts`, formData, config)
    dispatch ({
      type: ADD_POST,
      payload: res.data      
    })
    dispatch(setAlert('Post Created', 'success'))
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const getPost = (postId) => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${postId}`)
    dispatch ({
      type:GET_POST,
      payload: res.data
    })
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const addComment = (formData, postId) => async dispatch => {
  try {
    const config = {
      headers:{
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)
    dispatch ({
      type: ADD_COMMENT,
      payload: res.data      
    })
    dispatch(setAlert('Comment Added', 'success'))
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}

export const deleteComment = (commentId, postId) => async dispatch => {
  try {

    await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
    dispatch ({
      type: REMOVE_COMMENT,
      payload: commentId    
    })
    dispatch(setAlert('Comment Removed', 'warning'))
  } catch (error) {
      dispatch ({
        type: POST_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
  }
}