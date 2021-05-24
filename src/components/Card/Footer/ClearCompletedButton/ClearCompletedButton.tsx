import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";

interface Props {
  onClear: () => void;
}

const useStyles = makeStyles({
  button: {
    height: "100%",
  },
});

const ClearCompletedButton: FunctionComponent<Props> = ({ onClear }) => {
  const classes = useStyles();
  return (
    <Button className={classes.button} variant="outlined" onClick={onClear}>
      Clear completed
    </Button>
  );
};

export default React.memo(ClearCompletedButton);
