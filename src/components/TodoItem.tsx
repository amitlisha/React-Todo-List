import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React, { FunctionComponent, useState } from "react";
import Todo from "../models/Todo";

interface IProps {
  todo: Todo;
  onDelete: (todoToDelete: Todo) => void;
}

const TodoItem: FunctionComponent<IProps> = ({ todo, onDelete }) => {
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDone(event.target.checked);
  };

  const handleTodoDelete = () => {
    onDelete(todo);
  };

  return (
    <div>
      <ListItem dense button divider>
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
          primary={todo.text}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={handleTodoDelete}>
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
};

export default TodoItem;
