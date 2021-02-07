import React, { FunctionComponent, useState, useEffect } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  BottomNavigation, BottomNavigationAction, AppBar, SvgIcon,
} from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useHistory } from 'react-router-dom';
import { ReactComponent as PokerChips } from './svg/casino-chip-svgrepo-com.svg'
import { ReactComponent as Podium } from './svg/podium-svgrepo-com.svg'
import { ListAlt } from '@material-ui/icons';
import { auth, db } from '../fb';
import { Player } from './Edit';


interface IBottomNavProps {}

type BottomNavProps = IBottomNavProps;

const BottomNav: FunctionComponent<IBottomNavProps> = (props: IBottomNavProps) => {
  const {} = props;
  const classes = useStyles();
  const history = useHistory();

  const [room, setRoom] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {return;}

    const {uid} = auth.currentUser;
    let roomRef = db.ref('profiles').child(uid).child('currentRoom');
    const sub = roomRef.on('value', snap => { setRoom(snap.val())})

    return () => roomRef.off('value', sub)
  }, [auth.currentUser])


  return (
      <AppBar position="fixed"
              color="primary"
              style={{
                top   : "auto",
                bottom: 0
              }}>
        <BottomNavigation value={0}
                          onChange={(event, newValue) => {
                            history?.push(newValue);
                          }}>
          <BottomNavigationAction label="Home"
                                  value="/"
                                  icon={<SvgIcon viewBox={"0 0 477.778 477.778"}><PokerChips/></SvgIcon>} />
          <BottomNavigationAction label="Edit List"
                                  value={`/edit/${room}`}
                                  icon={<ListAlt />} />
          <BottomNavigationAction label="Scores"
                                  value="/scores"
                                  icon={
                                    <SvgIcon viewBox={"0 0 511.998 511.998"}><Podium /></SvgIcon>} />
        </BottomNavigation>
      </AppBar>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      BottomNav: {},
    }));

export default BottomNav;
