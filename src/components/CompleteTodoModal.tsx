import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React, { FunctionComponent, useState, useEffect } from "react";
import Todo from "../models/Todo";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Moment } from "moment";
import Box from "@material-ui/core/Box";

interface IProps {
  handleClose: () => void;
  isOpen: boolean;
  todo: Todo;
  updateTodoState: (updatedTodo: Todo) => void;
}

const CompleteTodoModal: FunctionComponent<IProps> = ({
  handleClose,
  isOpen,
  todo,
  updateTodoState,
}) => {
  const handleUpdateSubmit = () => {
    updateTodoState({ ...todo, isCompleted: true });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        The todo deadline is up, do you wish to check it as completed?
      </DialogTitle>
      <DialogContent>
        <Box>{todo.text}</Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleUpdateSubmit}>
          Complete Todo
        </Button>
        <Button variant="outlined" onClick={handleUpdateSubmit}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteTodoModal;
