import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Menu, MenuItem } from '@material-ui/core';
import { db } from '../fb';
import { RoundInfo } from './bets/Round';
import { encode } from '../firebase-encode';

interface ISelectWinnerButtonProps {roomId:string|undefined, roundId:string|undefined, roundInfo: Partial<RoundInfo>}

type SelectWinnerButtonProps = ISelectWinnerButtonProps;

const SelectWinnerButton: FunctionComponent<ISelectWinnerButtonProps> = (props: ISelectWinnerButtonProps) => {
  const {roomId, roundId, roundInfo} = props;
  const classes = useStyles();


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const selectOption=(option:string) => {
    if(!roomId) return;
    const winningOption = option;
    const winningPlayer = roundInfo?.bets?.[encode(option)] ?? null;

    db.ref(`rounds/${roundId}`).update({
      status:"complete", winningOption, winningPlayer})

    if(winningPlayer) {
      const winnerCurrentBalanceRef = db.ref('rooms')
                                        .child(roomId)
                                        .child('players')
                                        .child(winningPlayer.uid)
                                        .child("currentBalance");

      winnerCurrentBalanceRef.once('value', snap=> {
        console.log(snap.val());
        const currentBalance = snap.val();
        const newBalance = currentBalance + roundInfo.pot;
        winnerCurrentBalanceRef.set(newBalance);
      })
    }



  }

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
      <><Button fullWidth
              onClick={handleClick}
                variant={'contained'}>Select Winner</Button>
        <Menu id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
          { roundInfo?.options ? roundInfo.options.map(option=>
                           <MenuItem key={`selectWinner-${encode(option)}`} onClick={()=>selectOption(option)}>{option}</MenuItem>):""}
          <MenuItem onClick={()=>selectOption("none")}>None</MenuItem>
        </Menu>
      </>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      SelectWinnerButton: {},
    }));

export default SelectWinnerButton;
