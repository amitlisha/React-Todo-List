import { DialogContent } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DateTimePicker } from "@material-ui/pickers/DateTimePicker";
import React, { FunctionComponent } from "react";
import Todo from "../models/Todo";

interface IProps {
  handleClose: () => void;
  isOpen: boolean;
  todo: Todo;
}

const ClearCompleted: FunctionComponent<IProps> = ({
  handleClose,
  isOpen,
  todo,
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Update todo's deadline time</DialogTitle>
      <DialogContent>
        <DateTimePicker
          label="DateTimePicker"
          inputVariant="outlined"
          value={new Date()}
          onChange={() => console.log()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClearCompleted;
