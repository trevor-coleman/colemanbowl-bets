import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  AppBar,
  Typography,
  Toolbar,
  Grid,
  Button,
  Container,
  Divider,
  BottomNavigation, BottomNavigationAction,
} from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, useHistory,
} from 'react-router-dom';
import Home from './components/Home';
import Betting from './components/Betting';
import { makeStyles } from '@material-ui/core/styles';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import BottomNav from './components/BottomNav';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './components/SignIn';
import { SportsFootball } from '@material-ui/icons';
import {auth} from './fb'
import TitleBar from './components/TitleBar';

const useStyles = makeStyles(theme=> ({
  nav: {
    display:"flex",
    width:"100%",
    flexDirection: "row",
    border: "1px solid grey",
    listStyle:"none"
  },
  navItem: {
    flexGrow:1,
    display: "flex",
    border:"1px solid grey",
    width:"100%",
    background: theme.palette.grey['200']
  }, container: {
    height:"90vh",
    padding: theme.spacing(2),
  },
  wrapper: {
    overflow:"hidden"
  },
   bottomNav:{
    height:"10vh"
   },

}))

function App() {
  const classes=useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();



  return (
    <div className="App" >
      <div className={classes.wrapper}>
        <Router>
          <TitleBar />
          <Container className={classes.container}>
            <Switch>
              <PrivateRoute path={"/bets/:roomId"}><Betting/></PrivateRoute>
              <Route path="/sign-in"><SignIn/></Route>
              <PrivateRoute path={"/"}><Home/></PrivateRoute>
            </Switch>
          </Container>
          <BottomNav/>

        </Router>
      </div>




    </div>
  );
}

export default App;
