import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React, { FunctionComponent, useState } from "react";

interface IProps {
  todoText: string;
}

const Todo: FunctionComponent<IProps> = ({ todoText }) => {
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDone(event.target.checked);
  };

  return (
    <div>
      <ListItem dense button>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={isDone}
            onChange={handleCheckboxChange}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          style={{ textDecoration: isDone ? "line-through" : "none" }}
          primary={todoText}
        />
      </ListItem>
    </div>
  );
};

export default Todo;
