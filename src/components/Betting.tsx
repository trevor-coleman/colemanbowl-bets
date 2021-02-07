import React, {
  FunctionComponent,
  useEffect,
  useState, useCallback,
} from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  ListItem,
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Grow, GridListTile,
} from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import BetListItem from './bets/BetListItem';
import { useParams, useHistory } from 'react-router-dom';
import { db, auth } from '../fb';
import Round from './bets/Round';
import UserCard from './UserCard';

interface IBettingProps {}

type BettingProps = IBettingProps;

const Betting: FunctionComponent<IBettingProps> = (props: IBettingProps) => {
  const {} = props;
  const classes = useStyles();
  const {roomId} = useParams<{roomId:string, round?:string}>();
  const history=useHistory();

  const [room, setRoom] = useState<any>({})

  const leaveRoom = ()=>{
    if(!auth.currentUser) {
      history.push("/");
      return;
    }
    db.ref(`profiles/${auth.currentUser.uid}/currentRoom`).set(null);
    history.push("/");
  }

  useEffect(()=> {
    if(!roomId) {
      history.push("/");
      return;
    }
    db.ref(`rooms`).child(roomId).on('value', snap=> {
      const val = snap.val();
      setRoom(val)
    })
    return ()=> db.ref(`rooms`).child(roomId).off()
  }, [roomId])

  const onSelect = useCallback((option:string) => {

  },[roomId, auth.currentUser])

  const roundId = room?.currentRound;

  function addCategory(newCategory:string): void {
    const newOptions = [...room.options];
    newOptions.push(newCategory);
    db.ref(`rooms/${roomId}`).child("options").set(newOptions);
    db.ref(`rounds/${roundId}`).child("options").set(newOptions);
  }


  return (
      <div className={classes.Bets}><UserCard/>
        <Round addCategory={addCategory}
               room={room}
               roundId={roundId} />
      </div>
      );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      Bets: {
      ...theme.mixins.toolbar},
      spacer: {flexGrow:1},

    }));

export default Betting;


