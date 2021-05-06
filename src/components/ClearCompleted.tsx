import Button from "@material-ui/core/Button";
import React, { FunctionComponent } from "react";

interface IProps {
  onClear: () => void;
}

const ClearCompleted: FunctionComponent<IProps> = ({ onClear }) => {
  const handleClear = (event: React.MouseEvent<HTMLElement>) => {
    onClear();
  };

  return (
    <Button style={{ height: "100%" }} variant="outlined" onClick={handleClear}>
      Clear completed
    </Button>
  );
};

export default ClearCompleted;
