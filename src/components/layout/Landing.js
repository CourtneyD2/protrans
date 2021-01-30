import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'


const Landing = (props) => {
  if(props.isAuthenticated) {
    return <Redirect to='/Dashboard' />
  }
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Pro<span style={{"fontSize": "0.8rem", "fontWeight": "200", "letterSpacing": "2px" }}>fessional</span>-Trans</h1>
          <p className="lead">
            A place where professional trans and non-binary folks can connect and their allies 
          </p>
          <p className="mb-1">
            Find collegues, discuss experiances and concerns, organize change 
          </p>
          <div className="buttons">
            <Link to="/Register" className="btn btn-primary">Sign Up</Link>
            <Link to="/Login" className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing);