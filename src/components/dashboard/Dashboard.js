import React, {Fragment, useEffect} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile, deleteAccount} from '../../actions/profile'
import {Dashboardactions} from './dashboardactions'
import Experience from './Experience'
import Education from './Education'
import  {Spinner} from '../layout/spinner'

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile])

  return (loading && profile === null) 
    ? <Spinner /> 
    : <Fragment>
       <h1 className="large text-primary">Dashboard</h1>
      <p className="lead"><i className="fas fa-user"></i> Welcome {user && user.name}</p>
      {profile !== null 
      ? <Fragment>
        <Dashboardactions />
        <Experience experience = {profile.experiance} />
        <Education education = {profile.education} />
        <div className= "my-2">
          <button onClick={()=> deleteAccount()} className="btn btn-danger"><i className="fas fa-user-minus" />Delete Account</button></div>
        </Fragment> 
      : <Fragment>
        <p>You have not yet set up a profile, please do so now</p>
        <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</Link>
        </Fragment> }

      
    </Fragment>

}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
