import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React, { FunctionComponent, useState, useEffect } from "react";
import Todo from "../../../models/Todo";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Moment } from "moment";

interface IProps {
  handleClose: () => void;
  isOpen: boolean;
  todo: Todo;
  updateTodoTime: (updatedTodo: Todo) => void;
}

const TimePickModal: FunctionComponent<IProps> = ({
  handleClose,
  isOpen,
  todo,
  updateTodoTime,
}) => {
  const [newDate, setNewDate] = useState<number>(todo.deadlineTime as number);

  useEffect(() => {
    setNewDate(todo.deadlineTime as number);
  }, [todo]);

  const handleUpdateSubmit = () => {
    updateTodoTime({ ...todo, deadlineTime: newDate });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Update Todo's Deadline Time</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            label="Deadline"
            inputVariant="outlined"
            value={newDate}
            onChange={(date: MaterialUiPickersDate) =>
              setNewDate((date as Moment).valueOf())
            }
            style={{ margin: "0 auto", display: "flex" }}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          style={{ margin: "0 auto" }}
          onClick={handleUpdateSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimePickModal;
