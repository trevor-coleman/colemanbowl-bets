import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Grid, Typography, TextField, Button, Divider, Box,
} from '@material-ui/core';
import { db, auth } from '../fb';
import roomCode from '../roomCode';
import { Redirect, useHistory } from 'react-router-dom';

interface IJoinRoomProps {}

type JoinRoomProps = IJoinRoomProps;

const defaultOptions = ["Fast Food", "Financial Services", "Restaurants", "Internet / Online", "Insurance", "Movie / TV", "Mobile Phones"]


const JoinRoom: FunctionComponent<IJoinRoomProps> = (props: IJoinRoomProps) => {
  const {} = props;
  const classes = useStyles();
  const [currentRoom, setCurrentRoom] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!auth.currentUser) return;

    const {uid} = auth.currentUser;
    db
        .ref('profiles')
        .child(uid)
        .child("currentRoom")
        .on("value", snap => setCurrentRoom(snap.val()));

    return ()=>{
      db.ref('profiles')
          .child(uid)
          .child("currentRoom").off()
    };
  });

  const createRoom = () => {
    const roomId = roomCode.generateCode();
    if (!auth.currentUser) {history.push("/"); return;}
    const {uid, displayName, photoURL} = auth.currentUser;
    const roundKey = db.ref("rounds").push().key
    if(!roundKey) {console.error("Failed to get round key");return;}

    db.ref('rooms').update({
                             [roomId]: {
                               round: 0,
                               status: "betting",
                               rounds: [roundKey],
                               host: uid,
                               players: {
                                 [uid]: {
                                   name           : auth.currentUser.displayName,
                                   startingBalance: 50,
                                   currentBalance : 50,
                                   wins           : 0,
                                   bets           : 0,
                                   photo          : auth.currentUser.photoURL,
                                 },
                               },
                               options: defaultOptions,
                             },

                           });

    db.ref('profiles').child(uid).update({currentRoom: roomId});
    db.ref('rounds').update({
      [roundKey]: {
        room: roomId,
        players: {
          [uid]:{displayName, photoURL}
        },
        options: defaultOptions,
        taken: {},
      }
    })

  };


  return (
      currentRoom
      ? <Redirect to={`/bets/${currentRoom}`} />
      : <Grid container
              spacing={8}>
        <Grid item
              xs={12}>
          <Typography variant={"h6"}>Enter Room Code</Typography>
          <Box m={2}><TextField fullWidth
                                variant={"outlined"} /></Box>
          <Button variant={"contained"}
                  color={"primary"}
                  size={"large"}
                  fullWidth>Join a Room</Button>
        </Grid>
        <Divider />
        <Grid item
              xs={12}>

          <Button onClick={createRoom}
                  variant={"contained"}
                  color={"primary"}
                  size={"large"}
                  fullWidth>Create a Room</Button>
        </Grid>
      </Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      JoinRoom: {},
    }));

export default JoinRoom;