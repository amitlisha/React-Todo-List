import React, { FunctionComponent, useState } from "react";
import { sizing } from "@material-ui/system";
import Paper from "@material-ui/core/Paper";
import { Box } from "@material-ui/core";

interface IProps {}

const TodosCard: FunctionComponent<IProps> = () => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div>
      <Box m="auto" width="30%" height="30%">
        <Paper>Amit</Paper>
      </Box>
    </div>
  );
};

export default TodosCard;
