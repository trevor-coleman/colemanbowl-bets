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
  ListItemSecondaryAction, Typography,
} from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import BetListItem from './bets/BetListItem';
import { useParams, useHistory } from 'react-router-dom';
import {db} from '../fb'
import Round from './bets/Round';

interface IBettingProps {}

type BettingProps = IBettingProps;

const Betting: FunctionComponent<IBettingProps> = (props: IBettingProps) => {
  const {} = props;
  const classes = useStyles();
  const {roomId, round} = useParams<{roomId:string, round?:string}>();
  const history=useHistory();

  const [room, setRoom] = useState<any>({})

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
  }, [roomId, round])

  const onSelect = useCallback((option:string) => {

  },[])

  const roundId = room?.rounds?.[room.round];

  return (
      <div><Typography variant={"h3"}>{roomId}</Typography>
        <Round room={room} round={roundId}/>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      Bets: {},
    }));

export default Betting;


