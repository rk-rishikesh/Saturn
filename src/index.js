import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Landing from "views/pages/Landing.js";
import Login from "views/pages/Login.js";
import Profile from "views/pages/Profile.js";
import Register from "views/pages/Register.js";
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <BrowserRouter>
  <MoralisProvider serverUrl="https://imnqywbyiecn.usemoralis.com:2053/server" appId="mdUPmSjsfAEZgyrVZtVUUARnKygQZbk7qHxXvgwQ">
    <Switch>
      <Route path="/" exact render={props => <Index {...props} />} />
      <Route
        path="/landing-page"
        exact
        render={props => <Landing {...props} />}
      />
      <Route path="/login-page" exact component={(props) => <Login {...props} />} />
      <Route
        path="/profile-page"
        exact
        render={props => <Profile {...props} />}
      />
      <Route
        path="/register-page"
        exact
        render={props => <Register {...props} />}
      />
      <Redirect to="/" />
    </Switch>
    </MoralisProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
