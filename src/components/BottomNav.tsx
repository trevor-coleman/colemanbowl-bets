import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  BottomNavigation,
  BottomNavigationAction, AppBar,
} from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useHistory } from 'react-router-dom';

interface IBottomNavProps {}

type BottomNavProps = IBottomNavProps;

const BottomNav: FunctionComponent<IBottomNavProps> = (props: IBottomNavProps) => {
  const {} = props;
  const classes = useStyles();
  const history = useHistory();

  return (
      <AppBar position="fixed"
              color="primary"
              style={{
                top   : "auto",
                bottom: 0
              }}>
        <BottomNavigation value={0}
                          onChange={(event, newValue) => {
                            console.log(newValue);
                            history?.push(newValue);
                          }}>
          <BottomNavigationAction label="Home"
                                  value="/"
                                  icon={<RestoreIcon />} />
          <BottomNavigationAction label="Bets"
                                  value="bets"
                                  icon={<RestoreIcon />} />
          <BottomNavigationAction label="History"
                                  value="history"
                                  icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Scores"
                                  value="scores"
                                  icon={<LocationOnIcon />} />
        </BottomNavigation>
      </AppBar>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      BottomNav: {},
    }));

export default BottomNav;
