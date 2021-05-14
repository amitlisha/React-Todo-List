import React, { FunctionComponent } from "react";
import Todo from "../../../models/Todo";
import TimePickModal from "../TimePickModal";
import CompleteTodoModal from "../CompleteTodoModal";

interface Props {
  isTimeModalOpen: boolean;
  currentTodoToUpdate: Todo;
  isDeadlineModalOpen: boolean;
  currentTodoDeadline: Todo;
  handleTodoUpdate: (todoToUpdate: Todo) => Promise<void>;
  onTimeModalClose: () => void;
  onDeadlineModalClose: () => void;
}

// TODO: please read about SOLID. especially on Open for extension Closed for modification principle and
// redesign this component entirely.
// hint: extract it into different modals and I want you to explain why this implementation is wrong is aspect of design and performance issues with react life cycles
const Modals: FunctionComponent<Props> = ({
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
