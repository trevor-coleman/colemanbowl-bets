import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItem,
  ListItemSecondaryAction, IconButton,
} from '@material-ui/core';
import { CheckCircle, Delete } from '@material-ui/icons';
import { auth } from '../../fb';

interface IBetListItemProps {
  bet?: {
    uid: string,
    photoURL: string,
    name: string },
  option: string,
  onSelect:  (option:string )=>void,
  onCancel:  (option:string )=>void


}

type BetListItemProps = IBetListItemProps;

const BetListItem: FunctionComponent<IBetListItemProps> = (props: IBetListItemProps) => {
  const {
    bet,
    option,onSelect,onCancel
  } = props;
  const classes = useStyles();

  console.log("BET", bet?.uid);

  const isMyBet = bet?.uid === auth?.currentUser?.uid;


  return (
      <ListItem button onClick={()=>onSelect(option)}
                disabled={Boolean(bet) && !isMyBet}>
        <ListItemAvatar>{bet
                         ? <Avatar alt={bet.name} src={bet.photoURL} />
                         : <Avatar>
                           <CheckCircle />
                         </Avatar>}
        </ListItemAvatar>
        <ListItemText primary={option}
                      secondary={bet?.name} />
        {isMyBet ? <ListItemSecondaryAction><IconButton onClick={()=>onCancel(option)}><Delete/></IconButton></ListItemSecondaryAction> :""}
      </ListItem>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      BetListItem: {},
    }));

export default BetListItem;
