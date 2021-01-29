import axios from 'axios'
import {setAlert} from './alert'
import {REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, 
        AUTH_ERROR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, CLEAR_PROFILE} from './types'
import setAuthToken from '../utils/setAuthToken'
//load USer
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (error) {
    dispatch({type: AUTH_ERROR})
  }
}


//Register user
export const register = (formData ) => async dispatch => {
    const config ={
      'Content-Type': 'application/json'
    } 
  //const body = JSON.stringify(formData);
   try {
     const res = await axios.post('/api/users', formData, config);
     dispatch({type: REGISTER_SUCCESS, payload: res.data})
     dispatch(loadUser());
   } catch (error) {
     const errors = error.response.data.errors;
     if (errors) {errors.forEach( error => dispatch (setAlert(error.msg, 'danger')))}
     dispatch({type: REGISTER_FAIL})
   }
  }

  //login user
export const login = (formData ) => async dispatch => {
    const config ={
      'Content-Type': 'application/json'
    } 
  //const body = JSON.stringify(formData);
   try {
     const res = await axios.post('/api/auth', formData, config);
     dispatch({type: LOGIN_SUCCESS, payload: res.data})
     dispatch(loadUser());
   } catch (error) {
     const errors = error.response.data.errors;
     if (errors) {errors.forEach( error => dispatch (setAlert(error.msg, 'danger')))}
     dispatch({type: LOGIN_FAIL})
   }
  };

  //logout user
  export const logout = () => dispatch => {
    dispatch({type: CLEAR_PROFILE})
    dispatch({type: LOGOUT})
    
  }