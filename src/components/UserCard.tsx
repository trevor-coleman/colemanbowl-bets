import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CardContent, Grid, Avatar, Typography, Card } from '@material-ui/core';
import { auth } from '../fb';

interface IUserCardProps {}

type UserCardProps = IUserCardProps;

const UserCard: FunctionComponent<IUserCardProps> = (props: IUserCardProps) => {
  const {} = props;
  const classes = useStyles();

  return (
      <Card className={classes.card}>
        <CardContent><Grid container
                           spacing={2}>
          <Grid container
                direction={"row"}
                spacing={2}>
            <Grid item
                  xs={2}><Avatar src={auth.currentUser?.photoURL ??
                                      ""} /></Grid>
            <Grid item><Typography variant={'h5'}>{auth?.currentUser?.displayName ??
                                                   "Player"}</Typography></Grid>
          </Grid></Grid>
</CardContent>
      </Card>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      UserCard: {},
      card: {marginBottom: theme.spacing(2)},
      current: {},
      profit : {},
    }));

export default UserCard;
