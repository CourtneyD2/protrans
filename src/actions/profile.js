import axios from 'axios'
import {setAlert} from './alert'
import { DELETE_ACCOUNT, GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, GET_REPOS} from './types'

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch ({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (error) {
      dispatch({ type: CLEAR_PROFILE });
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
    
  }
}

//get all profiles
export const getProfiles = () => async dispatch => {

  try {
    const res = await axios.get('/api/profile');
    dispatch({type: CLEAR_PROFILE})
    dispatch ({
      type: GET_PROFILES,
      payload: res.data
    })
  } catch (error) {
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
    
  }
}

export const getProfileById = (userId) => async dispatch => {
  
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    
    dispatch ({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (error) {
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
    
  }
}

export const getGHRepos = (username) => async dispatch => {

  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    dispatch ({
      type: GET_REPOS,
      payload: res.data
    })
  } catch (error) {
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
    
  }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config ={
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.post('/api/profile', formData, config)
    dispatch ({
      type: GET_PROFILE,
      payload: res.data
    });
    dispatch(setAlert(edit? 'profile updated':'profile created', 'success'));
    history.push('/Dashboard')
  } catch (error) {
      const errors = error.response.data.errors;
      console.log(errors);
      if (errors) {errors.forEach( error => dispatch (setAlert(error.msg, 'danger')))}
  
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
      
  }
}

export const addExperiance = (formData, history) => async dispatch => {
    try {
    const config ={
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.put('/api/profile/experiance', formData, config)
    dispatch ({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Experience Added', 'success'));
    history.push('/Dashboard')
  } catch (error) {
      const errors = error.response.data.errors;
      console.log(errors);
      if (errors) {errors.forEach( error => dispatch (setAlert(error.msg, 'danger')))}
  
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
      
  }
}

export const addEducation = (formData, history) => async dispatch => {
    try {
    const config ={
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.put('/api/profile/education', formData, config)
    dispatch ({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert('Education Added', 'success'));
    history.push('/Dashboard')
  } catch (error) {
      const errors = error.response.data.errors;
      console.log(errors);
      if (errors) {errors.forEach( error => dispatch (setAlert(error.msg, 'danger')))}
  
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
      
  }
}

export const deleteExperience = (id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert('Experience Removed', 'success'));

  } catch (error) {
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
    
  }
}
export const deleteEducation = (id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })
    dispatch(setAlert('Education Removed', 'success'));

  } catch (error) {
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })
    
  }
}

export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure, this cannot be undone')) {
    try {
      await axios.delete(`/api/profile/`);
      dispatch({type: CLEAR_PROFILE})
      dispatch({type: DELETE_ACCOUNT})
      dispatch(setAlert('Account Deleted', 'danger'));
      

    } catch (error) {
      dispatch ({
        type: PROFILE_ERROR,
        payload: {msg: error.response.statusText, status: error.response.status }
      })    
    }
  }
}

