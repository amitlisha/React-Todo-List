import Button from "@material-ui/core/Button";
import React, { FunctionComponent } from "react";

interface IProps {
  onClear: () => void;
}

// TODO: rename component, component should not be named as verbs
const ClearCompleted: FunctionComponent<IProps> = ({ onClear }) => {
  // TODO: why do you need this method?
  // TODO: this is one of the cases to use React.memo and deal with `onClear` accordingly
  const handleClear = (event: React.MouseEvent<HTMLElement>) => {
    onClear();
  };

  return (
    // TODO: read about makeStyles of Mui and implement it just so you'd get familiar with it
    <Button style={{ height: "100%" }} variant="outlined" onClick={handleClear}>
      Clear completed
    </Button>
  );
};

export default ClearCompleted;
