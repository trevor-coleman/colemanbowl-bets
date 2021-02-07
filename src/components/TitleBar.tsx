import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { SportsFootball } from '@material-ui/icons';
import { Button, AppBar, Toolbar, Typography } from '@material-ui/core';
import { auth } from '../fb';
import { useHistory } from 'react-router-dom';

interface ITitleBarProps {}

type TitleBarProps = ITitleBarProps;

const TitleBar: FunctionComponent<ITitleBarProps> = (props: ITitleBarProps) => {
  const {} = props;
  const classes = useStyles();
  const history=useHistory();

  return (
      <AppBar position={"sticky"}>
        <Toolbar>
          <div className={classes.menuButton}><SportsFootball /></div>
          <Typography variant={"h6"}
                      className={classes.title}>ColemanBowl</Typography>
          <Button color="inherit"
                  onClick={() => {
                    auth.signOut();
                    history.push("/sign-in")
                  }}>Sign Out</Button>
        </Toolbar>
      </AppBar>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      TitleBar: {},
      title     : {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
    }));

export default TitleBar;
