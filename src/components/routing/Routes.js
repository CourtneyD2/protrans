import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Login from "../auth/Login"
import Register from "../auth/Register"
import Dashboard from '../dashboard/Dashboard'
import CreateProfile from '../profileform/createprofile'
import Alert from '../layout/Alert'
import PrivateRoute from '../routing/PrivateRoute'
import EditProfile from '../profileform/editprofile'
import Profiles from '../Profiles/Profiles'
import Profile from '../profile/Profile'
import Posts from '../posts/Posts'
import Post from '../Post/Post'
import AddExperiance from '../profileform/addexperiance'
import AddEducation from '../profileform/addeducation'
import {NotFound} from '../layout/notfound'


export const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/Register" component={Register} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Profiles" component={Profiles} />
        <Route exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/Dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute exact path="/add-experience" component={AddExperiance} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
        <PrivateRoute exact path="/posts" component={Posts} />
        <PrivateRoute exact path="/posts/:id" component={Post} />
        <Route component={NotFound} />
      </Switch>
    </section>
  )
}
