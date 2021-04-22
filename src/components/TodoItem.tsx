import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React, { FunctionComponent, useState } from "react";
import Todo from "../models/Todo";
import "../styles/TodoItem.css";

interface IProps {
  todo: Todo;
  onDelete: (todoToDelete: Todo) => void;
  onTodoUpdate: (todoToUpdate: Todo) => void;
}

const TodoItem: FunctionComponent<IProps> = ({
  todo,
  onDelete,
  onTodoUpdate,
}) => {
  const [isDone, setIsDone] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTodoUpdate({ ...todo, isCompleted: event.target.checked });
  };

  const handleTodoDelete = () => {
    onDelete(todo);
  };

  return (
    <div className="todo-item">
      <ListItem dense button divider>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.isCompleted}
            onChange={handleCheckboxChange}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}
          primary={todo.text}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleTodoDelete}
            className="delete-button"
          >
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
};

export default TodoItem;
