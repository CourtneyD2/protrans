import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Spinner} from '../layout/spinner'
import {getProfileById} from '../../actions/profile'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGitHub from './ProfileGitHub'

const Profile = ({match, getProfileById, profile: {profile, loading}, auth }) => {
  console.log(profile)
  useEffect (() => { 
    getProfileById(match.params.id)
  }, [getProfileById,match.params.id])
  return (
    <Fragment>
      {profile === null || loading ? <Spinner /> 
      :<Fragment>
        <Link to='/Profiles' className= "btn  btn-light" >Find People</Link>
        {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&(
          <Link to='/edit-profile' className= "btn btn-dark">Edit</Link>
        )}
      <div className="profile-grid my-1">
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
        <div className="profile-exp bg-white p-2">
          <h2 className="text-primary">Experience</h2>
          {profile.experiance.length > 0 
            ? (<Fragment>
                {profile.experiance.map(exp => (<ProfileExperience key={exp._id} experience={exp} /> ) )}   
              </Fragment>)
            : (<h4>No Experience added</h4>)}
          {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&(<Link to="/add-experience" className="btn btn-primary">Add Experience</Link>)}
        </div>
        <div className="profile-edu bg-white p-2">
          <h2 className="text-primary">Education</h2>
          {profile.education.length > 0 
            ? (<Fragment>
                {profile.education.map(edu => (<ProfileEducation key={edu._id} education={edu} /> ) )}   
              </Fragment>)
            : (<h4>No Experience added</h4>)}
          {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&(<Link to="/add-education" className="btn btn-primary">Add Education</Link>)}
        </div>
        {profile.githubusername && (<ProfileGitHub username={profile.githubusername} />)}
      </div>
      </Fragment>
      }
    </Fragment>
  )
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(mapStateToProps,{getProfileById})(Profile)
