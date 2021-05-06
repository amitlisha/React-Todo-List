import React, { FunctionComponent } from "react";
import Todo from "../models/Todo";
import TimePickModal from "./TimePickModal";
import CompleteTodoModal from "./CompleteTodoModal";

interface IProps {
  isTimeModalOpen: boolean;
  currentTodoToUpdate: Todo;
  isDeadlineModalOpen: boolean;
  currentTodoDeadline: Todo;
  handleTodoUpdate: (todoToUpdate: Todo) => Promise<void>;
  onTimeModalClose: () => void;
  onDeadlineModalClose: () => void;
}

const Modals: FunctionComponent<IProps> = ({
  isTimeModalOpen,
  currentTodoDeadline,
  isDeadlineModalOpen,
  currentTodoToUpdate,
  handleTodoUpdate,
  onTimeModalClose,
  onDeadlineModalClose,
}) => {
  return (
    <div>
      {currentTodoToUpdate && (
        <TimePickModal
          isOpen={isTimeModalOpen}
          handleClose={onTimeModalClose}
          todo={currentTodoToUpdate}
          updateTodoTime={handleTodoUpdate}
        ></TimePickModal>
      )}
      {currentTodoDeadline && (
        <CompleteTodoModal
          isOpen={isDeadlineModalOpen}
          handleClose={onDeadlineModalClose}
          todo={currentTodoDeadline}
          updateTodoState={handleTodoUpdate}
        ></CompleteTodoModal>
      )}
    </div>
  );
};

export default Modals;
