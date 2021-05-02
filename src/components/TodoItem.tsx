import Checkbox from "@material-ui/core/Checkbox";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React, { FunctionComponent, useState } from "react";
import Todo from "../models/Todo";
import "../styles/TodoItem.css";

interface IProps {
  todo: Todo;
  onDelete: (todoToDeleteID: number) => void;
  onTodoUpdate: (todoToUpdate: Todo) => void;
}

const TodoItem: FunctionComponent<IProps> = ({
  todo,
  onDelete,
  onTodoUpdate,
}) => {
  const [editTodo, setEditTodo] = useState<boolean>(false);
  const [tempTodoText, setTempTodoText] = useState<string>(todo.text);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTodoUpdate({ ...todo, isCompleted: event.target.checked });
  };

  const handleTodoEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTodoText(event.target.value);
  };

  const handleTodoDelete = () => {
    if (todo.id) {
      onDelete(todo.id as number);
    }
  };

  const enableEdit = () => {
    setEditTodo(true);
  };

  const handleClickOutside = () => {
    if (editTodo) {
      setEditTodo(false);
      onTodoUpdate({ ...todo, text: tempTodoText });
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickOutside}>
      <div className="todo-item">
        <ListItem dense button divider onDoubleClick={enableEdit}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={todo.isCompleted}
              onChange={handleCheckboxChange}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          {editTodo ? (
            <TextField onChange={handleTodoEdit} value={tempTodoText} />
          ) : (
            <ListItemText
              style={{
                textDecoration: todo.isCompleted ? "line-through" : "none",
              }}
              primary={todo.text}
            />
          )}
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
    </ClickAwayListener>
  );
};

export default TodoItem;
