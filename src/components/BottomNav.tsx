import React, { FunctionComponent } from 'react';
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


interface IBottomNavProps {}

type BottomNavProps = IBottomNavProps;

const BottomNav: FunctionComponent<IBottomNavProps> = (props: IBottomNavProps) => {
  const {} = props;
  const classes = useStyles();
  const history = useHistory();

  console.log(history.location);

  let path = history.location.pathname;
  if(history.location.pathname.includes("bets")) path="/"
  if (history.location.pathname.includes("edit")) path = "/edit"
  if (history.location.pathname.includes("score")) path = "/scores"



  return (
      <AppBar position="fixed"
              color="primary"
              style={{
                top   : "auto",
                bottom: 0
              }}>
        <BottomNavigation value={path}
                          onChange={(event, newValue) => {
                            console.log(newValue);
                            history?.push(newValue);
                          }}>
          <BottomNavigationAction label="Home"
                                  value="/"
                                  icon={<SvgIcon viewBox={"0 0 477.778 477.778"}><PokerChips/></SvgIcon>} />
          <BottomNavigationAction label="Edit List"
                                  value="/edit"
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
