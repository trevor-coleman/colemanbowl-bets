import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { db,auth } from '../../fb';
import BetListItem from './BetListItem';
import { List } from '@material-ui/core';
import {encode} from '../../firebase-encode'



interface IRoundProps {
  round?: string,
  room: any
}

type RoundProps = IRoundProps;

const Round: FunctionComponent<IRoundProps> = (props: IRoundProps) => {
  const {
    room,
    round,
  } = props;
  const classes = useStyles();
  const [roundInfo, setRoundInfo] = useState<any>({});

  useEffect(() => {
    if (round) {
      console.log("Setting Listener", round);
      db.ref('rounds').child(round).on('value', snap => {
        console.log(snap.val());
        setRoundInfo(snap.val());
      });

      return ()=> db.ref('rounds').child(round).off();
    }
  }, [round, room]);

  console.log(roundInfo.options);

  const betOnSelected  = (option:string)=> {
    if(!round) return;
    if(auth.currentUser === null) return;
    const {uid, photoURL, displayName } = auth.currentUser;
    db.ref('rounds').child(round).child('bets').update({[encode(option)]:{uid, displayName, photoURL}})
  }

  const cancelBet = (option:string)=> {
    if (!round) return;
    if (auth.currentUser === null) return;
    db.ref('rounds').child(round).child('bets').update({
                                                      [encode(option)]:null
                                                    })
  }

  return (
      <List>
        {roundInfo?.options
         ? roundInfo.options.map((item: any) => <BetListItem onSelect={betOnSelected} onCancel={cancelBet} bet={roundInfo?.bets?.[encode(item)]} option={item}/>)
         : ""}
      </List>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      Round: {},
    }));

export default Round;
