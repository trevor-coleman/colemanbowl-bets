import React from 'react';
import './App.css';
import { Container } from '@material-ui/core';
import {
  BrowserRouter as Router, Switch, Route, useHistory,
} from 'react-router-dom';
import Home from './components/Home';
import Betting from './components/Betting';
import { makeStyles } from '@material-ui/core/styles';
import BottomNav from './components/BottomNav';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './components/SignIn';
import TitleBar from './components/TitleBar';

const useStyles = makeStyles(theme => (
    {
      nav      : {
        display      : "flex",
        width        : "100%",
        flexDirection: "row",
        border       : "1px solid grey",
        listStyle    : "none",
      },
      navItem  : {
        flexGrow  : 1,
        display   : "flex",
        border    : "1px solid grey",
        width     : "100%",
        background: theme.palette.grey['200'],
      },
      container: {
        height : "90vh",
        overflow:"scroll",
        padding: theme.spacing(2),
        overscrollBehavior:"none"


      },
      bottomNav: {
        height: "10vh",
      },

    }));

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  return(
      <Router>
      <div className="App">
          <TitleBar />
          <Container className={classes.container}>
            <Switch>
              <PrivateRoute path={"/bets/:roomId"}><Betting /></PrivateRoute>
              <Route path="/sign-in"><SignIn /></Route>
              <PrivateRoute path={"/"}><Home /></PrivateRoute>
            </Switch>
          </Container>
          <BottomNav />

      </div>
</Router>
  );
}

export default App;
