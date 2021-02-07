import React, { FunctionComponent, useState, useEffect } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { SportsFootball } from '@material-ui/icons';
import { Button, AppBar, Toolbar, Typography } from '@material-ui/core';
import { auth, db } from '../fb';
import { useHistory } from 'react-router-dom';

interface ITitleBarProps {}

type TitleBarProps = ITitleBarProps;

const TitleBar: FunctionComponent<ITitleBarProps> = (props: ITitleBarProps) => {
  const {} = props;
  const classes = useStyles();
  const history=useHistory();

  const [userState, setUserState] = useState<"inRoom" | "signedIn" | "signedOut">("signedOut");
  const user=auth.currentUser;
  useEffect(()=>{
    const user=auth.currentUser;
    if(!user) {setUserState("signedOut");
    return
    }
    const {uid} = user;
    const sub = db.ref('profiles').child(uid).child('currentRoom').on('value', snap=>{
      console.log("TTTITLELT: ", snap.val())
      setUserState(snap.val() ? "inRoom" : 'signedIn');
    })

    return ()=> db.ref('profiles').child(uid).child('currentRoom').off('value', sub);

  }, [auth.currentUser])

  const signOut = () => {
    auth.signOut();
    history.push("/sign-in")
  }

  const leaveRoom = async () => {
    if(!user) {signOut; return;}
    const {uid} = user;
    await db.ref('profiles').child(uid).update({currentRoom:null})
    history.push("/")
  }

  return (
      <AppBar position={"sticky"}>
        <Toolbar>
          <div className={classes.menuButton}><SportsFootball /></div>
          <Typography variant={"h6"}
                      className={classes.title}>ColemanBowl</Typography>
          {userState === "signedIn" ? <Button color="inherit"
                  onClick={signOut}>Sign Out</Button> : ""}
          {userState === "inRoom"
           ? <Button color="inherit"
                     onClick={leaveRoom}>Leave Room</Button>
           : ""}

        </Toolbar>
      </AppBar>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      TitleBar: {},
      title     : {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
    }));

export default TitleBar;
