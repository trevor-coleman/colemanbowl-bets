import React, { FunctionComponent, useEffect, useState } from 'react';
import { db, auth } from '../../fb';
import BetListItem from './BetListItem';
import {
  List, Typography, ListItem, TextField, ListItemText, Button,
} from '@material-ui/core';
import { encode } from '../../firebase-encode';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface IRoundProps {
  round?: string,
  room: any,
  addCategory: (category: string) => void;
}

type RoundProps = IRoundProps;

const Round: FunctionComponent<IRoundProps> = (props: IRoundProps) => {
  const {
    room,
    addCategory,
    round,
  } = props;
  const classes = useStyles();
  const [roundInfo, setRoundInfo] = useState<any>({});
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (round) {
      console.log("Setting Listener", round);
      db.ref('rounds').child(round).on('value', snap => {
        console.log(snap.val());
        setRoundInfo(snap.val());
      });

      return () => db.ref('rounds').child(round).off();
    }
  }, [round, room]);

  console.log(roundInfo.options);

  const betOnSelected = (option: string) => {
    if (!round) return;
    if (auth.currentUser === null) return;
    const {
      uid,
      photoURL,
      displayName,
    } = auth.currentUser;
    db.ref('rounds')
      .child(round)
      .child('bets')
      .update({
                [encode(option)]: {
                  uid,
                  displayName,
                  photoURL,
                },
              });
  };

  const cancelBet = (option: string) => {
    if (!round) return;
    if (auth.currentUser === null) return;
    db.ref('rounds').child(round).child('bets').update({
                                                         [encode(option)]: null,
                                                       });
  };

  const bets = roundInfo?.bets ?? {};

  const endBetting = ()=> {
    let betAmounts: { [key:string]:number } = {}
    let playerUpdates: {[key:string]: any } = {};
    let roundUpdate = {};
    let roomUpdate = {}
    let pot = roundInfo?.pot ?? 0;
    for(let bet in bets) {
      const uid = bets[bet].uid;
      betAmounts[uid] = betAmounts[uid]
                        ? betAmounts[uid] + 1
                        : 1;
      pot++;
    }
    const roundRef = db.ref(`/rounds/${round}`)
    const roomRef= db.ref(`/rooms/${roundInfo.room}`)
    roundRef.child("status").set("inProgress");
    roundRef.child('pot').set(pot);
    roomRef.child('players').once('value', snap => {
      const players = snap.val();
      for(let player in betAmounts) {
        roomRef.child('players').child(player).child("currentBalance").set(
            players[player].currentBalance - betAmounts[player])
      }




    })
    console.log(pot, betAmounts);
  }
  const pot = (roundInfo?.pot ?? 0) + Object.keys(bets).length;

  return (
      <div className={classes.scroll}><Typography variant={"h6"}>${pot} </Typography>
        <List>
          <ListItem><Button fullWidth onClick={endBetting}
                            variant={'contained'}
                            color={"secondary"}>END BETTING</Button></ListItem>
          {roundInfo?.options
           ? roundInfo
               .options.map((item: any) => <BetListItem key={round + item}
                                                        onSelect={betOnSelected}
                                                        onCancel={cancelBet}
                                                        bet={roundInfo?.bets?.[encode(
                                                            item)]}
                                                        option={item} />)
           : ""}
          <ListItem><TextField fullWidth
                               placeholder={"Category"}
                               className={classes.input}
                               variant={'outlined'}
                               value={newCategory}
                               onChange={(e) => setNewCategory(e.target.value)} /></ListItem>
          <ListItemText><Button onClick={() => addCategory(newCategory)}
                                color="secondary"
                                variant={"contained"}>Add
                                                      Category</Button></ListItemText>
        </List></div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      Round: {},
      input: {flexGrow: 1},
      scroll: {overflow: "scroll"}
    }));

export default Round;
