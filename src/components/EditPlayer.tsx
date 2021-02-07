import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";

interface IEditPlayerProps {}

type EditPlayerProps = IEditPlayerProps;

const EditPlayer: FunctionComponent<IEditPlayerProps> = (props: IEditPlayerProps) => {
  const {} = props;
  const classes = useStyles();



  return (
      <div className={classes.EditPlayer}>
        EditPlayer </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      EditPlayer: {},
    }));

export default EditPlayer;
