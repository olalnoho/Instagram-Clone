import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Landing from './components/UI/Landing/Landing';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import OtherProfile from './components/OtherProfile/OtherProfile';

function App() {
  return (
    <div className="container flex">
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/profiles/:username" component={OtherProfile} />
      </Switch>
    </div>
  )
}

export default App;
