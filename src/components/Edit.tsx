import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  List,
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Collapse,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Grid,
} from '@material-ui/core';
import { db, auth } from '../fb';
import { useParams, useHistory } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

interface IEditProps {}

type EditProps = IEditProps;

export interface Player {
  bets: number,
  currentBalance: number,
  name: string,
  photo: string,
  startingBalance: number,
  profit: number,
  wins: number,
}

const Edit: FunctionComponent<IEditProps> = (props: IEditProps) => {
  const {} = props;
  const {roomId} = useParams<{ roomId: string }>();
  const history = useHistory();
  const classes = useStyles();

  const [room, setRoom] = useState<any>({});

  console.log(roomId);

  useEffect(() => {
    if (!roomId) return history.push("/");
    if (!auth.currentUser) return history.push("/sign-in");

    const {uid} = auth.currentUser;
    let roomRef = db.ref('rooms').child(roomId);
    const sub = roomRef.on('value', snap => { setRoom(snap.val());});

    return () => roomRef.off('value', sub);
  }, [roomId]);

  console.log(room);
  const players = room.players;

  const removePlayer = (id: string) => {
    db.ref('rooms').child(roomId).child('players').update({[id]: null});
  };
  const cashOut = (id: string) => {
    db.ref('rooms')
      .child(roomId)
      .child('players')
      .child(id)
      .update({currentBalance: 0, startingBalance:0});
  };
  const increaseBalance = (id: string, value: number) => {
    const newBalance = players[id].currentBalance + value;
    const newStartingBalance= players[id].startingBalance + value;
    db.ref('rooms')
      .child(roomId)
      .child('players')
      .child(id)
      .update({currentBalance: newBalance, startingBalance: newStartingBalance});
  };

  return (
      <div className={classes.Edit}>
        <Typography variant={"h5"}>Room: {roomId}</Typography>
        <List>{!players
               ? ""
               : Object.keys(players).map(playerId => {
              const player: Player = players[playerId];
              return <PlayerItem
                  isAdmin={room?.host === auth.currentUser?.uid}
                  id={playerId}
                                 player={player}
                                 cashOut={cashOut}
                                 removePlayer={removePlayer}
                                 increaseBalance={increaseBalance} />;
            })}

        </List>
      </div>);
};

interface PlayerItemProps {
  isAdmin: boolean,
  player: Player,
  id: string,
  removePlayer: (id: string) => void,
  cashOut: (id: string) => void,
  increaseBalance: (id: string, value: number) => void
}

const PlayerItem = ({
                      player,
                      id,
                      isAdmin,
                      cashOut,
                      increaseBalance,
                      removePlayer,
                    }: PlayerItemProps) => {
  const [expand, setExpand] = useState(true);
  const classes = useStyles();

  const toggle = () => setExpand(!expand);

  return <><ListItem>
    <ListItemAvatar>
      <Avatar src={player.photo} />
    </ListItemAvatar>
    <ListItemText primary={player.name}
                  secondary={`$${player.currentBalance} / $${player.startingBalance}`} />
    {isAdmin
     ? <ListItemSecondaryAction><IconButton onClick={toggle}>{expand
                                                              ? <ExpandLess />
                                                              :
                                                              <ExpandMore />}</IconButton></ListItemSecondaryAction>
     : ""}

  </ListItem>
    <Collapse in={expand}>
      <ListItem>
        <Grid container
              spacing={2}
              direction={"column"}>
          <Grid item
                container
                xs={12}
                spacing={2}>
            <Grid item
                  className={classes.spacer} />
            <Grid item><Button onClick={()=>increaseBalance(id, 5)} variant={'contained'}>+$5</Button></Grid>
            <Grid item><Button onClick={()=>cashOut(id)} variant={'contained'}>Cash Out</Button></Grid>
          </Grid>
          <Grid item
                container
                xs={12}
                spacing={2}>
            <Grid item
                  className={classes.spacer} />
          <Grid item><Button disabled={isAdmin || player.currentBalance !==0} color={"secondary"} variant={'contained'} onClick={()=>removePlayer(id)}>{isAdmin ? "Cant remove host" : "Remove"}</Button></Grid></Grid>
        </Grid>
      </ListItem>
    </Collapse> </>;
};

const useStyles = makeStyles(theme=>({
  Edit:{},
  spacer:{flexGrow:1}
}))
export default Edit;
