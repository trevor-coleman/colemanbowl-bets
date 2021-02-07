import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItem,
  ListItemSecondaryAction, IconButton,
} from '@material-ui/core';
import { CheckCircle, Delete, Check } from '@material-ui/icons';
import { auth } from '../../fb';

interface IBetListItemProps {
  bet?: {
    uid: string,
    photoURL: string,
    displayName: string, collected?: boolean },
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
  const isMyBet = bet?.uid === auth?.currentUser?.uid;

  return (
      <ListItem classes={{disabled: classes.disabled, selected: classes.selected}} selected={isMyBet} button onClick={()=>onSelect(option)}
                disabled={Boolean(bet) && !isMyBet}>
        <ListItemAvatar>{bet
                         ? <Avatar alt={bet?.displayName} src={bet.photoURL} />
                         : <Avatar/>
                         }
        </ListItemAvatar>
        <ListItemText primary={option} />
        {isMyBet
         ? bet?.collected
          ? <ListItemSecondaryAction><IconButton disabled><Check /></IconButton></ListItemSecondaryAction>
          : <ListItemSecondaryAction><IconButton onClick={()=>onCancel(option)}><Delete/></IconButton></ListItemSecondaryAction>
         : ""}
      </ListItem>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      BetListItem: {},
      disabled: {backgroundColor:theme.palette.warning.light, opacity:"0.8 !important"},
      selected: {backgroundColor:`${theme.palette.success.light} !important`, opacity:"0.8 !important"}
    }));

export default BetListItem;
