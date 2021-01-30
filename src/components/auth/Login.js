import React, {useState} from 'react'
import {Link, Redirect} from "react-router-dom"
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {login} from '../../actions/auth'

function Login(props){
  const [formData, setFormData] = useState({
    email: '',
    password: '', 
  });
  const {email, password} =formData;
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
  const onSubmit = async (e) => {
    e.preventDefault();
    props.login(formData);
  };
  //redirect if logged in
  if (props.isAuthenticated) {
    return <Redirect to='/Dashboard' />
  }
  return (
    <>
    <h1 className="large text-primary">Sign In</h1>
    <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
    <form className="form" onSubmit= { e => onSubmit(e)}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          required
          value={email}
          onChange={e => onChange(e)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
        />
      </div>
      <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to='/Register'>Sign Up</Link>
      </p>
    </>
  );
};

Login.propTypes ={
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}
const mapStateToProps =  state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);
