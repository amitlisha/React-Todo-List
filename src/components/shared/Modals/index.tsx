import React, { FunctionComponent } from "react";
import Todo from "../../../models/Todo";
import TimePickModal from "../TimePickModal";
import CompleteTodoModal from "../CompleteTodoModal";

interface Props {
  isTimeModalOpen: boolean;
  todoToUpdate: Todo;
  isDeadlineModalOpen: boolean;
  expiredTodo: Todo;
  handleTodoUpdate: (todoToUpdate: Todo) => Promise<void>;
  onTimeModalClose: () => void;
  onDeadlineModalClose: () => void;
}

// TODO: please read about SOLID. especially on Open for extension Closed for modification principle and
// redesign this component entirely.
// hint: extract it into different modals and I want you to explain why this implementation is wrong is aspect of design and performance issues with react life cycles
const Modals: FunctionComponent<Props> = ({
  isTimeModalOpen,
  todoToUpdate,
  isDeadlineModalOpen,
  expiredTodo,
  handleTodoUpdate,
  onTimeModalClose,
  onDeadlineModalClose,
}) => {
  return (
    <div>
      {todoToUpdate && (
        <TimePickModal
          isOpen={isTimeModalOpen}
          handleClose={onTimeModalClose}
          todo={todoToUpdate}
          updateTodoTime={handleTodoUpdate}
        ></TimePickModal>
      )}
      {expiredTodo && (
        <CompleteTodoModal
          isOpen={isDeadlineModalOpen}
          handleClose={onDeadlineModalClose}
          todo={expiredTodo}
          updateTodoState={handleTodoUpdate}
        ></CompleteTodoModal>
      )}
    </div>
  );
};

export default Modals;
