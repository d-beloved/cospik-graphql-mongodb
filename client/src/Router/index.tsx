import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from 'Pages/Auth/Signup';
import Login from 'Pages/Auth/Login';
import Students from 'Pages/Student/AllStudents';
import Courses from 'Pages/Courses';
import OneStudent from 'Pages/Student/StudentDetails';
import NotFound from 'Pages/NotFound';
import Notify from 'Components/Notify';
import Protected from 'Components/Protected';

export default function Routes() {
  return (
    <Router>
      <Notify />
      <Switch>
        <Route exact path= '/' component={Signup} />
        <Route exact path= '/login' component={Login} />
        <Protected exact path= '/students' Component={Students} />
        <Protected exact path= '/courses' Component={Courses} />
        <Protected path= '/student/:id' Component={OneStudent} />
        <Route path= '*' component={NotFound} />
      </Switch>
    </Router>
  );
}
