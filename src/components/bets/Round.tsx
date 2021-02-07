import React, { FunctionComponent, useEffect, useState } from 'react';
import { db, auth } from '../../fb';
import BetListItem from './BetListItem';
import {
  List, Typography, ListItem, TextField, ListItemText, Button,
} from '@material-ui/core';
import { encode } from '../../firebase-encode';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SelectWinnerButton from '../SelectWinnerButton';

export interface RoundInfo {
  settled: boolean,
  room: string,
  bets: {
    [key: string]: {
      uid: string,
      displayName: string,
      photoURL: string,
      collected: boolean
    }
  },
  options: string[];
  winningOption: string;
  winningPlayer: {
    uid: string,
    displayName: string,
    photoURL: string
  };

  [key: string]: any,

}

interface IRoundProps {
  roundId?: string,
  room: any,
  addCategory: (category: string) => void;
}

type RoundProps = IRoundProps;

const Round: FunctionComponent<IRoundProps> = (props: IRoundProps) => {
  const {
    room,
    addCategory,
    roundId,
  } = props;
  const classes = useStyles();
  const [roundInfo, setRoundInfo] = useState<Partial<RoundInfo>>({});
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (roundId) {
      const sub = db.ref('rounds').child(roundId).on('value', function updateState (snap)  {
        setRoundInfo(snap.val());
      });

      return () => db.ref('rounds').child(roundId).off('value', sub);
    }
  }, [roundId, room]);


  const betOnSelected = (option: string) => {
    if (!roundId) return;
    if (roundInfo.status === "inProgress") return;
    if (auth.currentUser === null) return;
    if (roundInfo?.bets?.[encode(option)]) return;
    const {
      uid,
      photoURL,
      displayName,
    } = auth.currentUser;
    db.ref('rounds')
      .child(roundId)
      .child('bets')
      .update({
                [encode(option)]: {
                  uid,
                  displayName,
                  photoURL,
                  collected: false,
                },
              });
  };

  const cancelBet = (option: string) => {
    if (!roundId) return;
    if (auth.currentUser === null) return;
    if (roundInfo?.bets?.[encode(option)]?.collected) return;
    const roundBetsRef = db.ref('rounds').child(roundId).child('bets');
    roundBetsRef.update({
                          [encode(option)]: null,
                        });
  };

  const bets = roundInfo?.bets ?? {};

  const reopenBetting = () => {
    const roundRef = db.ref(`/rounds/${roundId}`);
    roundRef.child("status").set("betting");
  };

  const selectNewWinner =()=>{


  }

  const endBetting = () => {
    if (!roundId) return;
    let betAmounts: { [key: string]: number } = {};
    let playerUpdates: { [key: string]: any } = {};
    let roundUpdate = {};
    let roomUpdate = {};
    let pot = roundInfo?.pot ?? 0;
    for (let bet in bets) {
      const currentBet = bets[bet];
      const {
        uid,
        collected,
      } = currentBet;
      if (collected) continue;
      betAmounts[uid] =
          betAmounts[uid]
          ? betAmounts[uid] + 1
          : 1;
      pot++;
      const roundBetsRef = db.ref('rounds').child(roundId).child('bets');
      roundBetsRef.child(bet).child("collected").set(true);

    }
    const roundRef = db.ref(`/rounds/${roundId}`);
    const roomRef = db.ref(`/rooms/${roundInfo.room}`);
    roundRef.child("status").set("inProgress");
    roundRef.child('pot').set(pot);
    roomRef.child('players').once('value', snap => {
      const players = snap.val();
      for (let player in betAmounts) {
        roomRef.child('players')
               .child(player)
               .child("currentBalance")
               .set(players[player].currentBalance - betAmounts[player]);
      }

    });
    console.log(pot, betAmounts);
  };
  const pot = ()=>{
    let pot = roundInfo?.pot ?? 0;
    for(let someBet in bets) {
      if(bets[someBet].collected) continue;
      pot++
    }

    return pot;
  }

  const nextRound = ()=>{
    if(!(roundInfo?.room && roundId)) return;
    const newRoundKey = db.ref('rounds').push({
                                                  status : "betting",
                                                  room   : roundInfo.room,
                                                  players: {
                                                    ...roundInfo.players
                                                  },
                                                  options: roundInfo.options,
                                                  bets   : {},
                                                  pot    : roundInfo.winningPlayer ? 0 : pot(),
                                                  created: new Date(),
                                                }).key;

    const newRounds = [...room.rounds, newRoundKey];
    db.ref('rooms').child(roundInfo.room).update({currentRound: newRoundKey, rounds: newRounds});
    db.ref('rounds').child(roundId).update({settled: true});
  }

  return (
      <div>
        <Typography variant={"h6"}>Pot: ${pot()} </Typography>
        <List>
          {roundInfo.status === "betting"
           ? <ListItem><Button fullWidth
                               onClick={endBetting}
                               variant={'contained'}
                               color={"secondary"}>END
                                                   BETTING</Button></ListItem>
           : ""}
          {roundInfo.status === "inProgress"
           ? <ListItem><Button fullWidth
                               disabled
                               onClick={endBetting}
                               variant={'contained'}
                               color={"secondary"}>ROUND IN
                                                   PROGRESS</Button></ListItem>
           : ""}
          {roundInfo.status === "complete"
           ? <ListItem><Button fullWidth
                               disabled
                               onClick={endBetting}
                               variant={'contained'}
                               color={"secondary"}>ROUND COMPLETE</Button></ListItem>
           : ""}
          {roundInfo?.options
           ? roundInfo
               .options.map((item: any) => <BetListItem key={roundId + item}
                                                        onSelect={betOnSelected}
                                                        onCancel={cancelBet}
                                                        bet={roundInfo?.bets?.[encode(
                                                            item)]}
                                                        option={item} />)
           : ""}

        {roundInfo.status === "betting"
                      ? <><ListItem><TextField fullWidth
                                               placeholder={"Category"}
                                               className={classes.input}
                                               variant={'outlined'}
                                               value={newCategory}
                                               onChange={(e) => setNewCategory(e.target.value)} /></ListItem>
              <ListItem><ListItemText><Button fullWidth
                                              onClick={() => addCategory(
                                                  newCategory)}
                                              color="primary"
                                              variant={"contained"}>Add
                                                                    Category</Button></ListItemText></ListItem></>
                      : ""}
          {roundInfo.status === "inProgress"
           ? <><ListItem><Button fullWidth
                                 onClick={reopenBetting}
                                 variant={'contained'}>REOPEN
                                                       BETTING</Button></ListItem>
                <ListItem><SelectWinnerButton roundId={roundId}
                                              roomId={roundInfo?.room} /></ListItem>
           </>
           : ""}
          {roundInfo.status === "complete"
           ? <><ListItem><Button fullWidth
                                 disabled={roundInfo.settled}
                                 onClick={selectNewWinner}
                                 variant={'contained'}>Select New
                                                       Winner</Button></ListItem>
                <ListItem><Button fullWidth
                                  disabled={roundInfo.settled}
                                  onClick={nextRound}
                                  color={"secondary"}
                                  variant={'contained'}>Next
                                                        Round</Button></ListItem>

           </>
           : ""}</List></div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      Round: {},
      input: {flexGrow: 1},
    }));

export default Round;
