import React, { Fragment } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth'

const NavBar = (props) => {
  const authLinks = (
    <ul>
      <li><Link to="/Profiles">People</Link></li>
      <li><Link to="/posts">Posts</Link></li>
      <li><Link to="/Dashboard"><i className="fas fa-user" /><span className="hide-sm">Dashboard</span></Link></li>
      <li><a onClick={props.logout} href='#!' > <i className="fas fa-sign-out-alt" />
       <span className="hide-sm">Log Out</span></a></li>
    </ul>

  );

  const guestLinks = (
    <ul>
      <li><Link to="/Profiles">People</Link></li>
      <li><Link to="/Register">Register</Link></li>
      <li><Link to="/Login">Login</Link></li>
    </ul>
  )
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fab fa-connectdevelop"></i>Pro-Trans</Link>
      </h1>
      {!props.auth.loading && (<Fragment>{props.auth.isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
  )
};

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state =>({
  auth: state.auth
})

export default connect(mapStateToProps, {logout})(NavBar);