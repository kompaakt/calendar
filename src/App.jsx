import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AppProviders from "context";
import Layout from "layout";

import CalendarPage from "pages/calendar";
import EventsPage from "pages/events";

const App = () => {
  return (
    <AppProviders>
      <Layout>
        <Router>
          <Switch>
            <Route exact path="/" component={CalendarPage} />
            <Route exact path="/events" component={EventsPage} />
          </Switch>
        </Router>
      </Layout>
    </AppProviders>
  );
};

export default App;
